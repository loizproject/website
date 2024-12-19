<script setup>
import getSiteHead from "~/utils/getSiteHead";
import { useDisplay } from "vuetify";
import { useStore } from "~/store";
import { useContentStore } from "~/store/content";
import { useConsultationStore } from "~/store/consultation";

const { mdAndUp } = useDisplay();
const router = useRouter();
const config = useRuntimeConfig();


import { onMounted, ref } from 'vue';


// Reference to the modal component
const modal = ref(null);



const store = useStore();
const contentStore = useContentStore();
const consultationStore = useConsultationStore();

const search = ref(null);
const results = ref([]);
const watchVideoModal = ref(false);
const bookingVideoModal = ref(false);
const videoType = ref("video/mp4");
const form = ref({});
const textLimit = ref(200);
const likeServiceKey = ref(0);
const consultationService = ref(null);

const services = computed(() => contentStore.services);
const destinations = computed(() => contentStore.destinations);
const testimonials = computed(() => contentStore.testimonials);
const consultationServices = computed(() => consultationStore.services);
const advisoryServices = computed(() => contentStore.advisoryServices);

function startSearch() {
  if (search.value && search.value.length >= 3) {
    const res = useSearch(services.value, search.value);
    results.value = res;
  }
}

function setWatchVideo() {
  if (window.location.href.indexOf("#company-video") > -1) {
    watchVideoModal.value = true;
  }
}

function setBookingVideo() {
  if (window.location.href.indexOf("#booking-video") > -1) {
    bookingVideoModal.value = true;
  }
}

function toggleWatchVideoModal() {
  watchVideoModal.value = !watchVideoModal.value;
}

function toggleBookingVideoModal() {
  bookingVideoModal.value = !bookingVideoModal.value;
}

function likeVideo() {
  store.setLikeWatchVideo(!likeWatchVideo.value);
}

function likeService(item) {
  contentStore.toggleLikeService(item.title);
  likeServiceKey.value++;
}

function truncateText(text) {
  return text.substring(0, textLimit.value);
}

function bookConsultation() {
  router.push(`/book-consultation/${useGetSlug(consultationService.value.text)}`);
}

function setServiceDestinations() {
  const service = services.value.filter(
    (item) => item.id === form.value.serviceCategory.service_id
  )[0];
  form.value.service = service;
}

function getStarted() {
  router.push(
    `/${form.value.service.slug}/${form.value.serviceCategory.slug}?country=${
      form.value.location.id - 1
    }`
  );
}

function toggleContent(item) {
  contentStore.toggleDestinationContent(item);
}

const slideImageStyle = (item) => `
background-image: linear-gradient(to right, ${
  item.showContent ? "#000000AA, #000000AA" : "#00000010, #00000010"
}), url(${config.public.MEDIA_ASSETS_URL}${item.img})
`;

onMounted(() => {
  setTimeout(() => {
    setWatchVideo();
    setBookingVideo();
  }, 500);
});

onUnmounted(() => {
  useClearAllIntervals();
});

