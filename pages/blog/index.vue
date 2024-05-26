<script setup>
const config = useRuntimeConfig();
const CMS_BASE_URL = config.public.CMS_BASE_URL;

const loading = ref(true);
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

const articles = ref([]);
async function fetchArticles() {
  try {
    const graphqlQuery = {
      query: query,
      variables: {},
    };
    const { data } = await useAxiosPost(CMS_BASE_URL, graphqlQuery);
    articles.value = data.data.posts.edges;
  } catch (error) {
    console.warn("Failed to save library articles: An error occoured");
    console.error(error);
  }
}
const currentShowingArticles = computed(() => {
  let res = [];
  articles.value.forEach((item) => {
    if (
      item.node.title?.toUpperCase().includes(search.value.toUpperCase()) ||
      item.node.excerpt?.toUpperCase().includes(search.value.toUpperCase())
    ) {
      res.push(item);
    }
  });
  return res;
});

onMounted(() => {
  setTimeout(async () => {
    await fetchArticles();
    loading.value = false;
  }, 200);
});
</script>

<template>
  <div id="blog" class="container">
    <div class="tw-flex tw-items-center">
      <div class="my-5">
        <h2 class="active-header">Loiz Blog</h2>
        <p>Take a look at our articles & publications</p>
      </div>
      <div class="tw-flex-grow"></div>
      <div class="tw-w-1/4">
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
