<script setup>
import {
  footerSect1,
  footerSect2,
  thirdPartyServices,
  resources,
  footerContactSect,
  loizContacts,
  loizChat,
  partners,
} from "~/utils/site-content/site-layout.json";

import { useStore } from "~/store";
import { useAuthStore } from "~/store/auth";
import { useBasketStore } from "~/store/basket";
import { useContentStore } from "~/store/content";
import { useConsultationStore } from "~/store/consultation";

const store = useStore();
const authStore = useAuthStore();
const basketStore = useBasketStore();
const contentStore = useContentStore();
const consultationStore = useConsultationStore();

const loading = ref(true);
const drawer = ref(false);
const showScrollToTop = ref(false);
const manageCookiesModal = ref(false);
const servicesCompKey = ref(1);
const cookieForm = reactive({});
const cookieKey = ref(null);
const newsletterForm = reactive({});
const headerRoutes = ref([
  { name: "Home", route: "/", active: true },
  { name: "About Us", route: "/about", active: false },
  { name: "Contact Us", route: "/contact", active: false },
  { name: "FAQs", route: "/faqs", active: false },
]);

const cookies = computed(() => store.cookies);
const services = computed(() => contentStore.services);
const premiumServices = computed(() => contentStore.premiumServices);
const getServiceById = computed(() => contentStore.getServiceById);
const getSubservicesById = computed(() => contentStore.getSubservicesById);
const consultationServices = computed(() => consultationStore.services);

const user = computed(() => (authStore.user ? authStore.user : {}));

const basket = computed(() => {
  const bas = store.state.basket.basket;
  bas.forEach((item) => {
    if (!(item && item.options && item.options.booked_date)) {
      item.parentService =
        item && item.options
          ? store.getters["content/getSubservicesById"](item.options.subservice_id)
          : null;
    }
  });
  return bas;
});

const fetchInitialData = async () => {
  await contentStore.fetchServices();
  await contentStore.fetchCountries();
  await basketStore.fetchBasket();
  loading.value = false;
};

const setUser = async () => {
  try {
    await authStore.fetchUser();
    await basketStore.fetchBasket();
  } catch (error) {
    console.error(error);
  }
};

const logout = async () => {
  try {
    await this.$auth.logout();
    // store.setToast("Logged out succesfully", {type: "success"});
    basketStore.clearBasket();
  } catch (error) {
    this.$handleError(error);
  }
};

const checkCookie = async () => {
  let cookie = useGetCookie("loiz_user_preferences");
  if (cookie) {
    try {
      const { name, value } = cookie;
      // Set cookie key, form & modal
      cookieKey.value = name;
      cookieForm = JSON.parse(value);
      store.commit("setCookies", true);
    } catch (error) {
      console.error(error);
      store.commit("setCookies", true);
    }
  } else {
    store.commit("setCookies", false);
  }
};

const acceptAllCookies = async () => {
  cookieForm.performance = true;
  cookieForm.functional = true;
  cookieForm.targeting = true;
  try {
    useSetCookie("loiz_user_preferences", JSON.stringify(cookieForm), 42);
    store.commit("setCookies", true);
    manageCookiesModal.value = false;
  } catch (error) {
    console.error(error);
    store.commit("setCookies", true);
    manageCookiesModal.value = false;
  }
};

const rejectAllCookies = async () => {
  cookieForm.performance = false;
  cookieForm.functional = false;
  cookieForm.targeting = false;
  try {
    useSetCookie("loiz_user_preferences", JSON.stringify(cookieForm), 42);
    store.commit("setCookies", true);
    manageCookiesModal.value = false;
  } catch (error) {
    console.error(error);
    store.commit("setCookies", true);
    manageCookiesModal.value = false;
  }
};

const confirmCookieChoice = async () => {
  try {
    useSetCookie("loiz_user_preferences", JSON.stringify(cookieForm), 42);
    store.commit("setCookies", true);
    toggleManageCookies();
  } catch (error) {
    console.error(error);
    store.commit("setCookies", true);
    toggleManageCookies();
  }
};

