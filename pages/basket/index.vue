<script setup>
import { useDisplay } from "vuetify";
import { useStore } from "~/store";
import { useContentStore } from "~/store/content";
import { useConsultationStore } from "~/store/consultation";
import { useBasketStore } from "~/store/basket";


const { xs, sm, mdAndUp, lgAndUp } = useDisplay();
const route = useRoute();
const router = useRouter();

const store = useStore();
const contentStore = useContentStore();
const consultationStore = useConsultationStore();
const basketStore = useBasketStore();

const textLimit = ref(xs.value ? 12 : sm.value ? 25 : 40);
const showConsultationSchedule = ref(false);
const updatingService = ref(null);

const services = computed(() => contentStore.services);
const consultationPrice = computed(() => consultationStore.price);
const consultationPriceNGN = computed(() => consultationStore.priceNGN);
const availableDates = computed(() => consultationStore.availableDates);
const rate = computed(() => store.rate);

const basket = computed(() => {
  basketStore.basket.map((item) => {
    switch (item.type) {
      case 'consultation':
        return item;

      case 'trip':
        return item;

      default:
        item.parentService = contentStore.getSubservicesById(item.options.subservice_id);
    }

    return item;
  });
  return basketStore.basket;
});
const isNigerian = computed(() => store.location.countryCode === "NG");

const totalPrice = computed(() => basketStore.getSubTotal);
const totalPriceNgn = computed(() => basketStore.getNgnSubTotal);
const paths = computed(() => route.path.split("/"));