const meta = {
  title:
    "Loiz Tours & Travels Ltd - Your Gateway to Exhilarating & Seamless Travel Experiences!",
  description:
    "Whether you're planning your next adventure or seeking assistance with visa services, flights, or tours, trust Loiz Tours & Travels to make your travel experience unforgettable. Join us on our journey as we redefine the standards of excellence in the travel industry. Discover the world with Loiz Tours & Travels – Where Every Journey Begins with Excellence!",
  image:
    "https://res.cloudinary.com/loiztours/image/upload/site-media/img/atikh-bana.png",
  keywords:
    "travel, tours, vacations, domestic tours in nigeria, visa, visa services, 3rd party travel companies, travel companies in Nigeria",
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
  <div>

    <Modal ref="modal" />

    <section id="home-banner" class="home-banner d-flex align-center">
      <v-container class="home-banner__main" data-aos="zoom-in">
        <h1 class="home-banner__title">
          Bringing Your Travel Dream <span class="blue-text">to Fruition</span>
        </h1>
        <div class="d-flex align-center justify-space-betweenn mt-5">
          <div>
            <v-btn
              :size="mdAndUp ? 'x-large' : 'large'"
              class="submit play-video d-flex align-center py-4"
              @click="toggleWatchVideoModal"
            >
              <p class="mb-0">Services Video</p>
              <iconify-icon
                icon="gravity-ui:play-fill"
                class="play-video__icon ml-2"
              ></iconify-icon>
            </v-btn>
            <VideoPlayer
              v-if="watchVideoModal"
              videoId="company-video"
              videoSrc="https://res.cloudinary.com/loiztours/video/upload/q_50/site-media/videos/watch-video.mp4"
              :videoType="videoType"
              @close="toggleWatchVideoModal"
            >
            </VideoPlayer>
          </div>
          <div class="ml-4">
            <v-btn
              :size="mdAndUp ? 'x-large' : 'large'"
              class="submit play-video d-flex align-center py-4"
              @click="toggleBookingVideoModal"
            >
              <p class="mb-0">Booking <span v-if="mdAndUp">Journey</span> Video</p>
              <iconify-icon
                icon="gravity-ui:play-fill"
                class="play-video__icon ml-2"
              ></iconify-icon>
            </v-btn>
            <VideoPlayer
              v-if="bookingVideoModal"
              videoId="booking-video"
              videoSrc="https://res.cloudinary.com/loiztours/video/upload/site-media/videos/booking-journey-video.mp4"
              :videoType="videoType"
              @close="toggleBookingVideoModal"
            >
            </VideoPlayer>
          </div>
        </div>
      </v-container>
      <div class="home-banner__actions">
        <v-container class="">
          <div class="search relative d-sm-flex align-center justify-space-around">
            <h3 class="mr-4">
              Search from a long list <br class="d-none d-md-block" />
              of travel services
            </h3>
            <div class="d-flex align-center justify-end">
              <input
                v-model="search"
                type="text"
                placeholder="Start your search here..."
                @keyup="startSearch"
              />
              <div class="search__btn d-flex align-center" @click="startSearch">
                <v-icon>mdi-magnify</v-icon>
              </div>
            </div>
            <div v-if="search && search.length >= 3" class="search__results mt-1">
              <v-card class="pa-5">
                <h4>Top Results</h4>
                <div v-if="results.length === 0" class="py-4">No results</div>
                <div v-else>
                  <div v-for="(n, index) in results" :key="index" class="my-3">
                    <div class="py-2">
                      <h5 @click="$router.push(n.route)" class="pointer">
                        {{ n.title }}
                      </h5>
                      <div class="ml-5">
                        <div class="">
                          <p v-if="n.service" class="mb-0">{{ n.service }}</p>
                          <p v-if="n.subservice" class="mb-0">
                            {{ n.subservice }}
                          </p>
                        </div>
                        <p v-if="n.country">
                          <i>{{ n.country }}</i>
                        </p>
                      </div>
                    </div>
                    <v-divider class="line"></v-divider>
                  </div>
                </div>
              </v-card>
            </div>
          </div>
        </v-container>
      </div>
    </section>

    <section id="our-style" class="our-style py-4">
      <v-container>
        <div data-aos="fade-up">
          <h2>OUR STYLE</h2>
          <p>
            We are collaborative, customer centric and believe in business agility to
            compete and thrive in the industry, while responding to our customers needs.
            We use our customers persona and customer journey mapping to understand our
            customers, while removing their pain points on all touch points.
          </p>
          <p>
            We use all forms of consumer messaging communications: Email, SMS, WhatsApp,
            Telegram, Facebook messenger, phone calls, FAQs and above all, face to face,
            in a bid to get all your questions answered.
          </p>
        </div>
      </v-container>
    </section>

    <section id="our-services" class="our-services">

      <v-container>
        <h2>Our Services</h2>
      </v-container>
      
      <div class="our-services__slider">
        <v-slide-group
          ref="ourServicesSlider"
          multiple
          class="my-5"
          show-arrows
          center-active
        >
          <v-slide-group-item
            v-for="item in services"
            :key="item.title"
            v-slot="{ toggle }"
          >
            <v-card
              class="slide-card mx-2 my-2 tw-w-[350px] 2xl:tw-w-[400px]"
              @click="toggle"
            >
              <v-img
                class="slide-card__img"
                cover
                :style="`backgroundImage: linear-gradient(to right, #00000020, #00000020), url(${item.image})`"
              >
                <v-btn elevation="0" color="#34343450" @click="likeService(item)">
                  <v-icon
                    :key="likeServiceKey"
                    :color="item.like ? 'orange !important' : '#fff'"
                  >
                    mdi-heart
                  </v-icon>
                </v-btn>
              </v-img>
              <div class="pa-4">
                <h4 class="mb-3">{{ item.title }}</h4>
                <p>
                  {{
                    item.description && item.description.length < textLimit
                      ? item.description
                      : `${truncateText(item.description)}...`
                  }}
                </p>
              </div>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </div>
    </section>

    <section
      id="book-consultation"
      class="book-consultation d-flex align-center justify-center my-4"
    >
      <v-container class="text-center">
        <div data-aos="zoom-in">
          <h2>BOOK PAID CONSULTATION</h2>
          <v-select
            :items="consultationServices"
            item-title="text"
            :item-value="(e) => e"
            placeholder="Select consultation service"
            :menu-props="{
              contentClass: 'consultation-dropdown',
            }"
            variant="solo"
            flat
            v-model="consultationService"
            class="consultation-select my-2 mx-auto"
          ></v-select>
          <v-btn
            class="submit"
            :disabled="!consultationService"
            @click="bookConsultation"
          >
            Proceed
          </v-btn>
        </div>
      </v-container>
    </section>

    <section id="awesome-destinations" class="my-8">
      <v-container>
        <h2>Awesome Destinations</h2>
        <div class="tw-overflow-x-scroll no-scroll">
          <div
            class="tw-flex lg:tw-grid lg:tw-grid-cols-3 xl:tw-grid-cols-4 lg:tw-gap-6 tw-w-[1800px] lg:tw-w-full lg:tw-flex-wrap tw-justify-center"
          >
            <v-card
              v-for="item in destinations"
              :key="item.title"
              class="slide-card slide-card--destination mx-2 my-2 tw-w-[300px] lg:tw-w-full"
              @mouseenter="toggleContent(item)"
              @mouseleave="toggleContent(item)"
            >
              <div
                class="slide-card__img slide-card--destination__img d-flex align-center"
                cover
                :style="slideImageStyle(item)"
              >
                <div
                  v-if="item.showContent"
                  data-aos="zoom-in"
                  class="slide-card--destination__content pa-4"
                >
                  <h4 class="mb-10">{{ item.title }}</h4>
                  <p class="mb-0">{{ item.text }}</p>
                </div>
              </div>
            </v-card>
          </div>
        </div>
      </v-container>
    </section>
    
    <section id="our-history" class="our-history">
      <v-container>
        <div data-aos="fade-right">
          <h2>Our History</h2>
          <p>
            Loiz Tours & Travels was founded in March 2013. The passion was borne out of
            the need by Nigerians to relieve anxiety and stress by embarking on a holiday
            and savouring a relaxing and beautiful experience to calm nerves and improve
            mental health. Loiz Tours & Travels has been actively helping customers plan
            and organise travel packages since 2013.
          </p>
          <p>
            Led by IATA Certified International Travel Consultant, the company is a legend
            in the Nigerian travel industry with bespoke, exhilarating, adventurous,
            educative, relocation and fun-packed packages.
          </p>
        </div>
      </v-container>
    </section>

     <section id="trips-section" class="trips__container">
      <v-container>
        <h2 class="tw-mx-auto tw-capitalize tw-mb-6">Latest Trips</h2>
        <TripSlider />
      </v-container>
    </section>

    <section id="advisory-services" class="advisory-services">
      <v-container>
        <h2>Advisory Services</h2>
        <v-row no-gutters justify="end" align="end">
          <v-col data-aos="fade-left" cols="12" md="6" xl="5">
            <div class="card">
              <div
                v-for="item in advisoryServices"
                :key="item"
                class="advisory-services__item d-flex align-center my-8"
              >
                <iconify-icon
                  icon="ant-design:check-circle-outlined"
                  class="advisory-services__icon"
                ></iconify-icon>
                <p class="mb-0 ml-3">
                  {{ item }}
                </p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="advisory-services__img d-none d-md-block">
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section id="gallery" class="gallery">
      <v-container>
        <h2>Gallery</h2>
        <p>We continue to do what we do best</p>
        <div class="our-services__slider">
          <div class="tw-overflow-x-scroll no-scroll">
            <div class="tw-flex tw-items-center">
              <nuxt-img
                v-for="n in 14"
                :key="n"
                :src="`/img/gallery/${n}.png`"
                class="mx-2 tw-w-[300px]"
              ></nuxt-img>
            </div>
          </div>
        </div>
      </v-container>
    </section>

    <section id="testimonials" class="testimonials my-10">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <h2>Testimonials</h2>
          <div class="d-flex align-center justify-end my-8">
            <v-btn class="testimonials-btn" large elevation="0">
              <span v-if="mdAndUp"> See All Testimonials </span>
              <v-icon class="ml-md-4">mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </div>
        <v-row class="my-5" align="stretch">
          <v-col
            cols="12"
            sm="6"
            md="4"
            v-for="item in testimonials"
            :key="item.id"
            :data-aos="item.aos"
          >
            <div class="card">
              <div class="d-flex flex-column justify-space-between px-5 px-md-8 h-full">
                <p class="testimonials__content">{{ item.content }}</p>
                <div class="d-flex align-center">
                  <img
                    class="testimonials__img mr-2"
                    :src="`${config.public.MEDIA_ASSETS_URL}/img/testimonials/${item.imgUrl}`"
                  />
                  <div>
                    <p class="testimonials__name mb-0">
                      {{ item.name }}
                    </p>
                    <p class="testimonials__date">{{ item.location }}, {{ item.date }}</p>
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
    
  </div>
