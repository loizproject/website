<script setup>
import { convert } from "html-to-text";

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
const article = data?.value.data.post;
const { title, excerpt, categories, tags, date, content, featuredImage, author } =
  article || {};
const link = `${config.public.APP_URL}/blog/${slug}`;

const meta = ref({
  title: title,
  description: convert(excerpt, { wordwrap: 120 }),
  image:
    featuredImage?.node.sourceUrl ||
    "https://res.cloudinary.com/loiztours/image/upload/site-media/img/atikh-bana.png",
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
});
</script>

<template>
  <div class="container">
    <div v-if="!article">
      <div class="d-flex align-center justify-center">
        <img src="/svg/loading.svg" alt="" class="tw-w-28 my-10" />
      </div>
    </div>
    <div v-else class="lg:tw-w-[90%] tw-mx-auto">
      <h1
        class="tw-text-2xl md:tw-text-3xl lg:tw-text-4xl tw-font-black active-header my-5"
      >
        {{ title }}
      </h1>
      <img
        :src="featuredImage?.node.sourceUrl"
        :alt="title"
        class="tw-rounded-lg tw-w-full"
      />
      <div class="bg-white pa-6 my-5 tw-border-[0.1px] tw-rounded-xl">
        <div v-html="content" class="mt-2"></div>
      </div>
      <div class="tw-flex tw-items-center tw-text-4xl">
        <div class="tw-flex tw-items-center">
          <p class="mb-0 mr-2 tw-text-lg tw-font-bold">Share Post:</p>
          <a
            :href="`https://twitter.com/intent/tweet?original_referer=${encodeURI(
              config.public.APP_URL
            )}&text=${encodeURI(title)}&url=${encodeURI(`\n${link}`)}`"
            target="_blank"
            class="mr-3 tw-text-2xl tw-text-[#55ACEE]"
          >
            <iconify-icon icon="bi:twitter" class=""></iconify-icon>
          </a>
          <a
            :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURI(
              link
            )}&amp;src=sdkpreparse`"
            target="_blank"
            class="mr-3 tw-text-2xl tw-text-[#1C54D1]"
          >
            <iconify-icon icon="ic:baseline-facebook" class=""></iconify-icon>
          </a>
          <a
            :href="`http://www.linkedin.com/shareArticle?mini=true&url=${link}&title=${encodeURI(
              title
            )}&summary=${encodeURI(meta.description)}`"
            target="_blank"
            class="mr-3 tw-text-2xl tw-text-[#0A66C2]"
          >
            <iconify-icon
              icon="entypo-social:linkedin-with-circle"
              class=""
            ></iconify-icon>
          </a>
          <span
            target="_blank"
            class="mr-3 tw-text-2xl tw-cursor-pointer"
            @click="useCopyText(link)"
          >
            <iconify-icon icon="ph:link-duotone"></iconify-icon>
          </span>
        </div>
        <p v-if="article.date" class="tw-text-sm tw-absolute tw-bottom-5 tw-left-5 mb-0">
          {{ useFormatDay(article.date) }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.active-header {
  color: transparent;
  background: linear-gradient(90deg, #13abcf 0%, #eb0c8f 100.01%);
  background-clip: text;
  text-transform: uppercase;
  width: fit-content;
  font-family: trip-bold, sans-serif;
}
</style>
