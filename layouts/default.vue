<script setup>
import { useStore } from "~/store";
import { useAuthStore } from "~/store/auth";
import { useContentStore } from "~/store/content";
import { useConsultationStore } from "~/store/consultation";

const store = useStore();
const authStore = useAuthStore();
const contentStore = useContentStore();
const consultationStore = useConsultationStore();

const drawer = ref(false);
const showScrollToTop = ref(false);

const services = computed(() => contentStore.services);
const premiumServices = computed(() => contentStore.premiumServices);
const getServiceById = computed(() => contentStore.getServiceById);
const getSubservicesById = computed(() => contentStore.getSubservicesById);
const consultationServices = computed(() => consultationStore.services);

const user = computed(() => (authStore.user ? authStore.user : {}));

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

onMounted(async () => {
  window.onscroll = () => {
    scrollFunction();
  };
});
</script>

<template>
  <div>
    <v-app @scroll="scrollFunction">
      <div>
        <Header @toggleMenu="drawer = !drawer" />
        <section toggleable="lg" type="dark" class="sub-header d-flex align-center">
          <v-container>
            <nav class="d-flex justify-start justify-md-space-between mx-auto">
              <v-menu
                offset-y
                content-class="services-menu"
                :close-on-content-click="false"
                min-width="300"
                open-on-hover
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
                      @click="router.push(`/book-consultation/${useGetSlug(item.text)}`)"
                    >
                      {{ item.text }}
                    </v-list-item-title>
                  </v-list-item>
                  <!-- <div class="bg-white pt-5"></div> -->
                </v-list>
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
      <Footer />

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

@media screen and (max-width: 1264px) {
  .sub-header {
    &__title {
      flex: 0 0 auto;
      font-size: 0.9rem;
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
}
</style>
