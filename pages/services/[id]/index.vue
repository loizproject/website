<script setup>
import { useContentStore } from "~/store/content";

const route = useRoute();
const contentStore = useContentStore();

const getSlug = (route) => {
  const arr = route.split("/");
  const slug = route.endsWith("/") ? arr[arr.length - 2] : arr[arr.length - 1];
  return slug;
};

const slug = getSlug(route.fullPath);
const service = computed(() => {
  return contentStore.getServiceBySlug(slug);
});

const chat = () => {
  const text = `Hi admin, I want more information about your 3rd party services.`;
  const phone = "2347046178336";
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
    text
  )}`;
  window.open(url, "_blank");
};

onMounted(async () => {
  await contentStore.fetchServices();
});

definePageMeta({
  layout: "services",
  middleware: ["redirect"],
});

const meta = computed(() => {
  return {
    title: service.value.title || "Visa Facilitation: Loiz Tours & Travels Ltd",
    description: service.value.description,
    image:
      service.value.image ||
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
  <div id="" class="visa-services">
    <v-container v-if="service">
      <h1 class="mb-4">{{ service.title }}</h1>
      <v-img :src="service.image" class="my-4 rounded-md"></v-img>
      <p class="mb-8">
        {{ service.description }}
      </p>
      <div v-for="item in service.subservices" :key="item.title" class="my-2">
        <nuxt-link :to="`/services/${service.slug}/${item.slug}`">
          {{ item.title }}
        </nuxt-link>
      </div>
      <div class="d-flex align-center justify-start mt-8">
        <v-btn
          v-if="service?.slug !== 'third-party-services'"
          large
          type="submit"
          class="submit"
          elevation="0"
          @click="$router.push(`/book-consultation/${service.slug}`)"
        >
          Book Consultation
        </v-btn>
        <v-btn v-else large class="submit px-8" elevation="0" @click="chat">
          Chat with us
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.visa-services {
  padding: 0 2%;
  & a {
    color: #555;
    // text-decoration: underline;
    border-bottom: 0.1px solid #555;
  }
}
</style>
