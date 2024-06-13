<script setup lang="ts">
import { useStore } from "~/store";
import { useAuthStore } from "~/store/auth";
import { useBasketStore } from "~/store/basket";
import { useContentStore } from "./store/content";

const loading = ref(true);

const store = useStore();
const authStore = useAuthStore();
const contentStore = useContentStore();
const basketStore = useBasketStore();

const fetchInitialData = async () => {
  await contentStore.fetchServices();
  await contentStore.fetchCountries();
  await store.fetchLocation();
  await store.fetchRates();
  loading.value = false;
};

const setUser = async () => {
  try {
    await authStore.fetchUser();
    await basketStore.fetchBasket();
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await fetchInitialData();
  await setUser();
});
</script>

<template>
  <div>
    <div class="tw-animate-show tw-font-medium">
      <div v-show="loading" class="loading">
        <div class="">
          <nuxt-img src="/svg/logo.svg" class="tw-w-48" />
          <p>Loading...</p>
        </div>
      </div>
      <v-app v-show="!loading">
        <Toast v-if="store.toast" :meta="store.toastMeta" />
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </v-app>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loading {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    text-align: center;
  }
}
</style>
