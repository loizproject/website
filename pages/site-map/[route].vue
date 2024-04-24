<script setup>
import { useContentStore } from "~/store/content";

const contentStore = useContentStore();
const route = useRoute();
const config = useRuntimeConfig();

const items = computed(() => contentStore.siteMapItems);
const activeItem = computed(() => {
  let currentRoute = route.fullPath;
  if (currentRoute.endsWith("/")) {
    currentRoute = currentRoute.slice(0, -1); // Remove the last character
  }
  const res = items.value.find((item) => item.route === currentRoute);
  return res;
});
</script>

<template>
  <v-container>
    <v-img
      loading
      :src="`${config.public.MEDIA_ASSETS_URL}/${activeItem.imgUrl}`"
      class="img mx-auto"
    ></v-img>
  </v-container>
</template>

<style scoped lang="scss">
.img {
  border-radius: 10px;
  width: 90%;
}
</style>
