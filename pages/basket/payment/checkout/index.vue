<script setup>
import { loadScript } from "@paypal/paypal-js";
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { useStore } from "~/store";
import { useAuthStore } from "~/store/auth";
import { useBasketStore } from "~/store/basket";
import { useConsultationStore } from "~/store/consultation";
import { useContentStore } from "~/store/content";

const store = useStore();
const authStore = useAuthStore();
const basketStore = useBasketStore();
const contentStore = useContentStore();
const consultationStore = useConsultationStore();

const rules = useFormRules;
const { xs, mdAndUp } = useDisplay();
const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();

const formHtml = ref(null);
const success = ref(false);
const error = ref(false);
const searchTerm = ref(null);
const phoneResult = ref(null);
const mazPhoneKey = ref(1);
const textLimit = computed(() => (xs.value ? 12 : 25));
const payPalReady = ref(false);

const subTotal = computed(() => basketStore.getSubTotal);
const ngnSubTotal = computed(() => basketStore.getNgnSubTotal);
const user = computed(() => authStore.user);
const services = computed(() => contentStore.services);
const countries = computed(() => contentStore.countries);
const userLocation = computed(() => store.location.countryName);
const isNigerian = computed(() => store.location.countryCode === "NG");
const consultationPrice = computed(() => consultationStore.price);
const consultationPriceNGN = computed(() => consultationStore.priceNGN);
const rate = computed(() => store.rate);
const paths = computed(() => route.path.split("/"));

const form = ref({
  email: computed(() => (authStore.user ? authStore.user.email : null)).value,
  amount: subTotal.value,
  country: userLocation.value,
  fName: null,
  lName: null,
  phone: null,
});

const msg = ref({
  title: "Payment made succesfully!",
  text:
    "Thank you for your payment! Your transaction has been successfully processed. If you have any questions or require further assistance, please don't hesitate to reach out to us via the contact page. We'll be happy to help.",
});

const errorMsg = ref({
  title: "An error occoured.",
  text:
    "Unfortunately, we were unable to process your payment at this time. Please double-check the payment information you provided and ensure that there are sufficient funds available. If the issue persists, you can contact our customer support for assistance. We apologize for any inconvenience this may have caused.",
});

const basket = computed(() => {
  const bas = basketStore.basket;
  bas.forEach((item) => {
    !item.consultation
      ? (item.parentService = contentStore.getSubservicesById(item.options.subservice_id))
      : "";
  });
  return bas;
});

const filteredCountries = computed(() => {
  if (!searchTerm.value) {
    return countries;
  } else {
    return countries.filter((country) => {
      return country.name.toLowerCase().indexOf(searchTerm.value.toLowerCase()) > -1;
    });
  }
});

function clearForm() {
  formHtml.value.reset();
  form.value.phone = null;
  mazPhoneKey.value++;
}

function showHeaderIcon(index) {
  if (index === 0) {
    return false;
  } else if (index === paths.value.length - 1) {
    return false;
  } else {
    return true;
  }
}

function getPageRoute(item, index) {
  const pageArray = [];
  for (let i = 0; i <= index; i++) {
    const element = paths[i];
    pageArray.push(element);
  }
  return pageArray.join("/");
}

function autofill() {
  const { email, firstName, lastName, phoneNumber } = user.value || {};
  form.value.email = email;
  form.value.fName = firstName;
  form.value.lName = lastName;
  form.value.phone = phoneNumber;
}

function generateREF() {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now();
  }
  let ref = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return ref;
}

