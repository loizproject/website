<script setup>
import { useStore } from "~/store";
import { useAuthStore } from "~/store/auth";
import { useContentStore } from "~/store/content";
import { useConsultationStore } from "~/store/consultation";
import { useBasketStore } from "~/store/basket";

const store = useStore();
const authStore = useAuthStore();
const contentStore = useContentStore();
const consultationStore = useConsultationStore();
const basketStore = useBasketStore();

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const emit = defineEmits(["toggleMenu"]);

const cartMenu = ref(false);
const headerRoutes = ref([
  { name: "Home", route: "/", active: true },
  { name: "Services", route: "#", active: true, service: true },
  {
    name: "Company",
    active: false,
    children: [
      { name: "About Us", route: "/about", active: false },
      { name: "Contact Us", route: "/contact", active: false },
      { name: "Careers", route: "/careers", active: false },
    ],
  },
  {
    name: "Resources",
    route: "",
    active: false,
    children: [
      { name: "Blog", route: "/blog", active: false },
      { name: "FAQs", route: "/faqs", active: false },
    ],
  },
  {
    name: "Booking Guide",
    route:
      "https://drive.google.com/file/d/1vdQ9dHMe7luKT2Kz24luBnryZVin6-gI/view?usp=sharing",
    active: false,
    target: "_blank",
  },
  { name: "Trips", route: "/trips", active: false }

]);
const loggedInUserMenu = ref([
  {
    title: "Logout",
    icon: "mdi-power",
    action: () => {
      logout();
    },
  },
]);

const user = computed(() => authStore.user);

const services = computed(() => contentStore.services);
const consultationServices = computed(() => consultationStore.services);
const consultationPrice = computed(() => consultationStore.price_usd);
const consultationPriceNGN = computed(() => consultationStore.price_ngn);
const location = computed(() => store.location.countryName);

const isNigerian = computed(() => location.value === "Nigeria");

const basket = computed(() => {
  const bas = basketStore.basket;
  bas.forEach((item) => {
    if (!(item && item.options && item.options.booked_date)) {
      item.parentService =
        item && item.options ? contentStore.getSubservicesById(item.options.subservice_id) : null;
    }
  });
  return bas;
});

const logout = async () => {
  try {
    await authStore.logout();
    store.setToast("Logged out succesfully", { type: "success" });
  } catch (error) {
    useErrorHandler(error);
  }
};

function formatCurrency ( currency, amount, locale = 'en-US' )
{
  return new Intl.NumberFormat( locale, { style: 'currency', currency } ).format( amount );
}

const setActiveRoute = (routeName) => {
  headerRoutes.value.forEach((element) => {
    element.name === routeName ? (element.active = true) : (element.active = false);
  });
};
</script>

