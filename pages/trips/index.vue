<script setup>
import slides from "~/utils/site-content/sliderData.json";
import { ref, onMounted, computed } from "vue";
import { formatDate } from "~/utils/lib";

// Fetch trips data
let trips = ref([]);
const menuOpen = ref(false);
const search = ref("");
const showFutureTrips = ref(null); // null means no date filter

const tripsSlides = computed(() => slides.filter((item) => item.image));

// Fetch the data when the component is mounted
onMounted(async () => {
  try {
    const res = await useAxiosFetch("/trips");
    trips.value.push(...res.data.data.trips);
  } catch (error) {
    console.error(error);
  }
});

// Date filter functions
const showCurrentTrips = () => {
  showFutureTrips.value = true;
};
const showPastTrips = () => {
  showFutureTrips.value = false;
};
const clearDateFilter = () => {
  showFutureTrips.value = null;
};

// Computed property to filter and sort trips
const currentShowingCards = computed(() => {
  const today = new Date().toISOString().split('T')[0];

  // Filter trips first
  const filteredTrips = trips.value.filter((item) => {
    if (!item.enabled) return false;

    // Search filter
    if (search.value) {
      const searchQuery = search.value.toUpperCase();
      const titleMatch = item.title?.toUpperCase().includes(searchQuery);
      const textMatch = item.text?.toUpperCase().includes(searchQuery);
      if (!titleMatch && !textMatch) return false;
    }

    // Date filter
    if (showFutureTrips.value === true) {
      return item.start_date >= today;
    } else if (showFutureTrips.value === false) {
      return item.end_date < today;
    }

    return true;
  });

  // Sort trips by start_date in ascending order
  return filteredTrips.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
});

const banner = (images) => images.find((image) => image.type === "banner");
</script>

<template>
  <main>
    <div>
      <Slider :sliderTrips="tripsSlides" />
    </div>

    <TripsSubHeader
      :trips="trips"
      :currentShowingCards="currentShowingCards"
    />

    <section class="max-w-[90%] tw-items-center tw-bg-[F9DAED] tw-flex tw-flex-col tw-justify-center">
      <div class="tw-flex tw-flex-col pt-10">
        <h3 class="tw-text-4xl tw-flex">Our Latest Trips</h3>
        <div class="horizontal-line"></div>
      </div>

      <div class="tw-bg-white tw-p-8 tw-rounded-md tw-w-[90%]">
        <div class="tw-flex tw-items-center tw-justify-between tw-w-full">
          <div class="filter tw-flex tw-gap-6">
            <button
              @click="clearDateFilter"
              class="toggle-button"
              :class="{ active: showFutureTrips === null }"
            >
              All
            </button>
            <button
              @click="showCurrentTrips"
              class="toggle-button"
              :class="{ active: showFutureTrips === true }"
            >
              Latest
            </button>
            <button
              @click="showPastTrips"
              class="toggle-button"
              :class="{ active: showFutureTrips === false }"
            >
              Previous
            </button>
          </div>

          <div class="lg:tw-w-1/4">
            <v-text-field
              v-model="search"
              variant="outlined"
              flat
              clearable
              placeholder="Search for a campaign"
              prepend-inner-icon="mdi-magnify"
              density="comfortable"
            />
          </div>
        </div>

        <div class="card-container tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
          <div
            v-for="(card, index) in currentShowingCards"
            :key="index"
            class="card"
          >
            <div class="image-hover-effect">
              <img
                :src="banner(card.images).url"
                :alt="card.title"
                class="card-image tw-h-[200px] md:tw-h-[300px] tw-w-[100%]"
              />
            </div>
            <div class="tw-flex tw-justify-between tw-items-center">
              <h4 class="card-title tw-text-left tw-font-semibold tw-max-w-[70%]">
                {{ card.title }}
              </h4>
              <div class="tw-gap-2 tw-flex tw-items-center" v-if="card.start_date && card.end_date">
                <client-only>
                  <iconify-icon
                    icon="oui:token-date"
                    class="tw-text-lg tw-text-black"
                  />
                </client-only>
                <span class="tw-text-sm tw-whitespace-nowrap">
                  {{ formatDate(card.start_date) }} - {{ formatDate(card.end_date) }}
                </span>
              </div>
            </div>
            <p class="card-text tw-font-normal tw-text-left">
              {{ card.caption }}
            </p>
            <div class="tw-flex tw-flex-row tw-justify-between tw-text-left">
              <div class="tw-flex tw-items-center tw-gap-3">
                <client-only>
                  <iconify-icon
                    v-show="card.type === 'domestic'"
                    icon="bxs:train"
                    class="tw-border-2 tw-p-2 tw-bg-gradient-to-r from-pink-800 via-red-700 to-yellow-700 tw-rounded-full tw-text-2xl tw-text-black"
                  />
                  <iconify-icon
                    v-show="card.type === 'foreign'"
                    icon="bxs:plane-alt"
                    class="tw-border-2 tw-p-2 tw-bg-gradient-to-r from-pink-800 via-red-700 to-yellow-700 tw-rounded-full tw-text-2xl tw-text-black"
                  />
                </client-only>
                <div class="tw-flex tw-gap-2 tw-py-2 tw-px-4 tw-bg-[#fef3f9] tw-rounded-2xl">
                  <span
                    v-for="destination in card.destinations"
                    :key="destination.city"
                    class="tw-m-0 tw-text-[#eb0c8f]"
                  >
                    {{ destination.state }}
                  </span>
                </div>
              </div>
              <v-btn :to="`/trips/${card.slug}`" class="submit" elevation="0">
                See details
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.horizontal-line {
  width: 100%;
  height: 2px;
  background-color: #cccccc;
  margin: 20px 0;
}

.card-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  border: 1px solid #cccccc;
}

.card-image {
  object-fit: cover;
  border-radius: 8px 8px 8px 8px;
}

.card-title {
  font-size: 18px;
  margin: 15px 0;
}

.card-text {
  font-size: 16px;
  color: #1a1a1a;
}

.image-hover-effect {
  overflow: hidden;
}

.image-hover-effect img {
  display: block;
  width: 100%;
  transition: transform 0.3s ease;
}

.image-hover-effect img:hover {
  transform: scale(1.1);
}

.toggle-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-button.active {
  background-color: #eb0c8f;
  color: white;
}

.toggle-button:hover {
  background-color: #f585c7;
  color: white;
  transition: 0.3s ease;
}

@media (max-width: 768px) {
  .card > div:first-child,
  .tw-flex.tw-justify-between.tw-items-center {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .card-title {
    max-width: 100% !important;
    margin-bottom: 0;
  }

  .tw-gap-2.tw-flex.tw-items-center {
    width: 100%;
    justify-content: flex-start;
    margin: 4px 0 12px 0;
  }
}
</style>