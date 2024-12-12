<script setup>
import { useStore } from "~/store";
import { useConsultationStore } from "~/store/consultation";

const route = useRoute();
const store = useStore();
const consultationStore = useConsultationStore();

const type = route.params.type;

const priceNGN = computed(() => consultationStore.priceNGN);
const price = computed(() => consultationStore.price);
const isNigerian = computed(() => store.location.countryCode === "NG");

definePageMeta({
  layout: "services",
  middleware: ["auth"],
});

const meta = {
  title:
    "Book a consultation session on Loiz Tours & Travels Ltd - Your Gateway to Exhilarating & Seamless Travel Experiences!",
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
  <div class="book-consultationn mx-auto">
    <v-container>
      <div class="d-flex align-center justify-space-between">
        <h1>Book a consultation</h1>
        <p v-if="isNigerian" class="mb-0">NGN {{ useAmtToString(priceNGN) }}</p>
        <p v-else class="mb-0">${{ price }}</p>
      </div>
      <book-consultation-form />
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.v-container {
  padding: 1% 8% !important;
}
.book-consultationn {
  width: 75%;
  h2 {
    font-size: 26px;
  }
}
@media screen and (max-width: 960px) {
  .book-consultationn {
    width: 100%;
    h1 {
      font-size: 18px;
    }
    h2 {
      font-size: 16px;
    }
  }
}
</style>