async function payWithPaystack(e) {
  e.preventDefault();
  const amount = isNigerian.value
    ? parseFloat(Number(ngnSubTotal.value))
    : parseFloat(Number(subTotal.value));
  const paystack = new PaystackPop();
  const reference = generateREF();
  form.value.amount = amount;
  form.value.country = userLocation.value;
  store.setToast("Initializing Transaction. Please wait...", { type: "info" });
  const newTrx = {
    reference,
    form: form.value,
    basket: basket.value,
  };
  try {
    await useAxiosPost("/orders/checkout", newTrx);
    paystack.newTransaction({
      key: config.public.PAYSTACK_PUBLIC_KEY,
      email: form.value.email,
      reference,
      amount: config.public.APP_ENV === "uat" ? 10000 : amount * 100,
      currency: isNigerian.value ? "NGN" : "USD",
      onSuccess: async (transaction) => {
        msg.value.info = `LTT Transaction Reference: ${transaction.reference}`;
        success.value = true;
        await basketStore.clearBasket();
        await useAxiosPost(`/orders/paystack/payments/${transaction.reference}/verify`, {
          status: "success",
        });
        await consultationStore.fetchAvailableDates();
      },
      onClose: async () => {
        errorMsg.value.info = `LTT Transaction Reference: ${newTrx.reference}`;
        error.value = true;
      },
    });
  } catch (error) {
    useErrorHandler(error);
  }
}

async function payWithRave(e) {
  e.preventDefault();
  const amount = isNigerian.value
    ? parseFloat(Number(ngnSubTotal.value))
    : parseFloat(Number(subTotal.value));
  const tx_ref = generateREF();
  form.value.amount = amount;
  form.value.country = userLocation.value;
  store.setToast("Initializing Transaction. Please wait...", {
    type: "info",
    duration: 1500,
  });
  const newTrx = {
    reference: tx_ref,
    form: form.value,
    basket: basket.value,
  };
  try {
    await useAxiosPost("/orders/checkout", newTrx);
    FlutterwaveCheckout({
      public_key: config.public.FLW_PUBLIC_KEY,
      tx_ref,
      amount: config.public.APP_ENV === "uat" ? 100 : amount,
      currency: isNigerian.value ? "NGN" : "USD",
      payment_options: "card, ussd, bank",
      customer: {
        email: form.value.email,
        phone_number: form.value.phone,
        name: `${form.value.fName} ${form.value.lName}`,
      },
      customizations: {
        title: "Loiz Tours & Travels Ltd",
        description: "Payment for an awesome service/exprtience",
        logo: "https://res.cloudinary.com/loiztours/image/upload/site-media/svg/logo.svg",
      },
      callback: async (payment) => {
        msg.value.info = `LTT Transaction Reference: ${payment.tx_ref}.`;
        success.value = true;
        await useAxiosPost(`/orders/flutterwave/payments/${payment.tx_ref}/verify`, {
          status: "success",
          payment_id: payment.transaction_id
        });
        await basketStore.clearBasket();
        await consultationStore.fetchAvailableDates();
      },
      onclose: async function (incomplete) {
        if (incomplete) {
          errorMsg.value.info = `LTT Transaction Reference: ${tx_ref}`;
          error.value = true;
        }
      },
    });
  } catch (error) {
    useErrorHandler(error);
  }
}

async function initPayPal() {
  let paypal;
  if (
    !(
      isNigerian.value &&
      (config.public.APP_ENV === "uat" || config.public.APP_ENV === "production")
    )
  ) {
    try {
      paypal = await loadScript({
        clientId: config.public.PAYPAL_CLIENT_ID,
        currency: "USD",
      });
    } catch (error) {
      console.error("failed to load the PayPal JS SDK script", error);
    }
  }

  if (paypal) {
    try {
      await payWithPayPal(paypal);
    } catch (error) {
      console.error("failed to render the PayPal Buttons", error);
    }
  }
}

async function payWithPayPal(paypal) {
  const amount = parseFloat(Number(subTotal.value));
  form.value.amount = amount;
  form.value.country = userLocation.value;
  const reference = generateREF();
  const newTrx = {
    reference,
    form: form.value,
    basket: basket.value,
  };
  try {
    paypal
      .Buttons({
        style: {
          layout: "vertical",
          color: "silver",
          shape: "rect",
          label: "paypal",
          tagline: false,
        },
        createOrder() {
          return useAxiosPost("/payments/paypal-checkout", newTrx)
            .then((response) => response.data.data.order)
            .catch((error) => useErrorHandler(error));
        },
        onApprove(data) {
          return useAxiosPost("/payments/paypal-checkout-capture", {
            orderID: data.orderID,
          })
            .then((response) => {
              console.log(response);
              return response;
            })
            .then(async (orderData) => {
              console.log(
                "Capture result",
                orderData,
                JSON.stringify(orderData, null, 2)
              );
              const transaction = orderData.purchase_units[0].payments.captures[0];
              msg.value.info = `LTT Transaction ${transaction.status}: ${transaction.id}.`;
              success.value = true;
              await basketStore.clearBasket();
              await consultationStore.fetchAvailableDates();
            })
            .catch((error) => useErrorHandler(error));
        },
      })
      .render("#paypal-button-container");
  } catch (error) {
    console.log(error);
    useErrorHandler(error);
  }
}

