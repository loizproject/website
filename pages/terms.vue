<script setup>
const route = useRoute();
const config = useRuntimeConfig();

const CMS_BASE_URL = config.public.CMS_BASE_URL;

const { data: page, error } = await useAsyncData("about", async () => {
  const query = `
    query {
      page(id: "/terms", idType: URI) {
        id
        title
        content
        featuredImage {
          node {
            id
            sourceUrl
          }
        }
      }
    }
  `;
  const graphqlQuery = {
    query: query,
    variables: {},
  };
  const resp = await useAxiosExtPost(CMS_BASE_URL, JSON.stringify(graphqlQuery));
  const { page } = resp.data.data;
  return page;
});

if (error.value) {
  console.log(`Error occoured when fetching ${route.fullPath} page: ${error.value}`);
}
const { title, featuredImage, content } = page.value && !error.value ? page.value : {};

const meta = {
  title:
    "Terms and Conditions: Loiz Tours & Travels Ltd - Your Gateway to Exhilarating & Seamless Travel Experiences!",
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
  <div id="terms">
    <!-- Hero Banner Start -->
    <div
      class="container-fluid p-5 privacyBanner d-flex align-center"
      :style="`background-image: linear-gradient(to right, #ffffff, #ffffff01, #ffffff01), url(${
        featuredImage && featuredImage.node ? featuredImage.node.sourceUrl : null
      });`"
    >
      <div class="container p-5">
        <h1 class="cookieHeading">{{ title }}</h1>
      </div>
    </div>
    <!-- Hero Banner Ends -->

    <!-- Content Body Starts -->
    <section class="mt-5">
      <v-container>
        <div id="main-content" v-html="content"></div>
      </v-container>
    </section>
    <!-- Content Body Ends -->
  </div>
</template>

<style scoped lang="scss">
.privacyBanner {
  background-position: right;
  background-size: contain;
  h1 {
    width: 50%;
  }
}
</style>
