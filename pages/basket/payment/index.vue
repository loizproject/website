<script setup>
import { useDisplay } from "vuetify";
import { useStore } from "~/store";
import { useContentStore } from "~/store/content";
import { useConsultationStore } from "~/store/consultation";
import { useBasketStore } from "~/store/basket";

let installment = ref(false);
const toggleDropdown = (state) => {
  installment.value = state;
};

const activeInstallment = ref(null);

const { xs, sm, mdAndUp, lgAndUp } = useDisplay();
const route = useRoute();
const router = useRouter();

const store = useStore();
const contentStore = useContentStore();
const consultationStore = useConsultationStore();
const basketStore = useBasketStore();

const textLimit = ref(xs.value ? 12 : sm.value ? 25 : 40);
const showConsultationSchedule = ref(false);
const updatingService = ref( null );
const showDetails = ref( false );

const services = computed(() => contentStore.services);
const consultationPrice = computed(() => consultationStore.price_usd);
const consultationPriceNGN = computed(() => consultationStore.price_ngn);
const availableDates = computed(() => consultationStore.availableDates);
const rate = computed(() => store.rate);

const basket = computed(() => basketStore.basket);

const basketRef = ref({});

// Add Travel Health Insurrance of NGN50k

watch(basket, async (newBasket, oldBasket) => {
  if (newBasket) {
    const res = basketStore.basket.map((item) => {
      switch (item.type) {
        case "consultation":
          return {
            price: isNigerian.value
              ? consultationPriceNGN.value
              : consultationPrice.value,
            ...item,
          };

        case "trip":
          return item;

        default:
          item.parentService = contentStore.getSubservicesById(
            item.options.subservice_id
          );
      }
      // items.value.push()
      // return item;
    });
    basketRef.value = res;
  }
});

function formatCurrency(currency, amount, locale = "en-NG") {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    amount
  );
}

function checkTripconsultationExpiry(trip) {
  const { selected_consultation_date: date, selected_consultation_time: time } =
    trip.options.trip_details.consultation_details;

  const inputDateTime = new Date(date);
  const [hours, minutes] = time.split(":");
  inputDateTime.setHours(hours);
  inputDateTime.setMinutes(minutes);
  const currentDate = new Date();
  const next24Hours = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  const datePast = inputDateTime < next24Hours;
  return datePast;
}

const isNigerian = computed(() => store.location.countryCode === "NG");
const totalPrice = computed(() => basketStore.getSubTotal);
const paths = computed(() => route.path.split("/"));

function consultationExpired(consltn) {
  const dates = availableDates.value;
  const date = consltn.options.booked_date;
  const time = consltn.options.booked_time;
  const inputDate = new Date(date).getTime();
  const inputDateTimeString = date + "T" + time; // Combine date and time strings
  const inputDateTime = new Date(inputDateTimeString);
  const currentDate = new Date();
  const next24Hours = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours to the current date
  const datePast = inputDateTime < next24Hours;

  let obj = {
    times: [],
  };
  for (const date in dates) {
    const times = dates[date]; // "2023-08-31": ["7:00", "12:30", "20:00", "21:00"], these are available times
    if (consltn.options.booked_date === date) {
      obj = { date, times };
    }
  }
  // return true;
  return !obj.times.includes(time) || datePast;
}

const expiredConsultationInBasket = computed(() => {
  let resp = [];
  basket.value.forEach((item) => {
    if (item.type === "consultation" && consultationExpired(item)) {
      resp.push(true);
    } else {
      resp.push(false);
    }
  });
  return resp.includes(true);
});

async function removeItem(item) {
  await basketStore.removeFromBasket(item);
}

async function clearBasket() {
  await basketStore.clearBasket();
}

function showHeaderIcon(index) {
  return index !== 0 && index !== paths.value.length - 1;
}

function getPageRoute(item, index) {
  const pageArray = paths.value.slice(0, index + 1);
  return pageArray.join("/");
}

async function updateConsultationDate(service) {
  try {
    updatingService.value = service;
    showConsultationSchedule.value = true;
  } catch (error) {
    useErrorHandler(error);
  }
}

