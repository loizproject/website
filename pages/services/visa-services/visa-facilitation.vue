<script setup>
import { useStore } from "~/store";
import { useContentStore } from "~/store/content";

const route = useRoute();
const store = useStore();
const contentStore = useContentStore();

const country_query = route.query.country;
const serviceCategory_query = route.query.title;
const country_index = ref(0);
const countryKey = ref(0);
const country = ref("");
const currentShowingServiceCategories = ref([]);
const currentShowingServiceCategory = ref(null);
const slug = ref(getSlug(route.path));
const serviceSlug = ref(getServiceSlug(route.path));

const getSubservicesBySlug = computed(() => contentStore.getSubservicesBySlug);

const subservice = computed(() => {
  return getSubservicesBySlug.value(slug.value, serviceSlug.value);
});

const countries = computed(() => {
  const service_categories = subservice.value?.service_categories || [];
  const countries = [];
  if (service_categories) {
    service_categories.forEach((element) => {
      if (!countries.includes(element.country)) {
        countries.push(element.country);
      }
    });
  }
  return countries;
});

function getSlug(route) {
  const arr = route.split("/");
  return arr[arr.length - 1]; // "/service/{service slug}""
}

function getServiceSlug(route) {
  const arr = route.split("/");
  return arr[arr.length - 2]; // "/service/{service slug}/{subservice slug}"
}

function mountCountry(name) {
  countries.value.forEach((item, index) => {
    if (item === name) {
      country_index.value = index;
      setCountry(index);
    } else {
      setCountry(0); // default to UK
    }
  });
}

function setCountry(id) {
  countries.value.forEach((item, index) => {
    if (index === id) {
      country.value = item;
    }
  });
  const service_categories = subservice.value?.service_categories || [];
  const arr = [];
  service_categories.forEach((item) => {
    if (item.country === country.value) {
      arr.push(item);
    }
  });
  currentShowingServiceCategories.value = arr;
  // set service category if required
  const category = [...arr].find((item) => item.title === serviceCategory_query);
  currentShowingServiceCategory.value = category || null;
  countryKey.value++;
}

watch(subservice, () => {
  setCountry(country_index.value);
});

watch(country_index, () => {
  setCountry(country_index.value);
});

onMounted(() => {
  mountCountry(country_query);
});

definePageMeta({
  layout: "services",
});

const meta = computed(() => {
  return {
    title: subservice.value.title || "Visa Facilitation: Loiz Tours & Travels Ltd",
    description: subservice.value.description,
    image:
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
    <v-container v-if="subservice">
      <h1 class="mb-4">{{ subservice.title }}</h1>
      <p>
        {{ subservice.description }}
      </p>
      <v-divider class="line my-8"></v-divider>
      <v-btn-toggle
        v-if="countries.length > 0"
        v-model="country_index"
        class="d-flex align-center justify-space-around flex-wrap my-8"
        @change="setCountry"
      >
        <v-btn
          v-for="(item, index) in countries"
          :key="index"
          class="tw-mx-2 md:tw-mx-8 tw-px-5 tw-my-2"
        >
          <!-- {{ item ? item.substring(0, 16) : "" }} -->
          {{ item }}
        </v-btn>
      </v-btn-toggle>
      <div v-if="countries.length > 0">
        <country-component
          :country="country"
          :serviceCategories="currentShowingServiceCategories"
          :serviceCategory="currentShowingServiceCategory"
          :key="countryKey"
        />
      </div>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.visa-facilitation {
  min-height: 80vh;
  padding: 0 5%;
  & h1 {
    font-size: 32px;
  }
  .v-btn-toggle {
    & .v-btn {
      background-color: #fff !important;
      border: 1px solid $loiz-pink !important;
      border-radius: 999px !important;
      color: $loiz-pink !important;
      font-size: 16px;
      letter-spacing: 0;
      padding: 8px 20px !important;
      width: 150px;
      &--active {
        background-color: $loiz-pink !important;
        color: #fff !important;
      }
    }
  }
}
.v-btn-group--density-default.v-btn-group {
  height: auto;
}

@media screen and (max-width: 600px) {
  .visa-facilitation {
    padding: 0;
    & h1 {
      font-size: 24px;
    }
    .v-btn-toggle {
      & .v-btn {
        width: 120px;
        font-size: 14px;
      }
    }
  }
}
</style>
