<script setup>
import { useStore } from "~/store";
import { useAuthStore } from "~/store/auth";
import { useContentStore } from "~/store/content";
import { useConsultationStore } from "~/store/consultation";
import { useBasketStore } from "~/store/basket";

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
  { name: "Home", route: "/", active: true },
  { name: "Services", route: "#", active: true, service: true },
  { name: "About Us", route: "/about", active: false },
  { name: "Contact Us", route: "/contact", active: false },
  { name: "FAQs", route: "/faqs", active: false },
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
    store.setToast("Logged out succesfully", { type: "success" });
  } catch (error) {
    useErrorHandler(error);
  }
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
        <nuxt-img src="/svg/logo.svg" width="140px" />
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
            @click="router.push(item.route)"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </div>
        <v-list-item class="v-list-item--blank">
          <v-list-item-title>
            <a
              href="https://drive.google.com/file/d/1kTCTPMcyIfAq-EZ5YZYKoGHBDCf6UHQ6/view"
              target="_blank"
              class="booking-guide"
            >
              Booking Guide
            </a>
          </v-list-item-title>
        </v-list-item>
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
        <div v-else class="d-flex align-center mt-6">
          <button
            class="action__btn action__btn--signin mx-3"
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
  width: 80% !important;
  max-width: 350px;
  position: fixed !important;

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

.action {
  &__btn {
    padding: 7px 24px;
    border-radius: 16px;
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
</style>