function consultationExpired(consltn) {
  const dates = availableDates.value;
  const date = consltn.options.booked_date;
  const time = consltn.options.booked_time;
  const inputDate = new Date(date).getTime();
  const inputDateTimeString = date + "T" + time; 
  const inputDateTime = new Date(inputDateTimeString);
  const currentDate = new Date();
  const next24Hours = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); 
  const datePast = inputDateTime < next24Hours;

  let obj = {
    times: [],
  };
  for (const date in dates) {
    const times = dates[date]; 
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

function formatTime(time24) {
  const timeParts = time24.split(":");
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  // Determine AM or PM
  const period = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  const hours12 = (hours % 12 === 0 ? 12 : hours % 12).toString().padStart(2, "0");
  const minutesPadded = minutes.toString().padStart(2, "0");

  // Construct the formatted time string
  const formattedTime = `${hours12}:${minutesPadded} ${period}`;
  return formattedTime;
}

function proceedToPayment() {
  if (basket.value && basket.value.length > 0) {
    router.push("/basket/payment");
  } else {
    store.setToast("You have no item in your basket!", { type: "info" });
  }
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

  <div id="payment" class="mb-10">

    <div class="header d-flex align-center py-4">
      <v-container class="d-flex align-center">

        <button v-if="mdAndUp" class="d-flex align-center action__btn" @click="router.go(-1)">
          <v-icon color="#e7028e" class="mr-2"> mdi-chevron-left</v-icon>
          Back
        </button>

        <v-spacer></v-spacer>

        <div class="navigation d-flex align-center">

          <nuxt-link to="/">Home</nuxt-link>

          <v-icon color="#555" class="mx-2 mt-1">mdi-chevron-right</v-icon>
          <div v-for="(item, index) in paths" :key="index">
            <nuxt-link v-if="item !== 'services'" :to="getPageRoute(item, index)"
              :style="index === paths.length - 1 ? 'color: #e7028e' : ''">
              {{
                item && item.length > textLimit
                  ? `${_StartCase(_ToLower(item.substring(0, textLimit)))}...`
                  : _StartCase(_ToLower(item))
              }}
            </nuxt-link>
            <v-icon v-if="item !== 'services' && showHeaderIcon(index)" color="#555"
              class="mx-2">mdi-chevron-right</v-icon>
          </div>

        </div>

        <v-spacer></v-spacer>
        <button v-if="mdAndUp" class="d-flex align-center action__btn"
          @click="basket.length > 0 ? router.go(+1) : null">
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
          <v-card v-for="(item, index) in basket" :key="index" flat class="pa-6 my-2">
            <div v-if="item.type !== 'consultation'" class="w-full">
              <div class="details__head d-flex align-center justify-space-between">
                <h4>{{ item.name }}</h4>
                <p v-if="isNigerian" class="ml-2 d-none d-md-block">
                  ₦{{ useAmtToString(item.price * item.qty) }}
                </p>
                <p v-else class="ml-2 d-none d-md-block">${{ item.price * item.qty }}</p>
              </div>

              <div class="details__body d-md-flex tw-flex align-center justify-space-between">
                <div class=" tw-flex tw-justify-between">
                  <div>
                    <p v-if="item && item.parentService">{{ item.parentService.title }}</p>
                    <div class=" tw-flex tw-flex-col">
                      <p v-if="item && item.type === 'third_party'">Third Party Service</p>
                      <div class="tw-flex tw-gap-4">
                        <p>{{ item.country || item.options.country }}</p>
                        <p>{{ item.qty }} Person(s)</p>
                      </div>

                    </div>
                    <div class=" tw-flex tw-gap-4 tw-mt-4">
                      <button class="clear-basket d-flex align-center tw-gap-1" @click="removeItem(item)">
                        <client-only><iconify-icon icon="mdi:cancel-circle-outline"
                            class="tw-text-xl tw-text-[#EB5757]"></iconify-icon></client-only>
                        Remove
                      </button>
                      <button :to="`${item.slug}`" class="clear-basket d-flex tw-align-center tw-gap-1">
                        <client-only><iconify-icon icon="iconoir:eye-solid"
                            class="tw-text-xl tw-text-[#EB5757]"></iconify-icon></client-only>
                        View
                      </button>
                    </div>
                  </div>

                  <div class="align-center justify-space-between">
                    <p v-if="isNigerian" class="details__price mr-2 d-md-none">₦{{ useAmtToString(item.price * item.qty)
                      }}</p>
                    <p v-else class="details__price mr-2 d-md-none"> ${{ item.price * item.qty }}</p>
                  </div>

                </div>

              </div>


            </div>
            <div v-else>
              <div class="details__head d-flex align-center justify-space-between">
                <h4>
                  Consultation session
                  <v-tooltip v-if="consultationExpired(item)" right max-width="400px" content-class="tooltip">
                    <template v-slot:activator="{ props }">
                      <v-icon color="red" dark v-bind="props">
                        mdi-alert-circle-outline
                      </v-icon>
                    </template>
                    <span>
                      The selected date or time for this consultation has expired. Please
                      select another date/time.
                    </span>
                  </v-tooltip>
                </h4>
                <v-btn small class="consultation-date elevation-0" @click="updateConsultationDate(item)">
                  <v-icon class="mr-lg-2">mdi-calendar-edit</v-icon>
                  <span v-if="lgAndUp"> Change Date/Time </span>
                </v-btn>
                <p v-if="isNigerian" class="d-none d-md-block ml-2">
                  ₦{{ useAmtToString(consultationPriceNGN) }}
                </p>
                <p v-else class="d-none d-md-block ml-2">${{ consultationPrice }}</p>
              </div>
              <div class="details__body d-md-flex flex-wrap justify-space-between">
                <div class=" tw-flex tw-flex-col tw-gap-4">
                  <p>{{ item.name }}</p>
                  <p>{{ formatDate(item.options.booked_date) }},<i>{{ formatTime(item.options.booked_time) }}</i></p>
                  <!-- <p>1 Person</p> -->

                  <div class="d-flex  justify-space-between">
                    <p v-if="isNigerian" class="details__price mr-2 d-md-none">₦{{ useAmtToString(consultationPriceNGN)
                      }}</p>
                    <p v-else class="details__price mr-2 d-md-none">${{ item.price * item.qty }}</p>
                    <button class="clear-basket d-flex align-center tw-gap-1" @click="removeItem(item)">
                      <client-only><iconify-icon icon="mdi:cancel-circle-outline"
                          class="tw-text-xl tw-text-[#EB5757]"></iconify-icon></client-only>
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
                  <b>₦{{ useAmtToString(totalPriceNgn) }}</b>
                </span>
                <span v-else> ${{ useAmtToString(totalPrice) }} </span>
              </p>
            </div>

          </div>
          <v-btn large class="submit mt-10 d-flex align-center justify-space-between"
            :disabled="expiredConsultationInBasket" @click="proceedToPayment">Proceed to Payment
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </div>
      <ConsultationSchedule v-if="showConsultationSchedule" @close="showConsultationSchedule = false"
        @submit="updateConsultationDetails" />
    </v-container>
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
  // border: 0.6px solid $loiz-default;
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
</style>