<script setup>
import { useStore } from "~/store";
import { useConsultationStore } from "~/store/consultation";

const route = useRoute();
const store = useStore();
const consultationStore = useConsultationStore();

const type = route.params.type;

const priceNGN = computed(() => consultationStore.priceNGN);
const price = computed(() => consultationStore.price);
const isNigerian = computed(() => store.location.countryName === "Nigeria");

definePageMeta({
  layout: "services",
  middleware: ["auth"],
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