async function updateConsultationDetails(args) {
  const { date, time } = args;
  showConsultationSchedule.value = false;
  const data = {
    requestDetails: {
      booked_date: date,
      booked_time: time,
    },
  };
  try {
    await useAxiosPut(`/basket/${updatingService.value.id}`, data);
    await basketStore.fetchBasket();
    store.setToast("Consultation Date and Time Updated Succesfully!", {
      type: "success",
    });
  } catch (error) {
    useErrorHandler(error);
  }
}

function formatDate(date) {
  if (!date) return null;
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
}

function futureDate( days ){
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + days);
  return futureDate.toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
}

function formatTime(time24) {
  const timeParts = time24.split(":");
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  // Determine AM or PM
  const period = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  const hours12 = (hours % 12 === 0 ? 12 : hours % 12)
    .toString()
    .padStart(2, "0");
  const minutesPadded = minutes.toString().padStart(2, "0");

  // Construct the formatted time string
  const formattedTime = `${hours12}:${minutesPadded} ${period}`;
  return formattedTime;
}

function proceedCheckout() {
  if (basket.value && basket.value.length > 0) {
    router.push("/basket/payment/checkout");
  } else {
    store.setToast("You have no item in your basket!", { type: "info" });
  }
}

function updateBasketPrice ()
{
  
}

onMounted(async () => {
  await basketStore.fetchBasket();
  await consultationStore.fetchAvailableDates();
});

definePageMeta({
  middleware: ["auth"],
});

