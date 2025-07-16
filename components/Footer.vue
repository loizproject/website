<script setup>
import {useDisplay} from "vuetify";
import {useStore} from "~/store";
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

const store = useStore();
const {smAndDown} = useDisplay();

const cookies = computed(() => store.cookies);

const manageCookiesModal = ref(false);
const servicesCompKey = ref(1);
const cookieForm = ref({});
const cookieKey = ref(null);
const newsletterForm = ref({});

const subscribeNewsletter = async () => {
  const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  try {
    if (!newsletterForm.value.email) {
      store.setToast("Please enter your email", {type: "error"});
    } else if (!pattern.test(newsletterForm.value.email)) {
      store.setToast("Please enter a valid email", {type: "error"});
    } else {
      await useAxiosPost("/newsletter/subscribe", newsletterForm.value);
      store.setToast("You have succesfully subscribed to our newsletter", {
        type: "success",
      });
      newsletterForm.value = {};
    }
  } catch (error) {
    console.error(error);
  }
};

const checkCookie = async () => {
  let cookie = useGetCookie("loiz_user_preferences");
  if (cookie) {
    try {
      const {name, value} = cookie;
      // Set cookie key, form & modal
      cookieKey.value = name;
      cookieForm.value = JSON.parse(value);
      store.setCookies(true);
    } catch (error) {
      console.error(error);
      store.setCookies(true);
    }
  } else {
    store.setCookies(false);
  }
};

const acceptAllCookies = async () => {
  cookieForm.value.performance = true;
  cookieForm.value.functional = true;
  cookieForm.value.targeting = true;
  try {
    useSetCookie("loiz_user_preferences", JSON.stringify(cookieForm), 42);
    store.setCookies(true);
    manageCookiesModal.value = false;
  } catch (error) {
    console.error(error);
    store.setCookies(true);
    manageCookiesModal.value = false;
  }
};

const rejectAllCookies = async () => {
  cookieForm.value.performance = false;
  cookieForm.value.functional = false;
  cookieForm.value.targeting = false;
  console.log(cookieForm);
  try {
    useSetCookie("loiz_user_preferences", JSON.stringify(cookieForm), 42);
    store.setCookies(true);
    manageCookiesModal.value = false;
  } catch (error) {
    console.error(error);
    store.setCookies(true);
    manageCookiesModal.value = false;
  }
};

const confirmCookieChoice = async () => {
  try {
    useSetCookie("loiz_user_preferences", JSON.stringify(cookieForm), 42);
    store.setCookies(true);
    toggleManageCookies();
  } catch (error) {
    console.error(error);
    store.setCookies(true);
    toggleManageCookies();
  }
};

const toggleManageCookies = () => {
  manageCookiesModal.value = !manageCookiesModal.value;
};

onMounted(() => {
  checkCookie();
});
</script>