</template>

<style lang="scss">
.home-banner {
  margin-top: -5vh;
  height: 80vh;
  position: relative;
  z-index: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.26) 10.59%,
      rgba(0, 0, 0, 0.42) 62.69%,
      #fff 99.73%
    ),
    url("https://res.cloudinary.com/loiztours/image/upload/site-media/img/atikh-bana.png");
  margin-bottom: 150px;

  &__main {
    margin-bottom: 10%;
  }

  &__actions {
    width: 100%;
    position: absolute;
    bottom: -40px;
    left: 0;
  }

  &__title {
    font-size: 3rem;
    color: white;
    width: 40%;
    line-height: 58px;
  }

  & .v-icon {
    color: black;
  }
}

.blue-text {
  color: #0bdfed;
}

.search {
  position: relative;
  border-radius: 20px;
  border: 1px solid #fff;
  background: rgba(255, 255, 255, 0.36);
  box-shadow: 0px 6px 22px 0px rgba(55, 55, 55, 0.25);
  backdrop-filter: blur(10px);
  padding: 20px 25px;

  & h3 {
    font-size: 2rem;
    width: 40%;
    font-weight: 400;
    line-height: 45px;
  }

  & input {
    background-color: #fff;
    border-radius: 8px;
    width: 350px;
    outline: none;
    padding: 10px 14px;
    font-size: 14px;
    box-shadow: 0px 4px 23px 0px rgba(28, 28, 28, 0.25);
  }

  &__btn {
    background-color: white;
    margin-left: 10px;
    padding: 8px;
    border-radius: 999px;
  }

  &__results {
    position: absolute;
    bottom: 105%;
    right: 0;
    width: 50%;
    max-height: 350px;
    overflow-y: scroll;
    border-radius: 8px;

    & p {
      margin-bottom: 2px;
      font-size: 12px;
    }
  }
}