const toggleManageCookies = () => {
  manageCookiesModal.value = !manageCookiesModal.value;
};

const scrollToTop = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

const scrollFunction = () => {
  if (process.client) {
    document.body.scrollTop > 40 || document.documentElement.scrollTop > 40
      ? (showScrollToTop.value = true)
      : (showScrollToTop.value = false);
  }
};

const subscribeNewsletter = async () => {
  const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  try {
    if (!newsletterForm.email) {
      store.setToast("Please enter your email", { type: "error" });
    } else if (!pattern.test(newsletterForm.email)) {
      store.setToast("Please enter a valid email", { type: "error" });
    } else {
      await useAxiosPost("/newsletter/subscribe", newsletterForm);
      store.setToast("You have succesfully subscribed to our newsletter", {
        type: "success",
      });
      newsletterForm = {};
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await fetchInitialData();
  window.onscroll = () => {
    scrollFunction();
  };
  await setUser();
});
</script>

<template>
  <div>
    <div v-if="loading" class="loading">
      <div class="">
        <nuxt-img src="/svg/logo.svg" class="w-24 md:w-28" />
        <p>Loading...</p>
      </div>
    </div>
    <v-app v-else @scroll="scrollFunction">
      <div>
        <Header @toggleMenu="drawer = !drawer" />
        <section toggleable="lg" type="dark" class="sub-header d-flex align-center">
          <v-container>
            <nav class="d-flex justify-start justify-md-space-between mx-auto">
              <v-menu
                offset-y
                content-class="services-menu"
                open-on-hover
                :close-on-content-click="false"
                min-width="300"
              >
                <template v-slot:activator="{ props }">
                  <button
                    class="sub-header__title d-flex align-center ml-3"
                    color="primary"
                    dark
                    v-bind="props"
                  >
                    Book Consultation
                    <iconify-icon
                      icon="mingcute:down-line"
                      rotate="270deg"
                    ></iconify-icon>
                  </button>
                </template>
                <v-list class="sub-header__list">
                  <v-list-item
                    v-for="item in consultationServices"
                    :key="item.id"
                    :class="item.subservices && item.subservices.length > 0 ? 'px-0' : ''"
                  >
                    <v-list-item-title
                      @click="$router.push(`/book-consultation/${useGetSlug(item.text)}`)"
                    >
                      {{ item.text }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
                <div class="bg-white pt-5"></div>
              </v-menu>
              <nuxt-link
                v-for="item in premiumServices"
                :key="item.title"
                :to="`/services/${item.slug}`"
                class="sub-header__title ml-3"
              >
                {{ item.title }}
              </nuxt-link>
            </nav>
          </v-container>
        </section>
      </div>

      <section class="main-content">
      <!-- Main content -->
        <slot />
      </section>

      <section id="footer" class="footer mt-10">
        <v-container>
          <nuxt-link to="/" class="logo">
            <nuxt-img src="/svg/logo.svg" width="140px" />
          </nuxt-link>
          <v-row class="mt-4" no-gutters align="start">
            <v-col cols="12">
              <v-row class="mt-4 mt-md-0">
                <v-col cols="6" md="4">
                  <h3>Company</h3>
                  <div v-for="item in footerSect1" :key="item.name" class="footer__list">
                    <nuxt-link :to="item.route">{{ item.name }}</nuxt-link>
                  </div>
                  <div class="footer__list">
                    <a @click="toggleManageCookies">Manage Cookie Preferences </a>
                  </div>
                </v-col>
                <v-col cols="6" md="4">
                  <h3>Our Services</h3>
                  <div v-for="item in footerSect2" :key="item.name" class="footer__list">
                    <nuxt-link :to="item.route">{{ item.name }}</nuxt-link>
                  </div>
                  <div class="footer__list footer__list--var">
                    <a
                      href="https://drive.google.com/file/d/1kTCTPMcyIfAq-EZ5YZYKoGHBDCf6UHQ6/view"
                      target="_blank"
                    >
                      Booking Journey Guide
                    </a>
                  </div>
                </v-col>
                <v-col cols="12" md="4">
                  <h3>Third Party Services</h3>
                  <div
                    v-for="item in thirdPartyServices"
                    :key="item.name"
                    class="footer__list"
                  >
                    <nuxt-link :to="item.route">{{ item.name }}</nuxt-link>
                  </div>
                  <div
                    class="footer__actions mb-8 mt-5 mb-md-0 mt-md-8 d-flex d-sm-block flex-column justify-center align-center ml-auto"
                  >
                    <h4>Subscribe to our Newsletter</h4>
                    <!-- <p>Subscribe to get information about our services and events</p> -->
                    <div class="newsletter mt-3">
                      <v-form
                        ref="newsletterForm"
                        lazy-validation
                        class="d-flex align-center"
                        @submit.prevent="subscribeNewsletter"
                      >
                        <input
                          v-model="newsletterForm.email"
                          type="text"
                          placeholder="Enter Email"
                        />
                        <v-btn type="submit" class="submit"> Subscribe </v-btn>
                      </v-form>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider class="line mt-8 mb-4"></v-divider>
          <div class="partners d-flex align-center justify-center">
            <nuxt-img
              v-for="item in partners"
              :key="item.name"
              :src="item.src"
              class="partners__img mx-2"
            ></nuxt-img>
          </div>
          <v-divider class="line my-4"></v-divider>
          <div class="footer__list d-flex align-center justify-center my-6">
            <div v-for="(item, index) in resources" :key="item.name">
              <nuxt-link :to="item.route" class="mx-2">{{ item.name }}</nuxt-link>
              <span v-if="index < resources.length - 1">|</span>
            </div>
          </div>
          <div class="text-center">
            Copyright &copy; {{ new Date().getFullYear() }} Loiz Tours and Travels
            Limited. All rights reserved.
          </div>
        </v-container>
      </section>

      <button
        v-if="showScrollToTop"
        class="scroll-to-top d-flex align-center"
        @click="scrollToTop"
      >
        <iconify-icon icon="bi:arrow-up"></iconify-icon>
      </button>
    </v-app>
  </div>
</template>

<style scoped lang="scss">
.loading {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    text-align: center;
  }
}

.action {
  &__btn {
    padding: 7px 24px;
    border-radius: 10px;
    border: 1px solid $loiz-pink;
    font-size: 0.9rem;
    color: $loiz-pink;

    &--register {
      padding: 8px 24px;
      background-image: linear-gradient(to right, $loiz-sky-blue, $loiz-pink);
      border: none;
      color: #fff;
    }
  }
}

.drawer {
  min-height: 100vh !important;
  z-index: 9;

  & .v-list {
    padding: 8% 3%;

    & .v-list-item__title {
      font-size: 1rem;
    }
  }

  & .v-expansion-panels {
    border: 1px solid #55555510;
  }
}

.sub-header {
  background: $funsha-pink;
  backdrop-filter: blur(15px);
  color: white;
  min-height: 60px;
  position: fixed;
  top: 90px;
  width: 100%;
  z-index: 2;

  & .container {
    width: 100%;
    overflow-x: auto;
  }

  & nav {
    min-width: 100%;
  }

  &__title {
    font-size: 1rem;
    color: white;
    text-decoration: none;
    transition: 0.2s;

    &:hover {
      color: $loiz-pink-light !important;
      transition: 0.2s;
    }

    & img {
      width: 18px;
    }
  }

  &__list {
    height: 310px;
    overflow-y: scroll;

    & .v-list-item {
      & button {
        width: 100%;
        transition: 0.2s;

        &:hover {
          color: $loiz-pink !important;
          transition: 0.2s;
        }

        & .v-icon {
          color: #555555;
          font-size: 18px;
        }
      }
    }
  }
}

.v-list-item {
  width: 100%;
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #ccc;
    transition: 0.3s;
  }
}
.booking-guide {
  color: $normal-text !important;
}

