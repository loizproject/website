<script setup>
const route = useRoute();
const slug = route.params.slug;

const config = useRuntimeConfig();
const CMS_BASE_URL = config.public.CMS_BASE_URL;

const query = `
  query {
    post(id: "${slug}", idType: SLUG) {
      id
      title
      slug
      uri
      content
      excerpt
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
      author {
        node {
          name
          firstName
          lastName
          description
          url
          email
          avatar {
            url
          }
        }
      }
    }
  }
`;

const article = ref(null);
async function fetchArticle() {
  try {
    const graphqlQuery = {
      query: query,
      variables: {},
    };
    const { data } = await useAxiosPost(CMS_BASE_URL, graphqlQuery);
    article.value = data.data.post;
  } catch (error) {
    console.warn("Failed to fetch article: An error occoured");
    console.error(error);
  }
}

onMounted(() => {
  setTimeout(async () => {
    await fetchArticle();
    console.log(article.value);
  }, 200);
});
</script>

<template>
  <div class="container">
    <div class="my-5">
      <h2 class="active-header">{{ article.title }}</h2>
    </div>
    <div v-html="article.content" class="mt-2"></div>
  </div>
</template>

<style scoped></style>