const handleSuccessClose = () => {
  success.value = false;
  router.push("/");
};

onMounted(async () => {
  await store.fetchRates();
  await basketStore.fetchBasket();
  // initPayPal();
  autofill();
});

definePageMeta({
  middleware: ["auth"],
});

useHead({
  script: [
    { src: "https://js.paystack.co/v2/inline.js", async: true, defer: true },
    {
      src: "https://checkout.flutterwave.com/v3.js",
      async: true,
      defer: true,
    },
  ],
});
</script>

<template>
  <div id="checkout" class="mb-10">
    <div class="header d-flex align-center py-4">
      <v-container class="d-flex align-center">
        <button
          v-if="mdAndUp"
          class="d-flex align-center action__btn"
          @click="router.go(-1)"
        >
          <v-icon color="#e7028e" class="mr-2"> mdi-chevron-left</v-icon>
          Back
        </button>
        <v-spacer></v-spacer>
        <div class="navigation d-flex align-center">
          <nuxt-link to="/">Home</nuxt-link>
          <v-icon color="#555" class="mx-2 mt-1">mdi-chevron-right</v-icon>
          <div v-for="(item, index) in paths" :key="index">
            <nuxt-link
              v-if="item !== 'services'"
              :to="getPageRoute(item, index)"
              :style="index === paths.length - 1 ? 'color: #e7028e' : ''"
              >{{
                item && item.length > textLimit
                  ? `${_StartCase(_ToLower(item.substring(0, textLimit)))}...`
                  : _StartCase(_ToLower(item))
              }}</nuxt-link
            >
            <v-icon
              v-if="item !== 'services' && showHeaderIcon(index)"
              color="#555"
              class="mx-2"
              >mdi-chevron-right</v-icon
            >
          </div>
        </div>
        <v-spacer></v-spacer>
        <button
          v-if="mdAndUp"
          class="d-flex align-center action__btn"
          @click="router.go(+1)"
        >
          Next
          <v-icon color="#e7028e" class="ml-2"> mdi-chevron-right</v-icon>
        </button>
      </v-container>
    </div>
    <v-container class="d-md-flex align-start justify-center">
      <div id="summary" class="summary mr-md-10 mt-6 mt-md-0 mx-auto">
        <div class="tile pa-5">
          <h4>Order Summary</h4>
          <div class="tile pa-3 mt-8">
            <div v-for="(n, i) in basket" :key="i">
              <div
                v-if="n.consultation"
                class="d-flex align-center justify-space-between"
              >
                <p>Consultation Session</p>
                <p v-if="isNigerian">
                  <strong>₦{{ useAmtToString(consultationPriceNGN) }}</strong>
                </p>
                <p v-else>
                  <strong>${{ consultationPrice }}</strong>
                </p>
              </div>
              <div v-else class="d-flex align-start justify-space-between mb-3">
                <p>{{ n.name }}</p>
                <p v-if="isNigerian" class="ml-5">
                  <strong> ₦{{ useAmtToString(n.price * n.qty) }} </strong>
                </p>
                <p v-else class="ml-5">${{ n.price * n.qty }}</p>
              </div>
            </div>
            <div class="d-flex align-end justify-space-between mt-5">
              <p><strong>Subtotal</strong></p>
              <p v-if="isNigerian" class="summary__price">
                <b> ₦{{ useAmtToString(ngnSubTotal) }} </b>
              </p>
              <p v-else class="summary__price">
                <strong>${{ useAmtToString(subTotal) }}</strong>
              </p>
            </div>
            <!-- <div v-if="isNigerian" class="mt-2">
              <div class="d-flex align-end justify-space-between">
                <p class="promo text-right">🇳🇬 10% off on services! ✅</p>
                <p class="summary__price">
                  <strong> ₦{{ useAmtToString(getNgnSubTotal) }} </strong>
                </p>
              </div>
              <p class="promo promo--info mt-2">
                Note: This 10% discount is not applicable to consultation bookings.
              </p>
            </div> -->
          </div>
        </div>
      </div>
      <div id="payment-provider" class="provider mt-10 mt-md-0 mx-auto mx-md-0">
        <h3>Payment</h3>
        <p>Select preferred payment method.</p>
        <v-row class="mt-5">
          <v-col cols="6">
            <button
              class="provider__btn provider__btn--paystack"
              :disabled="basket.length === 0"
              @click="payWithPaystack"
            >
              <img
                src="https://res.cloudinary.com/loiztours/image/upload/v1687731972/checkout/paystack.svg"
                alt="paysatack btn"
              />
            </button>
          </v-col>
          <v-col cols="6">
            <button
              :disabled="basket.length === 0"
              class="provider__btn provider__btn--flw"
              @click="payWithRave"
            >
              <img
                src="https://res.cloudinary.com/loiztours/image/upload/v1690765889/checkout/rave.svg"
                alt="flutterwave btn"
              />
            </button>
          </v-col>
          <v-col cols="12">
            <div class="paypal-button-container">
              <div id="paypal-button-container"></div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-container>
    <SuccessModal v-if="success" :message="msg" @close="handleSuccessClose" />
    <FailureModal v-if="error" :message="errorMsg" @close="error = false" />
  </div>