.services-menu {
  & img {
    width: 50px;
  }

  .v-expansion-panel-content__wrap {
    padding: 0;
  }
}

.nested-menu {
  & button {
    padding: 0 16px;
  }
}

.main-content {
  margin-top: 150px;
}

.footer {
  width: 100%;
  background-color: white;
  padding: 2% 0;
  color: $normal-text;

  & h3 {
    font-weight: bold;
  }

  & a {
    color: $normal-text;
    text-decoration: none;
    transition: 0.2s;
    font-size: 0.88rem;
    word-break: break-word;
    word-wrap: break-word;

    &:hover {
      color: $loiz-pink;
      transition: 0.2s;
    }
  }

  &__list {
    margin: 10px 0;

    &--var {
      font-weight: 900;
      color: transparent;
      background: linear-gradient(90deg, #13abcf 0%, #eb0c8f 100.01%);
      background-clip: text;
      width: max-content;

      & a {
        color: transparent;
      }
    }
  }

  & h4 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  & p {
    font-size: 14px;
  }

  & .icon {
    padding: 10px;
    font-size: 16px;
    background-color: $loiz-sky-blue;
    border-radius: 999px;
  }

  &__actions {
    & .icon {
      padding: 10px;
      background-color: #fff;
      font-size: 24px;
    }
  }

  & .line {
    border-width: 0.1px 0 0 0;
    border-color: #55555540;
    // width: 60%;
    // margin-left: auto;
    // margin-right: auto;
  }
}

.partners {
  &__img {
    width: 70px;
  }
}

.scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 30px;
  background-color: #c40a7750;
  color: #fff;
  padding: 16px;
  border-radius: 8px;
  transition: 0.3s;

  &:hover {
    background-color: $funsha-pink;
    transition: 0.3s;
  }
}