const meta = {
  title:
    "Loiz Tours & Travels Ltd - Your Gateway to Exhilarating & Seamless Travel Experiences!",
  description:
    "Whether you're planning your next adventure or seeking assistance with visa services, flights, or tours, trust Loiz Tours & Travels to make your travel experience unforgettable. Join us on our journey as we redefine the standards of excellence in the travel industry. Discover the world with Loiz Tours & Travels – Where Every Journey Begins with Excellence!",
  image:
    "https://res.cloudinary.com/loiztours/image/upload/site-media/img/atikh-bana.png",
  keywords:
    "travel, tours, vacations, domestic tours in nigeria, visa, visa services, 3rd party travel companies, travel companies in nigeria",
};
useSeoMeta({
  title: meta.title,
  ogTitle: meta.title,
  twitterTitle: meta.title,
  description: meta.description,
  ogDescription: meta.description,
  twitterDescription: meta.description,
  ogImage: meta.image,
  twitterImage: meta.image,
  twitterCard: "summary_large_image",
  twitterSite: "@Loiztravels",
  keywords: meta.keywords,
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
            >
              {{
                item && item.length > textLimit
                  ? `${_StartCase(_ToLower(item.substring(0, textLimit)))}...`
                  : _StartCase(_ToLower(item))
              }}
            </nuxt-link>
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
          @click="basket.length > 0 ? router.go(+1) : null"
        >
          Next
          <v-icon color="#e7028e" class="ml-2"> mdi-chevron-right</v-icon>
        </button>
      </v-container>
    </div>

    <v-container class="d-md-flex align-start justify-center">
      <div id="billing-details" class="billing tile pa-5 mx-auto">
        <div class="d-flex align-center justify-space-between">
          <h3>Basket ({{ basket.length }})</h3>
          <button class="clear-basket d-flex align-center" @click="clearBasket">
            Clear Basket
            <v-icon class="ml-1">mdi-delete</v-icon>
          </button>
        </div>

        <div class="details mt-8">
          <v-card
            v-for="(item, index) in basketRef"
            :key="index"
            flat
            class="pa-6 my-2"
          >
            <div v-if="item.type === 'trip'" class="w-full">
              <div
                class="details__head d-flex align-center justify-space-between"
              >
                <h4>{{ item.title }}</h4>
                <p v-if="isNigerian" class="ml-2 d-none d-md-block">
                  {{ formatCurrency("NGN", item.price * item.qty) }}
                </p>
                <p v-else class="ml-2 d-none d-md-block">
                  {{ formatCurrency("USD", item.price * item.qty, "en-US") }}
                </p>
              </div>

              <div
                class="details__body d-md-flex tw-flex align-center justify-space-between tw-border tw-p-6 tw-shadow-md tw-border-[#e7028e] tw-rounded-md"
              >
                <div class="tw-flex tw-justify-between">
                  <div>
                    <div class="tw-flex tw-flex-col">
                      <div
                        class="tw-flex tw-flex-col tw-gap-2"
                        v-if="item.options.trip_details.trip_type === 'foreign'"
                      >
                        <div class="tw-flex tw-gap-x-10">
                          <h4>
                            Consultation Details
                            <v-tooltip
                              v-if="checkTripconsultationExpiry(item)"
                              right
                              max-width="400px"
                              content-class="tooltip"
                            >
                              <template v-slot:activator="{ props }">
                                <v-icon color="red" dark v-bind="props">
                                  mdi-alert-circle-outline
                                </v-icon>
                              </template>
                              <span>
                                The selected date or time for this consultation
                                has expired. Please select another date/time.
                              </span>
                            </v-tooltip>
                          </h4>
                          <v-btn
                            small
                            class="consultation-date elevation-0"
                            @click="updateConsultationDate(item)"
                          >
                            <v-icon class="mr-lg-2">mdi-calendar-edit</v-icon>
                            <span v-if="lgAndUp"> Change Date/Time </span>
                          </v-btn>
                        </div>
                        <p>
                          <span class="tw-font-bold"
                            >Selected Consultation Date:</span
                          >
                          {{
                            formatDate(
                              item.options.trip_details.consultation_details
                                .selected_consultation_date
                            )
                          }}
                        </p>
                        <p>
                          <span class="tw-font-bold"
                            >Selected Consultation Time:</span
                          >
                          {{
                            formatTime(
                              item.options.trip_details.consultation_details
                                .selected_consultation_time
                            )
                          }}
                        </p>
                      </div>
                      <div
                        v-if="item.options.payment_type === 'installments' && showDetails"
                        class="tw-border tw-w-[30rem] tw-border-[#EB5757] tw-rounded-md tw-py-3 tw-px-1 my-2"
                        :data-aos="fade-up"
                      >
                        <div class="tw-px-2">
                          <h3>Payment Summary</h3>
                          <p class="tw-flex tw-justify-between my-2">
                            <span>Balance Due Today:</span>
                            <span v-if="isNigerian">
                              {{
                                formatCurrency(
                                  "NGN",
                                  item.options.payment_details.ngn.first
                                )
                              }}
                            </span>
                            <span v-else>
                              {{
                                formatCurrency(
                                  "USD",
                                  item.options.payment_details.usd.first,
                                  "en-US"
                                )
                              }}
                            </span>
                          </p>
                          <p class="tw-flex tw-justify-between my-2">
                            <span>Second Installment:</span>
                            <span v-if="isNigerian">
                              {{
                                formatCurrency(
                                  "NGN",
                                  item.options.payment_details.ngn.second
                                )
                              }}
                            </span>
                            <span v-else>
                              {{
                                formatCurrency(
                                  "USD",
                                  item.options.payment_details.usd.second,
                                  "en-US"
                                )
                              }}
                            </span>
                          </p>
                          <p class="tw-italic tw-font-semibold">
                            Please note that the second installment will be due on {{futureDate(90)}} if you make a payment today
                          </p>
                        </div>
                      </div>
                      <div class="tw-flex tw-gap-4">
                        <p>{{ item.qty }} Person(s)</p>
                      </div>
                    </div>
                    <div class="tw-flex tw-gap-4 tw-mt-4">
                      <button
                        class="clear-basket d-flex align-center tw-gap-1"
                        @click="removeItem(item)"
                      >
                        <client-only
                          ><iconify-icon
                            icon="mdi:cancel-circle-outline"
                            class="tw-text-xl tw-text-[#EB5757]"
                          ></iconify-icon
                        ></client-only>
                        Remove
                      </button>
                      <button
                        @click="showDetails = !showDetails"
                        class="clear-basket d-flex tw-align-center tw-gap-1"
                      >
                        <client-only
                          ><iconify-icon
                            icon="iconoir:eye-solid"
                            class="tw-text-xl tw-text-[#EB5757]"
                          ></iconify-icon
                        ></client-only>
                        {{
                          showDetails ? "Hide Details" : "Show Details"
                        }}
                      </button>
                    </div>
                  </div>

                  <div class="align-center justify-space-between">
                    <p v-if="isNigerian" class="details__price mr-2 d-md-none">
                      {{ formatCurrency("NGN", item.price * item.qty) }}
                    </p>
                    <p v-else class="details__price mr-2 d-md-none">
                      {{
                        formatCurrency("USD", item.price * item.qty, "en-US")
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div
                class="details__head d-flex align-center justify-space-between"
              >
                <h4>
                  Consultation session
                  <v-tooltip
                    v-if="consultationExpired(item)"
                    right
                    max-width="400px"
                    content-class="tooltip"
                  >
                    <template v-slot:activator="{ props }">
                      <v-icon color="red" dark v-bind="props">
                        mdi-alert-circle-outline
                      </v-icon>
                    </template>
                    <span>
                      The selected date or time for this consultation has
                      expired. Please select another date/time.
                    </span>
                  </v-tooltip>
                </h4>
                <v-btn
                  small
                  class="consultation-date elevation-0"
                  @click="updateConsultationDate(item)"
                >
                  <v-icon class="mr-lg-2">mdi-calendar-edit</v-icon>
                  <span v-if="lgAndUp"> Change Date/Time </span>
                </v-btn>
                <p v-if="isNigerian" class="d-none d-md-block ml-2">
                  {{ formatCurrency("NGN", consultationPriceNGN) }}
                </p>
                <p v-else class="d-none d-md-block ml-2">
                  {{ formatCurrency("USD", consultationPrice, "en-US") }}
                </p>
              </div>
              <div
                class="details__body d-md-flex flex-wrap justify-space-between"
              >
                <div class="tw-flex tw-flex-col tw-gap-4">
                  <p>{{ item.name }}</p>
                  <p>
                    {{ formatDate(item.options.booked_date) }},<i>{{
                      formatTime(item.options.booked_time)
                    }}</i>
                  </p>
                  <!-- <p>1 Person</p> -->

                  <div class="d-flex justify-space-between">
                    <p v-if="isNigerian" class="details__price mr-2 d-md-none">
                      {{ formatCurrency("NGN", consultationPriceNGN) }}
                    </p>
                    <p v-else class="details__price mr-2 d-md-none">
                      {{
                        formatCurrency("USD", item.price * item.qty, "en-US")
                      }}
                    </p>
                    <button
                      class="clear-basket d-flex align-center tw-gap-1"
                      @click="removeItem(item)"
                    >
                      <client-only
                        ><iconify-icon
                          icon="mdi:cancel-circle-outline"
                          class="tw-text-xl tw-text-[#EB5757]"
                        ></iconify-icon
                      ></client-only>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </div>
      </div>
      <div id="summary" class="summary mt-10 mt-md-0 ml-md-10 mx-auto">
        <div class="tile pa-5">
          <h4>Order Summary</h4>
          <div class="tile pa-4 mt-8">
            <div class="d-flex align-center justify-space-between">
              <p>Subtotal</p>
              <p class="summary__price">
                <span v-if="isNigerian">
                  <b>{{ formatCurrency("NGN",totalPrice) }}</b>
                </span>
                <span v-else> {{ formatCurrency("USD", totalPrice, "en-US") }} </span>
              </p>
            </div>
            <div class="d-flex align-center justify-space-between tw-my-2">
              <p>VAT (7.5%)</p>
              <p class="summary__price">
                <span v-if="isNigerian">
                  <b>{{ formatCurrency("NGN",totalPrice * 0.075) }}</b>
                </span>
                <span v-else> {{ formatCurrency("USD", totalPrice * 0.075, "en-US") }} </span>
              </p>
            </div>
            <!-- <div v-if="isNigerian" class="mt-4">
              <div class="d-flex align-center justify-space-between">
                <p class="promo mt-2">🇳🇬 10% off on services! ✅</p>
                <p class="summary__price">
                  <span> ₦{{ useAmtToString(getNgnSubTotal) }} </span>
                </p>
              </div>
              <p class="promo promo--info mt-2">
                Note: This 10% discount is not applicable to consultation bookings.
              </p>
            </div> -->
          </div>
          <v-btn
            large
            class="submit mt-10 d-flex align-center justify-space-between"
            :disabled="expiredConsultationInBasket"
            @click="proceedCheckout"
            >Proceed to checkout <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </div>
      <ConsultationSchedule
        v-if="showConsultationSchedule"
        @close="showConsultationSchedule = false"
        @submit="updateConsultationDetails"
      />
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.menu {
  position: absolute;
  top: 0;
  right: 20px;
  width: 100%;
}

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

  & h3 {
    font-size: 1.5rem;
  }
}

.details {
  &__head {
    & h4 {
      font-size: 1.2rem;
    }

    & p {
      font-size: 1.2rem;
      margin-bottom: 0;
    }
  }

  & .v-card {
    border: 0.8px solid #b5b1b1;
  }

  &__body {
    margin-top: 20px;

    & p {
      font-size: 14px;
      margin-bottom: 0;
    }

    .clear-basket {
      border: 0.6px solid #e73e3e;
      box-shadow: none;
      color: #e73e3e;
      padding: 5px 10px;
      border-radius: 6px;

      & .v-icon {
        color: #e73e3e;
      }
    }
  }
}

.clear-basket {
  box-shadow: 0 0 4px 1px #b5b1b1;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 14px;

  & .v-icon {
    font-size: 14px;
  }
}

.tooltip {
  background-color: #000000fe !important;
  padding: 20px;
}

.promo {
  color: rgb(78, 152, 78);
  font-weight: bold;
  font-size: 0.85rem !important;

  &--info {
    color: $loiz-sky-blue;
  }
}

.summary {
  width: 40%;

  &__price {
    font-weight: bold;
    font-size: 25px !important;
  }

  & p {
    font-size: 18px;
    margin-bottom: 0;
  }

  & .v-btn {
    width: 100%;
    background-color: $loiz-pink !important;
    background-image: none;
    border-radius: 12px;
  }
}

.provider {
  h3 {
    font-family: Mohave, sans-serif;
    color: $loiz-sky-blue;
    font-size: 1.5rem;
  }

  &__btn {
    width: 180px;
    cursor: pointer;

    & img {
      width: 100%;
    }
  }
}

.consultation-date {
  background-color: $loiz-pink !important;
}

.tile {
  border: 0.5px solid $loiz-default;
  border-radius: 8px;
}

// Media Querries
@media screen and (max-width: 1026px) {
  .details {
    &__head {
      h4 {
        font-size: 1rem;
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .header {
    a {
      font-size: 13px;
    }
  }

  .billing {
    width: 75%;
  }

  .summary {
    width: 75%;
  }
}

@media screen and (max-width: 600px) {
  .navigation {
    width: 80%;
  }

  .billing {
    width: 100%;

    h3 {
      font-size: 1.25rem;
    }
  }

  .summary {
    width: 100%;
  }

  .details {
    & h4 {
      font-size: 1rem;
    }

    &__head {
      p {
        font-size: 1.2rem;
      }
    }

    &__body {
      p {
        margin-bottom: 10px;
      }
    }

    &__price {
      font-weight: 700;
      font-size: 1.12rem !important;
      margin-bottom: 0 !important;
    }

    .clear-basket {
      .v-icon {
        font-size: 0.9rem;
      }
    }
  }

  .clear-basket {
    font-size: 0.8rem;
  }
}
.horizontal-line {
  width: 100%;
  height: 1px;
  background-color: #aaaaaa;
}
</style>
