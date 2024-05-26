<script setup>
const route = useRoute();
const config = useRuntimeConfig();

const CMS_BASE_URL = config.public.CMS_BASE_URL;

const { data: page, error } = await useAsyncData("about", async () => {
  const query = `
    query {
      page(id: "/about-us", idType: URI) {
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
    "Loiz Tours & Travels Ltd - Your Gateway to Exhilarating & Seamless Travel Experiences!",
  description:
    "Whether you're planning your next adventure or seeking assistance with visa services, flights, or tours, trust Loiz Tours & Travels to make your travel experience unforgettable. Join us on our journey as we redefine the standards of excellence in the travel industry. Discover the world with Loiz Tours & Travels – Where Every Journey Begins with Excellence!",
  image:
    "https://res.cloudinary.com/du4uxc3u2/image/upload/v1708386568/yana/website/meta/About_Yana.png",
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
  <div id="about">
    <section class="jumbotron d-flex align-center">
      <div
        class="jumbotron__img d-flex align-center"
        :style="`background-image: linear-gradient(to right, #ffffffEF, #ffffff10), url(${
          featuredImage && featuredImage.node ? featuredImage.node.sourceUrl : null
        });`"
      >
        <h1 class="jumbotron__text d-flex align-center mb-0">{{ title }}</h1>
      </div>
    </section>
    <section class="main-content mt-5">
      <v-container>
        <div id="main-content" v-html="content"></div>
      </v-container>
    </section>
  </div>
</template>

<style scoped lang="scss">
.jumbotron {
  position: relative;
  height: 55vh;
  background-color: #fff;

  &__img {
    width: 70%;
    height: 55vh;
    position: absolute;
    z-index: 0;
    top: 0;
    right: 0;
    background-position: center top;
    background-size: cover;
    margin-left: auto;
  }

  &__text {
    font-size: 5rem;
    font-weight: bold;
    margin-left: -280px;
  }
}

#main-content {
  background-color: transparent;

  & h2 {
    background: inherit;
  }

  & div {
    background: #fff;
  }
}

.wp-block-group {
  background-color: #fff;
}

@media screen and (max-width: 1264px) {
  .jumbotron {
    height: 40vh;

    &__img {
      height: 40vh;
    }

    &__text {
      font-size: 4rem;
      margin-left: -180px;
    }
  }
}

@media screen and (max-width: 960px) {
  .jumbotron {
    &__text {
      margin-left: -200px;
    }
  }
}

@media screen and (max-width: 600px) {
  h3 {
    font-size: 1.3rem;
  }

  p {
    font-size: 1rem;
  }

  .jumbotron {
    height: 30vh;

    &__img {
      background-image: linear-gradient(to right, #00000070, #00000070),
        url("/img/about-banner.png");
      height: 30vh;
      width: 100%;
    }

    &__text {
      font-size: 2.5rem;
      margin-left: 18px;
    }
  }

  .who-we-are {
    & p {
      font-size: 1rem;
    }

    & .about-who {
      & p {
        font-size: 1.2rem;
      }
    }
  }
}
</style>
