<script setup>
import slides from "~/utils/site-content/sliderData.json";
//Script for the cnpards
import {ref, onMounted, computed} from "vue";
import {formatDate} from "~/utils/lib";
import { useRouter } from "vue-router";

const router = useRouter();
let trips = ref([]);
const menuOpen = ref(false);

const tripsSlides = computed(() => slides.filter((item) => item.image));

// Fetch the data when the component is mounted
onMounted(async () => {
  try {
    // Fetch the data
    const res = await useAxiosFetch("/trips");
    trips.value.push(...res.data.data.trips);
  } catch (error) {
    console.error(error);
  }
});

// Search query
const search = ref("");
// Toggle for future or past trips (true = future, false = past)
const showFutureTrips = ref(null); // null means no date filter

// Functions for date filter
const showCurrentTrips = () => {
  showFutureTrips.value = true;
};
const showPastTrips = () => {
  showFutureTrips.value = false;
};
const clearDateFilter = () => {
  showFutureTrips.value = null;
};

// Computed property to filter trips based on search and date
const currentShowingCards = computed(() => {
  const today = new Date().toISOString().split('T')[0];

  return trips.value.filter((item) => {
    // Skip if not enabled
    if (!item.enabled) return false;

    // Apply search filter
    if (search.value) {
      const searchQuery = search.value.toUpperCase();
      const titleMatch = item.title?.toUpperCase().includes(searchQuery);
      const textMatch = item.text?.toUpperCase().includes(searchQuery);

      if (!titleMatch && !textMatch) return false;
    }

    // Apply date filter
    if (showFutureTrips.value === true) {
      // Show future trips (start date is after today)
      return item.start_date >= today;
    } else if (showFutureTrips.value === false) {
      // Show past trips (end date is before today)
      return item.end_date < today;
    }

    // If no date filter, show all
    return true;
  });
});

const banner = (images) => images.find((image) => image.type === "banner");

const navigateToTrip = (slug) => {
  if (slug) {
    router.push(`/trips/${slug}`);
    menuOpen.value = false;
  }
};
</script>

<template>
  <main>
    <div>
      <Slider :sliderTrips="tripsSlides"/>
    </div>

    <!-- Custom Sub-Header for Trips Page -->
    <section
      toggleable="lg"
      type="dark"
      class="sub-header d-flex align-center"
    >
      <v-container>
        <nav class="d-flex justify-start justify-md-space-between mx-auto">
          <v-menu
            v-model="menuOpen"
            offset-y
            content-class="services-menu"
            min-width="300"
          >
            <template v-slot:activator="{ props }">
              <button
                class="sub-header__title d-flex align-center ml-3"
                color="primary"
                dark
                v-bind="props"
              >
                London Trips
                <iconify-icon
                  icon="mingcute:down-line"
                  rotate="270deg"
                  class="tw-pt-[1.5px]"
                ></iconify-icon>
              </button>
            </template>
            <v-list class="sub-header__list">
              <v-list-item
                v-for="item in currentShowingCards"
                :key="item.id"
                class="px-0"
              >
                <v-list-item-title>
                  <p
                    class="tw-text-base tw-w-full mb-0"
                    @click="navigateToTrip(item.slug)"
                  >
                    {{ item.title || "Untitled Trip" }}
                  </p>
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="!currentShowingCards.length">
                <v-list-item-title>
                  <p class="tw-text-base tw-w-full mb-0">No trips available</p>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </nav>
      </v-container>
    </section>

    <section
        class="max-w-[90%] tw-items-center tw-bg-[F9DAED] tw-flex tw-flex-col tw-justify-center"
    >
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
            >
            </v-text-field>
          </div>
        </div>

        <div class="card-container tw-grid tw-grid-cols-1 md:tw-grid-cols-2">
          <!-- Trips Display -->
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
              <h4
                  class="card-title tw-text-left tw-font-semibold tw-max-w-[70%]"
              >
                {{ card.title }}
              </h4>
              <div class="tw-gap-2 tw-flex tw-items-center" v-if="card.start_date && card.end_date">
                <client-only>
                  <iconify-icon
                      icon="oui:token-date"
                      class="tw-text-lg tw-text-black"
                  ></iconify-icon>
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
                  ></iconify-icon>
                  <iconify-icon
                      v-show="card.type === 'foreign'"
                      icon="bxs:plane-alt"
                      class="tw-border-2 tw-p-2 tw-bg-gradient-to-r from-pink-800 via-red-700 to-yellow-700 tw-rounded-full tw-text-2xl tw-text-black"
                  ></iconify-icon>
                </client-only>
                <div
                    class="tw-flex tw-gap-2 tw-py-2 tw-px-4 tw-bg-[#fef3f9] tw-rounded-2xl"
                >
                  <span
                      v-for="destination in card.destinations"
                      :key="destination.city"
                      class="tw-m-0 tw-text-[#eb0c8f]"
                  >{{ destination.state }}</span
                  >
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
  width: 100%; /* Full-width line */
  height: 2px; /* Line thickness */
  background-color: #cccccc; /* Line color */
  margin: 20px 0; /* Optional spacing */
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

.plane {
  border: 1px solid;
  border-radius: 50%;
  padding: 6px;
  text-align: center;
}

.see-details {
  border: 1px solid black;
  padding: 6px;
  border-radius: 10px;
}

.image-hover-effect {
  overflow: hidden; /* Ensures that scaling doesn't overflow the container */
}

.image-hover-effect img {
  display: block; /* Ensures no extra space at the bottom */
  width: 100%; /* Ensure image takes up the width of its container */
  transition: transform 0.3s ease; /* Smooth hover transition */
}

.image-hover-effect img:hover {
  transform: scale(1.1); /* Scales the image slightly on hover */
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
  .card > div:first-child { /* This targets the flex container with title and date */
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .card-title {
    max-width: 100% !important;
  }

  .tw-gap-2.tw-flex.tw-items-center {
    width: 100%;
    justify-content: flex-start;
  }
}

/* Sub-Header Styles from default.vue */
.sub-header {
  background: $funsha-pink;
  backdrop-filter: blur(15px);
  color: white;
  min-height: 60px;
  position: fixed;
  top: 90px;
  width: 100%;
  z-index: 2;
}

.sub-header .container {
  width: 100%;
  overflow-x: auto;
}

.sub-header nav {
  min-width: 100%;
}

.sub-header__title {
  font-size: 1rem;
  color: white;
  text-decoration: none;
  transition: 0.2s;
}

.sub-header__title:hover {
  color: $loiz-pink-light !important;
  transition: 0.2s;
}

.sub-header__title img {
  width: 18px;
}

.sub-header__list {
  height: 310px;
  overflow-y: scroll;
}

.sub-header__list .v-list-item {
  width: 100%;
  transition: 0.3s;
  cursor: pointer;
}

.sub-header__list .v-list-item:hover {
  background-color: #ccc;
  transition: 0.3s;
}

.sub-header__list .v-list-item button {
  width: 100%;
  transition: 0.2s;
}

.sub-header__list .v-list-item button:hover {
  color: $loiz-pink !important;
  transition: 0.2s;
}

.sub-header__list .v-list-item button .v-icon {
  color: #555555;
  font-size: 18px;
}

@media screen and (max-width: 1264px) {
  .sub-header__title {
    flex: 0 0 auto;
    font-size: 0.9rem;
  }
}

@media screen and (max-width: 960px) {
  .sub-header {
    z-index: 1;
  }
}

@media screen and (max-width: 600px) {
  .sub-header__title {
    font-size: 0.85rem;
  }
}
</style>