<template>
  <section id="footer" class="footer mt-10">
    <v-container>
      <nuxt-link to="/" class="logo">
        <nuxt-img src="/svg/logo.svg" width="140px"/>
      </nuxt-link>
      <v-row class="mt-4" no-gutters align="start">
        <v-col cols="12">
          <v-row class="mt-4 mt-md-0">
            <v-col cols="6" md="4">
              <h3>Company</h3>
              <div v-for="item in footerSect1" :key="item.name" class="footer__list">
                <nuxt-link :to="item.route">{{ item.name }}</nuxt-link>
              </div>

              <div class="footer__actions mb-8 mt-5 mb-md-0 mt-md-8">
                <h4>Subscribe to our Newsletter</h4>
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
                    <v-btn type="submit" class="submit"> Subscribe</v-btn>
                  </v-form>
                </div>
              </div>
            </v-col>

            <v-col cols="6" md="4">
              <h3>Our Services</h3>
              <div v-for="item in footerSect2" :key="item.name" class="footer__list">
                <nuxt-link :to="item.route">{{ item.name }}</nuxt-link>
              </div>
              <div class="footer__list footer__list--var">
                <a
                    href="https://drive.google.com/file/d/1vdQ9dHMe7luKT2Kz24luBnryZVin6-gI/view?usp=sharing"
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

              <div class="mt-8">
                <h3>Compliance</h3>
                <div class="footer__list">
                  <nuxt-link to="/data-privacy">Data Privacy Notice</nuxt-link>
                </div>
                <div class="footer__list">
                  <nuxt-link to="/privacy-policy">Privacy Policy</nuxt-link>
                </div>
                <div class="footer__list">
                  <nuxt-link to="/cookies-policy">Cookies Policy</nuxt-link>
                </div>
                <div class="footer__list">
                  <a @click="toggleManageCookies">Manage Cookie Preferences</a>
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
        Copyright &copy; {{ new Date().getFullYear() }} Loiz Tours and Travels Limited.
        All rights reserved.
      </div>
    </v-container>
    <section class="cookies" v-if="!cookies">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <h2>Cookies and Privacy</h2>
          <iconify-icon
              icon="ant-design:close-circle"
              class="cookies__icon"
              @click="$store.commit('setCookies', true)"
          ></iconify-icon>
        </div>
        <p>
          Your privacy is important to us. We use cookies and similar technologies to help
          personalise content, tailor and measure ads, and to improve your experience on
          our site to provide a better experience. By clicking accept, you agree to this,
          as outlined in our Cookies Policy. You may change your selection by clicking
          "Manage Cookies' at the bottom of the page.
        </p>
        <div class="d-flex align-center">
          <v-btn
              class="cookies__btn"
              elevation="0"
              color="#e7028e"
              @click="acceptAllCookies"
          >Accept All
          </v-btn
          >
          <v-btn
              class="cookies__btn mx-4"
              elevation="0"
              color="#e7028e"
              @click="rejectAllCookies"
          >Reject All
          </v-btn
          >
          <v-btn
              class="cookies__btn cookies__btn--manage"
              elevation="0"
              color="#e7028e"
              variant="text"
              @click="toggleManageCookies"
          >Manage Cookies
          </v-btn
          >
        </div>
      </v-container>
    </section>
    <v-dialog
        v-model="manageCookiesModal"
        content-class="cookies cookies--manage"
        width="80%"
        max-width="550px"
        persistent
    >
      <v-card>
        <div class="d-flex align-center justify-space-between mb-5">
          <h2>Manage Cookies</h2>
          <iconify-icon
              icon="ant-design:close-circle"
              class="cookies__icon"
              @click="toggleManageCookies"
          ></iconify-icon>
        </div>
        <p>
          Because we respect your right to privacy, you can choose not to allow some types
          of cookies. Click on the different category headings to find out more and change
          our default settings. However, blocking some types of cookies may impact your
          experience of the site and the services we are able to offer.
        </p>
        <h2>Manage Content Preferences</h2>
        <div class="content-preferences">
          <div class="d-flex align-center justify-space-between">
            <div class="content-preferences__field">Strictly necessary cookies</div>
            <div class="content-preferences__data">Always Active</div>
          </div>
          <div class="d-flex align-center justify-space-between">
            <div class="content-preferences__field">Performance Cookies</div>
            <div>
              <v-switch
                  v-model="cookieForm.performance"
                  hide-details
                  color="#e7028e"
              ></v-switch>
            </div>
          </div>
          <v-divider class="line mt-n3"></v-divider>
          <div class="d-flex align-center justify-space-between">
            <div class="content-preferences__field">Functional cookies</div>
            <div>
              <v-switch
                  v-model="cookieForm.functional"
                  hide-details
                  color="#e7028e"
              ></v-switch>
            </div>
          </div>
          <v-divider class="line mt-n3"></v-divider>
          <div class="d-flex align-center justify-space-between">
            <div class="content-preferences__field">Targeting cookies</div>
            <div>
              <v-switch
                  v-model="cookieForm.targeting"
                  hide-details
                  color="#e7028e"
              ></v-switch>
            </div>
          </div>
          <v-divider class="line mt-n3"></v-divider>
        </div>
        <div class="d-flex align-center justify-center justify-sm-start mt-5">
          <v-btn
              class="cookies__btn"
              elevation="0"
              color="#e7028e"
              :small="smAndDown"
              @click="acceptAllCookies"
          >Allow All
          </v-btn
          >
          <v-btn
              class="cookies__btn mx-2 mx-md-4"
              elevation="0"
              color="#e7028e"
              :small="smAndDown"
              @click="rejectAllCookies"
          >Reject All
          </v-btn
          >
          <v-btn
              class="cookies__btn"
              elevation="0"
              color="#e7028e"
              :small="smAndDown"
              @click="confirmCookieChoice"
          >Confirm My Choice
          </v-btn
          >
        </div>
      </v-card>
    </v-dialog>
  </section>
</template>

<style lang="scss" scoped>
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

.cookies {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  border-top: 0.4px solid #00000050;
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

@media screen and (max-width: 1260px) {
  .footer {
    & a {
      font-size: 0.8rem;
    }
  }
}

@media screen and (max-width: 600px) {
  .footer {
    &__actions {
      margin: 8% 0;
    }
  }
  .cookies {
    &__btn {
      font-size: 0.75rem;
    }
  }
}
</style>