.play-video {
  color: #fff;

  & p {
    font-size: 14px;
    font-weight: bold;
  }

  &__btn {
    background-color: $loiz-pink;
    padding: 10px;
    border-radius: 999px;
  }

  &__icon {
    padding: 10px;
    background: #e4e4e49c;
    color: #eb0c8f;
    border-radius: 999px;
    font-size: 10px;
  }
}

h2 {
  font-size: 2.5rem;
  font-weight: bold;
  font-family: trip-bold, sans-serif;
  letter-spacing: 0;
  // color: $loiz-sky-blue;
  color: transparent;
  background: linear-gradient(90deg, #13abcf 0%, #eb0c8f 100.01%);
  background-clip: text;
  text-transform: uppercase;
  width: fit-content;
}

.slide-card {
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.14) !important;
  width: 30%;
  &--destination {
    &__img {
      height: 400px !important;
      width: 100%;
    }
    &__content {
      color: #fff;
      & h4 {
        font-family: trip-bold, sans-serif !important;
        font-size: 1.25rem !important;
        font-weight: 900;
      }
      & p {
        font-size: 16px !important;
      }
    }
  }

  &__img {
    height: 280px;
    background-color: #00000060;
    background-position: center;
    background-size: cover;
    & .v-btn {
      margin: 10px;
      padding: 10px 10px !important;
      min-width: 10px !important;
      height: auto !important;
      border-radius: 999px;
    }
  }

  & h4 {
    font-size: 1.12rem;
  }

  & p {
    font-size: 18px;
  }
}

