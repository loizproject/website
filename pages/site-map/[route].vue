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

const meta = {
  title:
    "Site Map: Loiz Tours & Travels Ltd - Your Gateway to Exhilarating & Seamless Travel Experiences!",
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
