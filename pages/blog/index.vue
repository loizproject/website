<script setup>
const config = useRuntimeConfig();
const CMS_BASE_URL = config.public.CMS_BASE_URL;

const loading = ref(false);
const search = ref("");

const query = `
{
  posts(first: 100) {
    edges {
      node {
        id
        slug
        title
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
        author {
          node {
            id
            name
            firstName
            lastName
            email
            description
            url
            uri
            avatar {
              url
            }
          }
        }
      }
    }
  }
}
`;
const graphqlQuery = {
  query: query,
  variables: {},
};

const { data } = await useAsyncData("articles", () =>
  $fetch(CMS_BASE_URL, {
    method: "POST",
    body: graphqlQuery,
  })
);
const articles = data.value ? data.value.data.posts.edges : [];
const currentShowingArticles = computed(() => {
  let res = [];
  articles.forEach((item) => {
    if (
      item.node.title?.toUpperCase().includes(search.value?.toUpperCase()) ||
      item.node.excerpt?.toUpperCase().includes(search.value?.toUpperCase())
    ) {
      res.push(item);
    }
  });
  return search.value ? res : articles;
});

const meta = {
  title: "Loiz Blog.",
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
  <div id="blog" class="container">
    <div class="lg:tw-flex tw-items-center">
      <div class="my-5">
        <h2 class="active-header">Loiz Blog</h2>
        <p>Take a look at our articles & publications</p>
      </div>
      <div class="tw-flex-grow"></div>
      <div class="lg:tw-w-1/4">
        <v-text-field
          v-model="search"
          variant="outlined"
          flat
          clearable
          placeholder="Search"
          prepend-inner-icon="mdi-magnify"
          density="comfortable"
        >
        </v-text-field>
      </div>
    </div>
    <div v-if="loading">
      <div class="d-flex align-center justify-center">
        <img src="/svg/loading.svg" alt="" class="tw-w-28 my-10" />
      </div>
    </div>
    <div
      v-else
      class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 2xl:tw-grid-cols-4 tw-gap-4 tw-animate-show"
    >
      <nuxt-link
        v-for="n in currentShowingArticles"
        :key="n.node.id"
        :to="`/blog/${n.node.slug}`"
        class="bg-white tw-rounded-lg tw-relative"
      >
        <img
          :src="n.node.featuredImage?.node.sourceUrl"
          :alt="n.node.title"
          class="tw-rounded-t-lg tw-h-56 tw-w-full tw-object-cover"
        />
        <div class="pa-5">
          <h3 class="tw-text-lg 2xl:tw-text-xl">{{ n.node.title }}</h3>
          <div
            v-html="n.node.excerpt"
            id="main-contentt"
            class="main-contentt tw-text-sm mt-2 pb-5"
          ></div>
          <p v-if="n.node.date" class="tw-text-sm tw-absolute tw-bottom-5 tw-left-5 mb-0">
            {{ useFormatDay(n.node.date) }}
          </p>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 900;
}

h2 {
  color: inherit;
  &.active-header {
    color: transparent;
    background: linear-gradient(90deg, #13abcf 0%, #eb0c8f 100.01%);
    background-clip: text;
    text-transform: uppercase;
    width: fit-content;
  }
}
</style>
