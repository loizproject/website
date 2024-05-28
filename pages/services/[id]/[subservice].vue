<script setup>
import { useStore } from "~/store";
import { useContentStore } from "~/store/content";
import { useBasketStore } from "~/store/basket";

const route = useRoute();
const router = useRouter();
const store = useStore();
const contentStore = useContentStore();
const basketStore = useBasketStore();

const getSlug = (route) => {
  const arr = route.split("/");
  const slug = arr[arr.length - 1]; // "/service/{service slug}""
  return slug;
};

const getServiceSlug = (route) => {
  const arr = route.split("/");
  const slug = arr[arr.length - 2]; // "/service/{service slug}/{subservice slug}"
  return slug;
};

const valid = ref(true);
const submitting = ref(true);
const promo = ref(true);
const canShowForm = ref(false); // hide form temporarily
const slug = getSlug(route.fullPath);
const serviceSlug = getServiceSlug(route.fullPath);
const country = ref(null);
const visaType = ref(null);
const destination = ref(null);
const form = ref({});
const qty = ref(1);
const state = ref(1);

const rules = {
  required: (value) => !!value || "Oops this is Required.",
};

const { dontShowPersons, testimonials, getSubservicesBySlug, allTestimonials } = computed(
  () => contentStore
).value;

const subservice = computed(() => {
  const subservice = getSubservicesBySlug(slug, serviceSlug);
  return subservice;
});

const isNigerian = computed(() => store.location.countryName === "Nigeria");

const visaTypes = computed(() => {
  const visas = getSubservicesBySlug("visa-facilitation", "visa-services");
  const res = [];
  if (visas && visas.service_categories) {
    visas.service_categories.forEach((item) => {
      item.country === country.value ? res.push(item) : null;
    });
  }
  return res;
});

const countries = computed(() => {
  const service_categories =
    subservice.value && subservice.value.service_categories
      ? subservice.value.service_categories
      : [];
  const countries = [];
  if (service_categories) {
    service_categories.forEach((element) => {
      countries.includes(element.country) ? null : countries.push(element.country);
    });
  }
  return countries;
});

const destinations = computed(() => {
  const service_categories =
    subservice.value && subservice.value.service_categories
      ? subservice.value.service_categories
      : [];
  const destinations = [];
  if (service_categories) {
    service_categories.forEach((element) => {
      element.country === country.value ? destinations.push(element) : null;
    });
  }
  return destinations;
});

const price = computed(() => (destination.value ? destination.value.price : 0));

const addToBasket = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    const data = {
      qty: qty.value,
      name: destination.value.title,
      price: price.value,
      totalPrice: price.value * qty.value,
      attributes: {
        id: destination.value.id,
        country: country.value,
      },
    };
    submitting.value = true;
    try {
      const res = await basketStore.addToBasket(data);
      console.log(res);
    } catch (error) {
      useErrorHandler(error);
    } finally {
      submitting.value = false;
    }
  } else {
    store.setToast("Please fill all required fields", { type: "error" });
  }
};

