<script setup>
import { useStore } from "~/store";
import { useConsultationStore } from "~/store/consultation";

const router = useRouter();
const store = useStore();
const consultationStore = useConsultationStore();

const priceNGN = computed(() => consultationStore.priceNGN);
const price = computed(() => consultationStore.price);
const isNigerian = computed(() => store.location.countryName === "Nigeria");

const form = ref({});
function changeService() {
  const service = form.value.service;
  router.push(`/book-consultation/${_KebabCase(service.text)}`);
}

const consultationServices = _CloneDeep(consultationStore.services);

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
      <div>
        <v-select
          v-model="form.service"
          :items="consultationServices"
          item-title="text"
          placeholder="Select consultation service"
          :item-value="(e) => e"
          :menu-props="{
            contentClass: 'consultation-dropdown',
          }"
          variant="outlined"
          flat
          hide-details
          @update:model-value="changeService"
          class="my-2"
        ></v-select>
        <div class="text-right">
          <a
            href="https://drive.google.com/file/d/1kTCTPMcyIfAq-EZ5YZYKoGHBDCf6UHQ6/view"
            target="_blank"
            class="guide-link"
          >
            View Booking Guide
          </a>
        </div>
      </div>
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
