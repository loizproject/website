<script setup>
import {useStore} from "~/store";
import {useRoute} from "vue-router";

const route = useRoute();
const store = useStore();
const isNigerian = computed(() => store.location.countryCode === "NG");


//Fetching the api
const {data: apires} = await useAxiosFetch(`/trips/${route.params.slug}`);
const trip = apires.data.trip;

console.log(trip, "trip from the backend request");

const intro = trip.images.find((image) => image.type === "intro");
const images = trip.images.filter((image) => image.type === "caption");
const outro = trip.images.find((image) => image.type === "outro");

// Modal visibility state
const isModalOpen = ref(false);

// Methods to control modal visibility
const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

function formatCurrency(currency, amount, locale = "en-NG") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
}

const itinerary = computed(() => {
  // if the description is an array then loop over it
  if (Array.isArray(trip.itinerary)) {
    trip.itinerary.forEach((item) => {
      return item.description;
    });
  }
});
</script>

<template>
  <main class="tw-pt-10">
    <div class="tw-bg-white tw-p-8 tw-rounded-md tw-w-[90%] tw-mx-auto">
      <div class="tw-flex tw-flex-col">
        <div class="tw-flex tw-flex-col tw-mt-8">
          <h3 class="tw-text-4xl">{{ trip.title }}</h3>
          <p class="tw-my-4">{{ trip.description }}</p>
          <v-btn
              class="submit tw-flex tw-w-[100px] tw-mt-2 tw-justify-center tw-mx-auto open-modal-btn"
              @click="openModal"
          >
            Book Trip
          </v-btn>
        </div>

        <div class="horizontal-line tw-mt-8"></div>

        <div class="tw-flex tw-gap-3 tw-items-center tw-mt-8">
          <h4 class="tw-text-2xl">More Details</h4>
        </div>

        <div class="tw-mt-8 tw-flex tw-justify-center">
          <img
              :src="intro.url"
              alt="Trip introduction image"
              class="tw-rounded-md tw-w-full tw-max-w-3xl tw-h-auto tw-mx-auto"
          />
        </div>

        <div class="tw-flex tw-items-center tw-justify-center tw-mt-4">
          <h6 class="tw-text-3xl tw-font-normal" v-if="isNigerian">
            {{ formatCurrency("NGN", trip.ngn_price) }}
          </h6>
          <h6 class="tw-text-3xl tw-font-normal" v-else>
            {{ formatCurrency("USD", trip.usd_price, "en-US") }}
          </h6>
        </div>

        <div
            class="tw-grid tw-grid-cols-1 tw-w-full md:tw-grid-cols-3 tw-mx-auto tw-gap-3 tw-mt-8"
        >
          <div
              v-for="(image, index) in images"
              :key="index"
              class="tw-border-2 tw-border-[F585C7] tw-rounded-lg"
          >
            <div class="tw-p-2">
              <img
                  :src="image.url"
                  class="tw-w-full tw-h-60 tw-object-cover tw-rounded-md"
                  alt="image.caption"
              />
            </div>
            <p class="tw-text-center tw-text-lg">{{ image.caption }}</p>
          </div>
        </div>

        <div class="tw-flex tw-flex-col tw-mt-8">
          <p class="tw-font-semibold">Itenary</p>
          <ul class="styled-list tw-ml-4">
            <li
                v-for="(bullet, index) in trip.itinerary"
                :key="index"
                class="tw-flex tw-items-start tw-gap-2"
            >
              <client-only>
                <iconify-icon
                    icon="teenyicons:tick-circle-outline"
                    class="tw-text-xl tw-mt-1"
                ></iconify-icon>
              </client-only>
              <p>{{ bullet.description }}</p>
            </li>
          </ul>
        </div>

        <div class="tw-mt-8 tw-flex tw-flex-col tw-max-w-[70%] tw-mx-auto" v-if="trip.included">
          <div class="horizontal-line"></div>
          <p class="tw-font-semibold tw-m-0 tw-text-center">Included in the package are {{
              trip.included.join(", ")
            }}</p>
          <div class="horizontal-line"></div>
        </div>

        <div class="tw-mx-auto tw-mt-4">
          <v-btn
              class="submit tw-p-5 tw-flex tw-w-[100px] tw-mt-2 tw-justify-center tw-mx-auto open-modal-btn"
              @click="openModal"
          >
            Book Trip
          </v-btn>
          <p>{{ trip.icon }}</p>
        </div>

        <div class="tw-mt-8">
          <img :src="outro.url" alt="campaign image" class="tw-rounded-md tw-w-full tw-max-w-3xl tw-h-auto tw-mx-auto"/>
        </div>

        <div class="tw-flex tw-flex-col tw-mt-8" v-if="trip.tips.length > 0">
          <p class="tw-font-semibold">Tips for the Tour</p>
          <ul class="styled-list tw-ml-4">
            <li
                v-for="(bullet, index) in trip.tips"
                :key="index"
                class="tw-flex tw-items-start tw-gap-2"
            >
              <client-only>
                <iconify-icon
                    icon="teenyicons:tick-circle-outline"
                    class="tw-text-xl tw-mt-1"
                ></iconify-icon>
              </client-only>
              <div>
                <p v-if="Array.isArray(bullet.description)">
                  <span v-for="(desc, i) in bullet.description" :key="i">
                    {{ desc.description }}<br/>
                  </span>
                </p>
                <p v-else>
                  {{ bullet.description }}
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div
            class="tw-mt-8 tw-flex tw-flex-col tw-text-center tw-max-w-[95%] tw-mx-auto tw-bg-[#F9DAED] tw-rounded-md"
            v-if="trip.not_included">
          <p class="tw-font-semibold">The Package does not include</p>
          <p class="tw-mb-0 tw-p-3">{{ trip.not_included.join(", ") }}</p>
        </div>

        <div class="tw-flex tw-flex-col tw-pt-8" v-if="trip.booking_requirements.length > 0">
          <p class="tw-font-semibold">Booking Requirements</p>
          <ul class="styled-list tw-ml-4">
            <li
                v-for="(bullet, index) in trip.booking_requirements"
                :key="index"
                class="tw-flex tw-items-start tw-gap-2"
            >
              <client-only>
                <iconify-icon
                    icon="teenyicons:tick-circle-outline"
                    class="tw-text-xl tw-mt-1"
                ></iconify-icon>
              </client-only>
              <p>{{ bullet }}</p>
            </li>
          </ul>
        </div>

        <div class="tw-flex tw-flex-col tw-pt-8">
          <p class="tw-font-semibold">Payment Plan/Discount Offers</p>
          <ul class="styled-list tw-ml-4">
            <li
                v-for="(bullet, index) in trip.payment_plans"
                :key="index"
                class="tw-flex tw-items-start tw-gap-2"
            >
              <client-only>
                <iconify-icon
                    icon="teenyicons:tick-circle-outline"
                    class="tw-text-xl tw-mt-1"
                ></iconify-icon>
              </client-only>
              <p>{{ bullet }}</p>
            </li>
          </ul>
        </div>

        <v-btn
            class="submit tw-flex tw-p-5 tw-w-[100px] tw-mt-2 tw-justify-center tw-mx-auto open-modal-btn tw-items-center"
            @click="openModal"
        >
          Book Trip
        </v-btn>

        <TripsForm
            :trip="trip"
            :isModalOpen="isModalOpen"
            @close-modal="closeModal"
        />
      </div>
    </div>

    <TripsForm
        :trip="trip"
        :isModalOpen="isModalOpen"
        @close-modal="closeModal"
    />
  </main>
  <!-- </div>
    </div>
  </main> -->
</template>

<style scoped>
.horizontal-line {
  width: 100%;
  height: 2px;
  background-color: #cccccc;
  margin: 10px 0;
}

.styled-list li {
  font-size: 18px; /* Custom font size for the list items */
  color: #1a1a1a; /* Customize color */
}

.styled-list {
  list-style-type: none; /* Remove default bullet */
  padding-left: 0;
}

.image-hover-effect {
  display: inline-block;
  overflow: hidden; /* Ensures that scaling doesn't overflow the container */
}

.image-hover-effect img {
  display: block; /* Ensures no extra space at the bottom */
  width: 100%; /* Ensure image takes up the width of its container */
  transition: transform 0.3s ease; /* Smooth hover transition */
}

.image-hover-effect img:hover {
  transform: scale(1.1); /* Scales the image slightly on hover */
  border-radius: 10px;
}

/* Button styles */
.open-modal-btn {
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.open-modal-btn:hover {
  background-color: #0056b3;
}

.open-modal-btn:active {
  transform: scale(0.98);
  background-color: #004085;
}

.open-modal-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
}
</style>
