<script setup>
import slides from "~/utils/site-content/sliderData.json";
import { ref, onMounted, computed } from "vue";
import { formatDate } from "~/utils/lib";
import { useRouter } from "vue-router";

const router = useRouter();
let trips = ref([]);
const menuOpen = ref(false);

const tripsSlides = computed(() => slides.filter((item) => item.image));

// Fetch trips with error handling
onMounted(async () => {
  try {
    const res = await useAxiosFetch("/trips");
    if (res.data?.data?.trips) {
      trips.value.push(...res.data.data.trips);
    } else {
      console.error("No trips data received");
    }
  } catch (error) {
    console.error("Failed to fetch trips:", error);
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

// Computed property to filter trips with safety checks
const currentShowingCards = computed(() => {
  const today = new Date().toISOString().split("T")[0];

  return trips.value.filter((item) => {
    if (!item.enabled) return false;

    if (search.value) {
      const searchQuery = search.value.toUpperCase();
      const titleMatch = item.title?.toUpperCase?.().includes(searchQuery) ?? false;
      const textMatch = item.text?.toUpperCase?.().includes(searchQuery) ?? false;
      if (!titleMatch && !textMatch) return false;
    }

    if (showFutureTrips.value === true) {
      return item.start_date >= today;
    } else if (showFutureTrips.value === false) {
      return item.end_date < today;
    }

    return true;
  });
});

const banner = (images) => images?.find((image) => image.type === "banner") ?? { url: "/fallback-image.jpg" };

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
      <Slider :sliderTrips="tripsSlides" />
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
            ></v-text-field>
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
                :alt="card.title || 'Trip Image'"
                class="card-image tw-h-[200px] md:tw-h-[300px] tw-w-[100%]"
              />
            </div>
            <div class="tw-flex tw-justify-between tw-items-center">
              <h4
                class="card-title tw-text-left tw-font-semibold tw-max-w-[70%]"
              >
                {{ card.title || "Untitled Trip" }}
              </h4>
              <div
                class="tw-gap-2 tw-flex tw-items-center"
                v-if="card.start_date && card.end_date"
              >
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
              {{ card.caption || "No description available" }}
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
                    v-for="destination in card.destinations || []"
                    :key="destination?.city"
                    class="tw-m-0 tw-text-[#eb0c8f]"
                  >{{ destination?.state || "Unknown" }}</span>
                </div>
              </div>
              <v-btn
                :to="`/trips/${card.slug}`"
                class="submit"
                elevation="0"
                :disabled="!card.slug"
              >
                See details
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
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
  border-radius: 8px;
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

.sub-header {
  background: #c40a77; // Fallback color if $funsha-pink is unavailable
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
  color: #f585c7 !important; // Fallback for $loiz-pink-light
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
  color: #eb0c8f !important; // Fallback for $loiz-pink
  transition: 0.2s;
}

.sub-header__list .v-list-item button .v-icon {
  color: #555555;
  font-size: 18px;
}

@media (max-width: 768px) {
  .card > div:first-child {
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

@media screen and (max-width: 1264px) {
  .sub-header__title {
    flex: 0 0 auto;
    font-size: 0.9rem;
  }
}

@media screen and (max-width: 600px) {
  .sub-header__title {
    font-size: 0.85rem;
  }
}
</style>