const goToCheckout = async () => {
  const { valid } = await form.value.validate();
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

onMounted(() => {
  country.value = route.query.country;
  destination.value = destinations.value.find((item) => item.title === route.query.title);
});

definePageMeta({
  layout: "services",
  middleware: ["redirect"],
});

const meta = computed(() => {
  return {
    title: subservice.value.title || "Visa Facilitation: Loiz Tours & Travels Ltd",
    description: subservice.value.description,
    image:
      subservice.value.image ||
      "https://res.cloudinary.com/loiztours/image/upload/site-media/img/atikh-bana.png",
    keywords:
      "visa fservices, visa renewals, travel, tours, vacations, domestic tours in nigeria, visa, visa services in nigeria, travel companies in nigeria",
  };
});
useSeoMeta({
  title: meta.value.title,
  ogTitle: meta.value.title,
  twitterTitle: meta.value.title,
  description: meta.value.description,
  ogDescription: meta.value.description,
  twitterDescription: meta.value.description,
  ogImage: meta.value.image,
  twitterImage: meta.value.image,
  twitterCard: "summary_large_image",
  twitterSite: "@Loiztravels",
  keywords: meta.value.keywords,
});
</script>

<template>
  <div class="visa-facilitation">
    <section v-if="destination && promo && isNigerian" class="promo-disclaimer">
      <div class="relative d-flex justify-space-between">
        <div class=""></div>
        <p class="">
          🇳🇬 Exclusive Offer: 10% Discount at Checkout and you can also pay in Naira! 🎉
        </p>
        <v-icon class="pointer" color="#fff" @click="promo = !promo">mdi-close</v-icon>
      </div>
    </section>
    <v-container v-if="subservice">
      <h1 class="mb-4">{{ subservice.title }}</h1>
      <p>
        {{ subservice.description }}
      </p>
      <v-divider class="line my-8"></v-divider>
      <v-btn
        large
        type="submit"
        elevation="0"
        class="submit px-8"
        @click="
          router.push(`/book-consultation/${serviceSlug}?subservice_id=${subservice.id}`)
        "
      >
        Book Consultation
      </v-btn>
    </v-container>
    <div v-if="canShowForm">
      <v-form v-model="valid" ref="form" lazy-validation>
        <v-container v-if="subservice">
          <h1 class="mb-4">{{ subservice.title }}</h1>
          <p>
            {{ subservice.description }}
          </p>
          <v-divider class="line my-8"></v-divider>

          <v-row align="center">
            <v-col v-if="countries && countries.length > 0" cols="12" md="6">
              <section id="country" class="country">
                <h3>Country</h3>
                <p class="mt-2 mb-4">
                  Choose a country you would like to purchase a visa to.
                </p>
                <v-select
                  v-model="country"
                  :items="countries"
                  :rules="countries.length > 0 ? [rules.required] : []"
                  solo
                  flat
                  label="Select Country"
                ></v-select>
              </section>
            </v-col>
            <v-col cols="12" md="6">
              <section id="destination" class="country mt-4 mt-md-0">
                <h3>Event</h3>
                <p class="mt-2 mb-4">
                  Choose the event you would like to purchase a trip to.
                </p>
                <v-select
                  v-model="destination"
                  :items="destinations"
                  :rules="destinations.length > 0 ? [rules.required] : []"
                  item-text="title"
                  :item-value="(e) => e"
                  solo
                  flat
                  label="Select destination"
                ></v-select>
              </section>
            </v-col>

            <v-col cols="12" :sm="dontShowPersons.includes(slug) ? 12 : 6">
              <div class="country">
                <h3>Type of Visa</h3>
                <p class="mt-2 mb-4">Choose a type of Visa you would like to purchase</p>
                <v-select
                  v-model="visaType"
                  :items="visaTypes"
                  item-text="title"
                  item-value="title"
                  :rules="[rules.required]"
                  solo
                  flat
                  label="Select Visa Type"
                ></v-select>
              </div>
            </v-col>
            <v-col v-if="!dontShowPersons.includes(slug)" cols="12" sm="6">
              <!-- Don't show this section if subservice is among the listed services that don't include no of persons -->
              <div class="purchase">
                <h4>Number of Persons</h4>
                <p>Choose the number of persons you are purchasing visas for</p>
                <div class="d-flex align-center">
                  <button
                    type="button"
                    class="purchase__btn"
                    @click="qty > 1 ? qty-- : ''"
                  >
                    -
                  </button>
                  <div class="purchase__btn purchase__btn--number">{{ qty }}</div>
                  <button type="button" class="purchase__btn" @click="qty++">+</button>
                </div>
              </div>
            </v-col>
          </v-row>
          <div class="price d-flex align-center justify-end text-right my-6">
            Price: <span class="price__value ml-2"> ${{ qty * price }} </span>
          </div>
          <v-row no-gutters align="center" class="details-header text-center">
            <v-col
              class="details-header-sect"
              :class="state === 1 ? 'details-header-sect--active' : ''"
            >
              <h4 @click="state = 1">Overview</h4>
            </v-col>
            <v-col
              class="details-header-sect"
              :class="state === 2 ? 'details-header-sect--active' : ''"
            >
              <h4 @click="state = 2">Testimonials</h4>
            </v-col>
          </v-row>
          <div v-if="state === 1" class="details-content pa-5">
            <div v-if="destination">
              <h3 class="mb-4">
                {{ destination.title }}
              </h3>
              <p>{{ destination.description }}</p>
              <h4>Feautres</h4>
              <ul class="mb-5">
                <li v-for="item in useParseJSON(destination.features)" :key="item">
                  {{ item }}
                </li>
              </ul>
              <nuxt-link class="variant" to="/book-consultation">
                Book Consultation
              </nuxt-link>
            </div>
            <div v-else>
              <p>{{ subservice.description }}</p>
              <nuxt-link class="variant" to="/book-consultation">
                Book Consultation
              </nuxt-link>
            </div>
          </div>
          <div v-if="state === 2" class="details-content pa-5">
            <h3 class="mb-4">Testimonials</h3>
            <div
              v-for="item in allTestimonials"
              :key="item.id"
              class="testimonials d-flex align-start my-2"
            >
              <v-avatar :size="$vuetify.breakpoint.smAndDown ? 38 : 45" class="mt-2">
                <v-img :src="`/img/testimonials/${item.imgUrl}`" alt="John"></v-img>
              </v-avatar>
              <div class="ml-2">
                <p class="testimonials__desc">
                  {{ item.content }}
                </p>
                <p class="testimonials__meta">
                  <i>{{ item.name }}</i
                  >. <i>{{ item.date }}</i>
                </p>
              </div>
            </div>
          </div>
        </v-container>
        <div class="d-flex align-center justify-space-between pa-4">
          <v-btn large class="add-to-cart ml-4" @click="addToBasket">
            <iconify-icon icon="fontisto:shopping-basket-add" class="mr-2"></iconify-icon>
            Add to Basket
          </v-btn>
          <v-btn large class="submit ml-4" @click="goToCheckout">
            Buy now
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.visa-facilitation {
  font-weight: 300;
}
.country {
  padding: 5%;
  background-color: $loiz-card-bg;
  border-radius: 8px;
  & p {
    font-size: 0.85rem;
  }
}
.price {
  font-weight: 600;
  font-size: 1.3rem;
  &__value {
    font-weight: 900;
    font-size: 2rem;
  }
}
.details-header {
  background-color: #e7e7e7;
  margin-left: calc(-6% - 18px);
  margin-right: calc(-6% - 18px);
}
.details-header-sect {
  padding: 10px !important;
  & h4 {
    margin-bottom: 0;
    font-size: 16px;
    font-weight: 700;
  }
  &--active {
    color: $loiz-sky-blue;
    border-bottom: 2px solid $loiz-sky-blue;
  }
}
a.variant {
  font-size: 16px;
}
.details-content {
  font-size: 0.9rem;
  height: 50vh;
  overflow-y: scroll;
  margin-bottom: 4%;
  & h3 {
    font-size: 1.4rem;
  }
  & h4 {
    font-size: 1.2rem;
  }
}
.add-to-cart {
  padding: 5px 20px;
  width: 25%;
  background-color: #fff !important;
  color: $loiz-pink !important;
  border-radius: 12px;
  box-shadow: none;
  border: 1px solid $loiz-pink !important;
  font-size: 0.9rem;
}
.submit {
  width: 25%;
  border-radius: 12px;
  box-shadow: none;
  font-size: 0.9rem;
}
.testimonials {
  &__desc {
    font-size: 0.9rem;
    font-weight: 300;
    margin-bottom: 8px;
  }
  &__meta {
    font-size: 0.8rem;
    font-weight: 300;
  }
}

@media screen and (max-width: 600px) {
  .add-to-cart {
    width: 40%;
  }
  .submit {
    width: 40%;
  }
  .details-content {
    font-size: 0.85rem;
    height: 50vh;
    & h3 {
      font-size: 1.12rem;
    }
    & h4 {
      font-size: 1rem;
    }
  }
}
</style>
