<script setup>
import {useStore} from "~/store";
import {useAuthStore} from "~/store/auth";
import {useContentStore} from "~/store/content";
import {useConsultationStore} from "~/store/consultation";
import {useBasketStore} from "~/store/basket";

const emit = defineEmits(["closeMenu"]);

const store = useStore();
const authStore = useAuthStore();
const contentStore = useContentStore();
const consultationStore = useConsultationStore();
const basketStore = useBasketStore();

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const drawer = ref(true);
const toggleModal = (val) => {
  emit("closeMenu");
};

const headerRoutes = ref([
  {name: "Home", route: "/", active: true},
  {name: "Services", route: "#", active: true, service: true},
  {name: "About Us", route: "/about", active: false},
  {name: "FAQs", route: "/faqs", active: false},
  {name: "Blog", route: "/blog", active: false},
  {
    name: "Booking Guide",
    route:
        "https://drive.google.com/file/d/1vdQ9dHMe7luKT2Kz24luBnryZVin6-gI/view?usp=sharing",
    active: false,
    target: "_blank",
  },
  {name: "Trips", route: "/trips", active: false},
  {name: "Contact Us", route: "/contact", active: false},
  {name: "Careers", route: "/careers", active: false},
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
const consultationPrice = computed(() => consultationStore.price);
const consultationPriceNGN = computed(() => consultationStore.priceNGN);
const location = computed(() => store.location.countryName);

const isNigerian = computed(() => location.value === "Nigeria");

const basket = computed(() => {
  const bas = basketStore.basket;
  bas.forEach((item) => {
    if (!(item && item.options && item.options.booked_date)) {
      item.parentService =
          item && item.options ? getSubservicesById(item.options.subservice_id) : null;
    }
  });
  return bas;
});

const logout = async () => {
  try {
    await authStore.logout();
    store.setToast("Logged out succesfully", {type: "success"});
  } catch (error) {
    useErrorHandler(error);
  }
};

const routeTo = (link) => {
  link.target === "_blank" ? window.open(link.route, "_blank") : router.push(link.route);
};

const setActiveRoute = (routeName) => {
  headerRoutes.value.forEach((element) => {
    element.name === routeName ? (element.active = true) : (element.active = false);
  });
};
</script>

<template>
  <v-navigation-drawer
      fixed
      v-model="drawer"
      class="drawer"
      @update:model-value="toggleModal"
  >
    <v-list nav dense>
      <nuxt-link to="/" class="logo">
        <nuxt-img src="/svg/logo.svg" width="140px"/>
      </nuxt-link>
      <p v-if="user" class="my-2">
        {{ `Hi ${user.firstName} ${user.lastName}` }}
      </p>
      <v-list-item class="my-10">
        <div v-for="item in headerRoutes" :key="item.name">
          <v-list-item
              v-if="!item.service"
              :class="
              route.path === item.route
                ? 'v-list-item--active pink--text text-primary'
                : 'v-list-item--blank'
            "
              @click="routeTo(item)"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </div>
        <v-list-item
            v-if="config.public.APP_ENV === 'uat'"
            :class="
            route.path === '/beta'
              ? 'v-list-item--active pink--text text--accent-4'
              : 'v-list-item--blank'
          "
            @click="router.push('/beta')"
        >
          <v-list-item-title>Beta</v-list-item-title>
        </v-list-item>
        <v-divider class="line my-10"></v-divider>
        <div v-if="user" class="d-flex align-center">
          <button class="action__btn action__btn--signin mx-3" @click="logout()">
            Logout
          </button>
        </div>
        <div v-else class="d-flex flex-column align-center mt-6">
          <button
              class="action__btn action__btn--signin"
              @click="router.push('/auth/login')"
          >
            Sign In
          </button>
          <button
              class="action__btn action__btn--register"
              @click="router.push('/auth/register')"
          >
            Register
          </button>
        </div>

      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped lang="scss">
.drawer {
  height: 100vh !important;
  position: fixed !important;
  background-color: #fff;
  overflow-y: auto;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.5, 1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 250px;
  max-width: 270px;

  & .v-list {
    padding: 2rem 1rem;

    & .v-list-item__title {
      font-size: 1rem;
    }
  }

  & .v-expansion-panels {
    border: 1px solid #55555510;
  }

  @media (max-width: 768px) {
    width: 60% !important;
    max-width: none;
  }

  @media (max-width: 480px) {
    width: 55% !important;
    max-width: none;
  }
}

.action {
  &__btn {
    width: 100%;
    padding: 10px 0;
    margin-bottom: 12px;
    border-radius: 10px;
    border: 1px solid $loiz-pink;
    font-size: 0.95rem;
    color: $loiz-pink;
    background-color: transparent;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.5, 1);

    &:hover {
      background-color: rgba(255, 192, 203, 0.1);
    }

    &--register {
      background-image: linear-gradient(to right, $loiz-sky-blue, $loiz-pink);
      border: none;
      color: #fff;

      &:hover {
        opacity: 0.9;
      }
    }
  }
}
</style>