.book-consultation {
  background-image: linear-gradient(to right, #00000090, #00000090, #00000070),
    url("https://res.cloudinary.com/emino/image/upload/loiztours/site-media/img/book-consultation.jpg");
  background-size: cover;
  background-position: center;
  min-height: 550px;

  & h2 {
    // box-shadow: 0 0 4px #dededeff;
    color: #fff;
    width: 100%;
  }

  & h4 {
    font-size: 1.4rem;
    font-weight: 600;
    color: $normal-text;
    color: #fff;
  }

  &__img {
    height: 100%;
    border-radius: 12px;
  }

  & .v-label {
    font-size: 1rem;
  }

  & .v-input__slot {
    border-radius: 8px;
  }

  & .v-btn {
    width: 120px;
  }
}

.consultation-select {
  width: 80%;
  max-width: 400px;
}

.v-form {
  & .v-card {
    box-shadow: 0px 10px 55px rgba(0, 0, 0, 0.14);
    padding: 4%;
    border-radius: 12px;

    & .v-text-field--outlined fieldset {
      border-style: solid;
      border-width: 0.3px;
      border-color: $loiz-sky-blue;
    }

    & .v-btn {
      border-radius: 8px;
      letter-spacing: 0;
      background-image: linear-gradient(to right, $loiz-sky-blue, $loiz-pink);
    }
  }
}

.discover {
  &__main {
    font-size: 2.8rem;
    font-weight: bold;
    color: $normal-text;
    width: 85%;
  }

  & .v-card {
    padding: 8% 5%;
  }

  & .v-btn {
    min-width: 40%;
  }

  & .v-icon {
    font-size: 0.9rem;
  }
}

.our-history {
  padding: 7% 0;
  background-image: linear-gradient(to right, #00000060, #00000060),
    url("https://res.cloudinary.com/loiztours/image/upload/site-media/img/historyback.png");
  background-position: center;
  background-size: cover;

  & h2 {
    color: #fff;
    margin-bottom: 3%;
  }

  & p {
    color: #fff;
    // font-size: 1.2rem;
    font-weight: bold;
  }
}

.trips__container{
  padding: 5% 10%;
  height: 68.56rem;
  background-image: linear-gradient(to right, #00000090, #00000090, #00000070),
    url("https://res.cloudinary.com/loiztours/image/upload/v1733477469/site-media/img/trips/trips_backgound.png");
  background-size: cover;
  background-position: center;
}

.advisory-services {
  color: $normal-text;
  margin: 7% 0;

  &__item {
    margin: 3% 0;
    line-height: normal;
    font-weight: 500;

    p {
      font-size: 0.9rem;
    }
  }

  &__icon {
    color: black;
    font-size: 1.5rem;
    font-weight: 500;
  }

  &__img {
    background-image: url("https://res.cloudinary.com/loiztours/image/upload/site-media/img/ads-image.png");
    background-size: cover;
    background-position: top;
    border-radius: 10px;
    min-height: 85vh;
    width: 120%;
  }

  .card {
    margin-top: 24px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.14);
    box-shadow: 0px 4px 42px 0px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(10px);
    padding: 18px 25px;
  }
}

.gallery {
  & p {
    font-weight: bold;
    font-size: 1.2rem;
  }

  & .slide-card {
    box-shadow: none !important;

    &__img {
      min-height: 400px;
      background-size: cover;
      background-position: center;
    }
  }
}

.testimonials {
  &--deep {
    margin-top: 30%;
  }

  &__img {
    height: 50px;
    width: 50px;
    border-radius: 999px;
  }

  &__name {
    font-weight: 600;
  }

  &__date {
    font-size: 0.75rem !important;
  }

  & p {
    font-size: 18px;
  }

  &-btn {
    background-color: transparent !important;
    color: $loiz-pink !important;
    border: 1px solid $loiz-pink;
    border-radius: 24px;
    font-size: 14px !important;
    font-weight: 600;
  }

  .card {
    background-color: #fff;
    padding: 32px 0;
    // margin: 8px;
    height: 100%;
  }
}

@media screen and (max-width: 960px) {
  .discover {
    &__main {
      font-size: 2rem;
    }
  }

  .home-banner {
    display: flex;
    align-items: center;

    &__title {
      width: 50%;
      font-size: 2.8rem;
      line-height: normal;
    }
  }

  .book-consultation {
    min-height: 650px;
    background-image: linear-gradient(to right, #00000090, #00000090, #00000070),
      url("https://res.cloudinary.com/emino/image/upload/loiztours/site-media/img/book-consultation-mob.jpg");

    & .v-btn {
      margin-top: 5%;
    }
  }

  .loiz-video {
    .video-thumb {
      height: 30vh;
    }

    & .close-video-icon {
      top: 10px;
      right: 10px;
      font-size: 2rem;
      z-index: 9;
    }

    .toggle-play {
      & .v-icon {
        font-size: 2rem;
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .slide-card {
    width: 47%;
  }
}

@media screen and (max-width: 800px) {
  .slide-card {
    width: 95%;
  }
  .discover {
    &__main {
      font-size: 1.6rem;
    }
  }
}

@media screen and (max-width: 600px) {
  h2 {
    font-size: 1.6rem;
  }

  p {
    font-size: 1rem;
  }

  a {
    font-size: 1rem;
  }

  .home-banner {
    display: flex;
    align-items: center;

    &__title {
      width: 90%;
      font-size: 1.5rem;
      line-height: normal;
    }

    // &__actions {
    // }
  }

  .search {
    width: 100%;

    & h3 {
      font-size: 14px;
      width: 100%;
      line-height: normal;
      margin-bottom: 16px;
    }

    & input {
      width: 100%;
      font-size: 0.8rem;
    }

    &__results {
      max-height: 300px;
      width: 100%;
    }
  }

  .play-video {
    & p {
      font-size: 12px;
    }

    &__icon {
      font-size: 8px;
      padding: 8px;
    }
  }

  .discover {
    &__main {
      font-size: 1.5rem;
      width: 90%;
    }
  }

  .our-history {
    & p {
      font-size: 1rem;
    }
  }

  .testimonials {
    &--deep {
      margin-top: 0;
    }
  }

  .book-consultation {
    min-height: 600px;

    & .v-label {
      font-size: 0.85rem;
    }

    & .v-list-item__title {
      font-size: 0.8rem;
    }
  }
}
</style>