<template>
  <section class="header header-var">
    <v-container class="d-flex align-center justify-space-between">
      <nuxt-link to="/" class="logo">
        <nuxt-img src="/svg/logo.svg" width="140px" />
      </nuxt-link>

      <div class="d-none d-md-flex align-center mx-auto">
        <div v-for="item in headerRoutes" :key="item.name">
          <div v-if="item.service" class="mx-2 mx-md-3">
            <nav class="d-flex justify-start justify-md-center align-center mx-auto">
              <v-menu
                offset-y
                content-class="services-menu no-scroll"
                open-on-hover
                :close-on-content-click="false"
                transition="slide-y-transition"
                min-width="300"
                max-width="900"
              >
                <template v-slot:activator="{ props }">
                  <button
                    class="header-var__title d-flex align-center"
                    color="primary"
                    dark
                    v-bind="props"
                  >
                    Services
                    <iconify-icon icon="mingcute:down-line"></iconify-icon>
                  </button>
                </template>
                <v-list
                  class="header-var__list d-flex align-center justify-space-around flex-wrap px-5 py-6"
                >
                  <v-row>
                    <v-col cols="4">
                      <nuxt-link
                        to="/consultations"
                        class="sub-header__title d-flex align-center"
                      >
                        Book Consultation
                      </nuxt-link>
                    </v-col>
                    <v-col cols="4" v-for="n in services" :key="n.id">
                      <nuxt-link :to="`/bookings/${n.slug}`">
                        {{ n.title }}
                      </nuxt-link>
                    </v-col>
                  </v-row>
                </v-list>
              </v-menu>
            </nav>
          </div>
          <div v-else-if="item.children" class="mx-2 mx-md-3">
            <nav class="d-flex justify-start justify-md-center align-center mx-auto">
              <v-menu
                offset-y
                content-class="services-menu no-scroll"
                :close-on-content-click="false"
                transition="slide-y-transition"
                min-width="300"
                max-width="900"
              >
                <template v-slot:activator="{ props }">
                  <button
                    class="header-var__title d-flex align-center"
                    color="primary"
                    dark
                    v-bind="props"
                  >
                    {{ item.name }}
                    <iconify-icon icon="mingcute:down-line"></iconify-icon>
                  </button>
                </template>
                <v-list class="header-var__list px-5 py-6">
                  <v-row>
                    <v-col cols="12" v-for="n in item.children" :key="n.id">
                      <nuxt-link :to="n.route" :target="n.target || ''">
                        {{ n.name }}
                      </nuxt-link>
                    </v-col>
                  </v-row>
                </v-list>
              </v-menu>
            </nav>
          </div>
          <nuxt-link
            v-else
            :to="item.route"
            class="header__routes d-block mx-2 mx-md-3"
            :class="route.path === item.route ? 'header__routes--active' : ''"
          >
            <div @click="setActiveRoute(item.name)" class="">
              {{ item.name }}
            </div>
            <hr
              v-if="route.path === item.route"
              class="header__line d-none d-md-block my-0 mx-auto"
            />
          </nuxt-link>
        </div>
        <!-- Beta testing Route Only show in UAT -->
        <nuxt-link
          v-if="config.public.APP_ENV === 'uat'"
          to="/beta"
          class="header__routes d-block mx-2 mx-md-3"
          :class="route.path === '/beta' ? 'header__routes--active' : ''"
        >
          <div class="">Beta</div>
          <hr
            v-if="route.path === '/beta'"
            class="header__line d-none d-md-block my-0 mx-auto"
          />
        </nuxt-link>
      </div>
      <div class="d-none d-md-flex align-center justify-space-between">
        <div v-if="user" class="logged-in d-flex align-center">
          <div class="cart mx-4" @click="router.push('/basket')">
            <div
              class="cart__img__wrapper mr-5"
              @mouseover="cartMenu = true"
              @mouseleave="cartMenu = false"
            >
              <iconify-icon
                icon="streamline:shopping-cart-1"
                class="cart__img"
              ></iconify-icon>
            </div>
            <div v-if="basket.length > 0" class="cart__data">
              {{ basket.length }}
            </div>
            <v-card v-if="cartMenu && basket.length > 0" class="cart__menu pa-4">
              <div v-for="(item, i) in basket" class="my-2" :key="i">
                <div
                  v-if="item.options && item.options.booked_date"
                  class="d-flex items-center justify-space-between"
                >
                  <div>
                    <h4>Consultation Session</h4>
                    <p>
                      <i>{{ item.name ? item.name : item.title }}</i>
                    </p>
                  </div>
                  <p v-if="isNigerian" class="ml-2">
                    {{ formatCurrency('NGN', consultationPriceNGN) }}
                  </p>
                  <p v-else class="ml-2">{{ formatCurrency('USD', consultationPrice, 'en-US') }}</p>
                </div>
                <div v-else class="d-flex items-center justify-space-between">
                  <div>
                    <h4>{{ item.title }}</h4>
                    <p>
                      <i v-if="item.third_party">Third party Service</i>
                      <i v-else>
                        {{ item.parentService ? item.parentService.title : null }}
                      </i>
                    </p>
                  </div>
                </div>
                <p class="ml-2" v-if="isNigerian">{{ formatCurrency('NGN', item.price * item.qty, 'en-NG') }}</p>
                <p class="ml-2" v-else>{{ formatCurrency('USD', item.price * item.qty, 'en-US') }}</p>
                <v-divider></v-divider>
              </div>
            </v-card>
          </div>
          <p class="mb-0">
            {{ `Hi, ${user.firstName} ${user.lastName}` }}
          </p>
          <v-menu min-width="180" offset-y>
            <template v-slot:activator="{ props }">
              <v-btn x-small variant="plain" v-bind="props" class="logged-in__menu px-1">
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list class="tw-min-w-[200px]">
              <v-list-item
                v-for="(item, index) in loggedInUserMenu"
                :key="index"
                @click="item.action"
              >
                <v-list-item-title>
                  <div class="tw-flex tw-items-center">
                    <v-icon class="mr-2">{{ item.icon }}</v-icon>
                    {{ item.title }}
                  </div>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <!-- Right aligned nav items -->
        <div v-else class="d-flex align-center">
          <div class="cart ml-4" @click="router.push('/basket')">
            <div class="cart__img__wrapper mr-5">
              <iconify-icon
                @mouseover="cartMenu = true"
                @mouseleave="cartMenu = false"
                icon="streamline:shopping-cart-1"
                class="cart__img"
              ></iconify-icon>
            </div>
            <div v-if="basket.length > 0" class="cart__data">
              {{ basket.length }}
            </div>
          </div>
          <div class="d-flex align-items-center">
            <button
              class="action__btn action__btn--signin mx-3 mx-md-2 mx-lg-6"
              @click="router.push('/auth/login')"
            >
              Sign In
            </button>
          </div>
          <div class="d-flex align-items-center">
            <button
              class="action__btn action__btn--register"
              @click="router.push('/auth/register')"
            >
              Register
            </button>
          </div>
        </div>
      </div>
      <div class="d-flex d-md-none align-center">
        <div class="cart" @click="router.push('/basket')">
          <div class="cart__img__wrapper">
            <iconify-icon
              @mouseover="cartMenu = true"
              @mouseleave="cartMenu = false"
              icon="streamline:shopping-cart-1"
              class="cart__img"
            ></iconify-icon>
          </div>
          <div v-if="basket.length > 0" class="cart__data">
            {{ basket.length }}
          </div>
        </div>
        <v-btn elevation="0" class="header__btn" @click="emit('toggleMenu')">
          <iconify-icon icon="bx:menu-alt-right" class="header__btn__menu"></iconify-icon>
        </v-btn>
      </div>
    </v-container>
  </section>