.cookies {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  z-index: 5;

  & h2 {
    text-transform: none;
    font-size: 1.2rem;
    font-weight: bold;
  }

  & p {
    font-size: 0.9rem;
    letter-spacing: 0;
  }

  &__icon {
    font-size: 1.2rem;
  }

  &__btn {
    font-size: 0.9rem;
    letter-spacing: 0;

    &--manage {
      border: 2px solid $loiz-pink;
      color: $loiz-pink !important;
    }
  }

  &--manage {
    & .v-card {
      padding: 5%;
    }
  }
}

.content-preferences {
  border: 0.1px solid #ccc;
  border-radius: 5px;
  padding: 4% 2%;
}

.newsletter {
  & input {
    width: 100%;
    max-width: 250px;
    background-color: #fff;
    padding: 9px 12px;
    border-radius: 6px 0 0 6px;
    border: 0.5px solid #555555;
    border-right: none;
    outline: none;
    font-size: 14px;

    &:focus {
      outline: none;
    }
  }

  & .v-btn {
    border-radius: 0 6px 6px 0 !important;
    height: 40px;
  }
}

@media screen and (max-width: 1264px) {
  .sub-header {
    &__title {
      flex: 0 0 auto;
      font-size: 0.9rem;
    }
  }

  .footer {
    & a {
      font-size: 0.8rem;
    }
  }
}

@media screen and (max-width: 960px) {
  .header {
    z-index: 1;

    &__routes {
      font-size: 14px;
    }
  }

  .sub-header {
    z-index: 1;
  }
}

@media screen and (max-width: 700px) {
  .header {
    &__routes {
      display: none;
    }
  }
}

@media screen and (max-width: 600px) {
  .sub-header {
    &__title {
      font-size: 0.85rem;

      &:last-child {
        padding-right: 12px;
      }
    }
  }

  .partners {
    &__img {
      width: 30px;
    }
  }

  .cookies {
    &__btn {
      font-size: 0.75rem;
    }
  }

  .footer {
    &__actions {
      margin: 8% 0;
    }
  }
}
</style>
