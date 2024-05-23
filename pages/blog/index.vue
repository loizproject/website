<script setup>
const config = useRuntimeConfig();
const CMS_BASE_URL = config.public.CMS_BASE_URL;

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

onMounted(() => {
  setTimeout(async () => {
    await fetchArticles();
    console.log(articles.value);
  }, 200);
});
</script>

<template>
  <div class="container">
    <div class="my-5">
      <h2 class="active-header">Loiz Blog</h2>
      <p>Take a look at our articles & publications</p>
    </div>
    <div
      class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 2xl:tw-grid-cols-4 tw-gap-4"
    >
      <nuxt-link v-for="n in articles" :key="n.node.id" :to="`/blog/${n.node.slug}`">
        <v-card variant="flat" class="pa-5 tw-rounded-xl">
          <h3 class="tw-text-xl lg:tw-text-2xl">{{ n.node.title }}</h3>
          <div v-html="n.node.excerpt" class="mt-2"></div>
        </v-card>
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
.v-card {
  p {
    font-size: 16px !important;
  }
}
</style>