</template>

<style scoped lang="scss">
.header {
  & a {
    color: $loiz-default;
    line-height: normal;
    font-size: 16px;
  }
}

.action {
  &__btn {
    padding: 7px 16px;
    border-radius: 10px;
    border: 1px solid $loiz-pink;
    font-size: 0.9rem;
    color: $loiz-pink;

    & .v-icon {
      font-size: 0.9rem;
    }
  }
}

.billing {
  width: 60%;
}

.summary {
  width: 50%;

  &__price {
    font-weight: bold;
    font-size: 18px !important;
  }

  & p {
    font-size: 14px;
    margin-bottom: 0;
  }
}

.provider {
  width: 50%;

  h3 {
    font-family: Mohave, sans-serif;
    color: $loiz-sky-blue;
    font-size: 1.5rem;
  }

  &__btn {
    width: 100%;
    height: 70px;
    cursor: pointer;
    border-radius: 8px;
    padding: 5px;
    display: flex;
    align-items: center;
    background-color: #fff;
    box-shadow: 0 0 2px #fff;

    &:disabled {
      opacity: 0.5;
    }

    & img {
      width: 65%;
      margin: 0 auto;
    }

    &--paystack {
      border: 1px solid $loiz-sky-blue;
    }

    &--flw {
      border: 1px solid #fb9b45;
    }
  }
}

.tile {
  border: 0.5px solid $loiz-default;
  border-radius: 8px;
}

.autofill {
  font-size: 24px;
}

.promo {
  color: rgb(78, 152, 78);
  font-weight: bold;
  font-size: 0.85rem !important;

  &--info {
    color: $loiz-sky-blue;
  }
}

.paypal-button-container {
  position: relative;
  z-index: 1;
}

// Media Querries
@media screen and (max-width: 1200px) {
}

@media screen and (max-width: 960px) {
  .header {
    a {
      font-size: 13px;
    }
  }

  .billing {
    width: 80%;
  }

  .summary {
    width: 80%;
  }
}

@media screen and (max-width: 600px) {
  .navigation {
    width: 80%;
  }

  .billing {
    width: 95%;
  }

  .summary {
    width: 95%;
  }

  .provider {
    width: 100%;
    padding: 16px;

    h3 {
      font-size: 1.3rem;
    }

    &__btn {
      min-width: 120px;
      width: 100%;
      height: 50px;
      padding: 10px;
      cursor: pointer;

      & img {
        width: 100%;
      }
    }
  }
}
</style>