</template>

<style scoped lang="scss">
.header {
  position: fixed;
  width: 100%;
  height: 90px;
  z-index: 3;
  top: 0;
  background: #ffffff90;
  backdrop-filter: blur(15px);

  &__routes {
    color: #2a2a2a;
    text-decoration: none;
    font-size: 0.9rem;

    &--active {
      color: $loiz-pink;
    }
  }

  &__line {
    border-bottom: 2px solid $loiz-pink;
    border-radius: 999px;
    width: 35%;
  }

  &__btn {
    width: auto !important;
    min-width: auto !important;
    padding: 0 0 0 16px !important;
    background-color: transparent !important;

    &__menu {
      color: $loiz-pink;
      font-size: 1.5rem;
    }
  }
}

.cart {
  cursor: pointer;
  width: 40px;
  position: relative;

  &__img {
    font-weight: bold;
    font-size: 16px;
    color: #000;

    &__wrapper {
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      border: 1px solid $loiz-pink;
      border-radius: 999px;
    }
  }

  &__data {
    position: absolute;
    top: -10px;
    right: -10px;
    background-color: #e7028e;
    color: #fff;
    font-size: 0.8rem;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 999px;
  }

  &__menu {
    position: fixed;
    top: 70px;
    right: 10%;
    width: 300px;

    & h4 {
      font-size: 14px;
    }

    & p {
      font-size: 14px !important;
      margin-bottom: 2px;
    }

    & .v-divider {
      margin-top: 5px;
      margin-bottom: 5px;
      border-color: #f2f1f1;
    }
  }
}

.logged-in {
  font-size: 16px;

  & p {
    font-size: 1rem;
  }

  &__menu {
    color: #2a2a2a !important;
  }
}

.action {
  &__btn {
    padding: 7px 24px;
    border-radius: 16px;
    border: 1px solid $loiz-pink;
    // border-image: linear-gradient(
    //   to right,
    //   #ffcc00,
    //   #ff66b2
    // ); /* Replace with your desired gradient colors */
    // border-image-slice: 1;
    // border-width: 1px;
    // border-style: solid;
    font-size: 0.9rem;
    color: $loiz-pink;

    &--register {
      padding: 8px 24px;
      // background-color: $loiz-pink;
      background-image: linear-gradient(to right, $loiz-sky-blue, $loiz-pink);
      border: none;
      color: #fff;
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

.services-menu {
  & img {
    width: 50px;
  }
}

.header-var {
  & .container {
    width: 100%;
    overflow-x: auto;
  }

  & nav {
    min-width: 100%;
  }

  &__title {
    font-size: 1rem;
    text-decoration: none;
    transition: 0.2s;

    &:hover {
      color: $loiz-pink !important;
      transition: 0.2s;
    }

    & img {
      width: 18px;
    }
  }

  &__list {
    overflow-y: scroll;

    & a {
      font-size: 14px;
      color: $normal-text;

      &.nuxt-link-active {
        color: $loiz-pink;
      }
    }

    & .v-list-item {
      & button {
        width: 100%;
        transition: 0.2s;

        &:hover {
          color: $loiz-pink !important;
          transition: 0.2s;
        }

        & .v-icon {
          color: #2a2a2a;
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

.services-menu {
  & img {
    width: 50px;
  }
}

.nested-menu {
  & button {
    padding: 0 16px;
  }
}

@media screen and (max-width: 1200px) {
  .action {
    &__btn {
      padding: 7px 18px;
    }
  }
}
</style>
