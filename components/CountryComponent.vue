<script setup>
import { useStore } from "~/store";

const props = defineProps(["country", "serviceCategories", "serviceCategory"]);

const router = useRouter();
const store = useStore();

const service = ref(null);
const submitting = ref(false);
const valid = ref(true);
const promo = ref(true);
const formHtml = ref(null);
const form = reactive({
  qty: 1,
});

const isNigerian = computed(() => store.location.countryName === "Nigeria");
const price = computed(() => {
  return service.value && service.value.price && form.qty
    ? service.value.price * form.qty
    : 0;
});

const sortedCategories = computed(() => {
  return props.serviceCategories.sort((a, b) => a.order - b.order);
});

const setService = () => {
  if (service.value) {
    const doc = document.getElementById("service-features");
    if (doc) {
      doc.innerHTML = service.value.features;
    }
  }
};

const openConsultationForm = () => {
  router.push("/book-consultation/visa-services");
};

const addToBasket = async () => {
  const data = {
    qty: form.qty,
    name: service.value.title,
    price: service.value.price,
    totalPrice: price.value,
    attributes: {
      id: service.value.id,
      country: props.country,
    },
  };
  const { valid } = await formHtml.value.validate();
  if (valid) {
    submitting.value = true;
    await store.dispatch("basket/addToBasket", data);
    submitting.value = false;
  } else {
    store.setToast("Please fill all required fields", { type: "error" });
  }
};

const goToCheckout = async () => {
  const { valid } = await formHtml.value.validate();
  if (valid) {
    try {
      await addToBasket();
      router.push("/basket");
    } catch (error) {
      useErrorHandler(error);
    }
  } else {
    store.setToast("Please fill all required fields", { type: "error" });
  }
};
</script>

<template>
  <div>
    <!-- 10% off promo -->
    <!-- <section v-if="service && promo && isNigerian" class="promo-disclaimer">
      <div class="relative d-flex justify-space-between">
        <div class=""></div>
        <p class="">
          🇳🇬 Exclusive Offer: 10% Discount at Checkout and you can also pay in Naira! 🎉
        </p>
        <v-icon class="pointer" color="#fff" @click="promo = !promo">mdi-close</v-icon>
      </div>
    </section> -->
    <v-form
      v-model="valid"
      lazy-validation
      ref="formHtml"
      class="services"
      @submit.prevent="addToBasket"
    >
      <v-select
        v-model="service"
        :items="sortedCategories"
        :item-value="(e) => e"
        :menu-props="{ bottom: true, offsetY: true }"
        placeholder="Select Service"
        height="70px"
        class="my-4"
        variant="outlined"
        item-text="title"
        @change="setService"
      ></v-select>
      <div v-if="service" class="features my-5">
        <p v-if="service && service.description">{{ service.description }}</p>
        <h3>Features</h3>
        <ul class="mb-5">
          <li v-for="item in useParseJSON(service.features)" :key="item">
            {{ item }}
          </li>
        </ul>
        <p v-if="service && service.extra_features">{{ service.extra_features }}</p>
        <p v-if="service && service.price">
          This visa costs <span class="active">${{ service.price }} per applicant</span>
        </p>
        <!-- <h3 class="mt-6">Purchase Service</h3>
        <v-row class="mt-2 mb-6">
          <v-col cols="12" md="6">
            <div class="purchase">
              <h4>Number of Persons</h4>
              <p>Choose the number of persons you are purchasing visas for</p>
              <div class="d-flex align-center">
                <button
                  type="button"
                  class="purchase__btn"
                  @click="form.qty > 1 ? form.qty-- : ''"
                >
                  -
                </button>
                <div class="purchase__btn purchase__btn--number">{{ form.qty }}</div>
                <button type="button" class="purchase__btn" @click="form.qty++">+</button>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="purchase purchase--price">
              <h4>Price</h4>
              <p>Price varies according to the number of persons</p>
              <br />
              <div class="purchase__actions d-flex align-center">
                <div class="purchase__btn">${{ price }}</div>
              </div>
            </div>
          </v-col>
        </v-row>
        <div class="d-flex algn-center justify-space-between">
          <v-btn
            type="submit"
            class="action__btn d-flex align-center justify-center mx-3"
            elevation="0"
            :loading="submitting"
          >
            <iconify-icon icon="fontisto:shopping-basket-add" class="mr-2"></iconify-icon>
            Add to Basket
          </v-btn>
          <v-btn
            type="button"
            elevation="0"
            class="action__btn action__btn--register"
            @click="goToCheckout"
          >
            Buy Now
          </v-btn>
        </div> -->
        <div class="d-flex algn-center justify-space-between">
          <v-btn
            type="button"
            elevation="0"
            class="action__btn action__btn--register"
            @click="openConsultationForm"
          >
            Book Consultation
          </v-btn>
        </div>
      </div>
    </v-form>
  </div>
</template>

<style scoped lang="scss">
h3 {
  font-size: 24px;
}
.active {
  color: $loiz-pink;
  font-weight: 700;
}
.action {
  &__btn {
    padding: 5px 20px;
    min-width: 30% !important;
    border-radius: 999px;
    border: 1px solid $loiz-pink;
    font-size: 0.9rem;
    color: $loiz-pink !important;
    background-color: #fff !important;
    &--register {
      background-image: linear-gradient(
        90deg,
        #ea0390 6.22%,
        #f178ae 47%,
        #13abd3 142.14%
      );
      border: none;
      color: #fff !important;
    }
  }
}
@media screen and (max-width: 600px) {
  h3 {
    font-size: 20px;
  }
}
</style>
