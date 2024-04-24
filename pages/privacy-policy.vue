<script setup>
const route = useRoute();
const config = useRuntimeConfig();

const CMS_BASE_URL = config.public.CMS_BASE_URL;

const { data: page, error } = await useAsyncData("about", async () => {
  const query = `
    query {
      page(id: "/privacy-policy", idType: URI) {
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

onMounted(() => {});
</script>

<template>
  <div id="privacy-policy">
    <!-- Hero Banner Start -->
    <div
      class="container-fluid p-5 privacyBanner d-flex align-center"
      :style="`background-image: linear-gradient(to right,#00000080, #00000080), url(${
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
  background-position: center;
  background-size: cover;
}
.cookieHeading {
  color: #fff;
}
</style>
