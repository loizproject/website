<script setup>
import DefaultLayout from "~/layouts/default.vue";
import { useStore } from "~/store";
import { useContentStore } from "~/store/content";
import { useDisplay } from "vuetify";

const router = useRouter();
const store = useStore();
const contentStore = useContentStore();
const route = useRoute();
const { xs, sm, mdAndUp } = useDisplay();

const drawer = ref(false);
const services = computed(() => contentStore.services);

const textLimit = computed(() => {
  return xs.value ? 10 : sm.value ? 25 : 40;
});

const paths = computed(() => {
  return route.path.split("/");
});

const isCurrentRoute = (service) => {
  return route.path === `/services/${service.slug}`;
};

const isCurrentSubRoute = (service, subservice) => {
  return route.path === `/services/${service.slug}/${subservice.slug}`;
};

const showHeaderIcon = (index) => {
  if (index === 0) {
    return false;
  } else if (index === paths.value.length - 1) {
    return false;
  } else {
    return true;
  }
};

const getPageRoute = (item, index) => {
  const pageArray = [];
  for (let i = 0; i <= index; i++) {
    const element = paths.value[i];
    pageArray.push(element);
  }
  const pageRoute = pageArray.join("/");
  return pageRoute;
};

const routeToService = (service) => {
  router.push(`/services/${service.slug}`);
};

const routeToSubService = (service, subservice) => {
  router.push(`/services/${service.slug}/${subservice.slug}`);
};
</script>

<template>
  <div>
    <default-layout>
      <div class="header d-flex align-center py-4">
        <v-container class="d-flex align-center">
          <button
            v-if="mdAndUp"
            class="d-flex align-center action__btn"
            @click="router.go(-1)"
          >
            <v-icon color="#e7028e" class="mr-2"> mdi-chevron-left</v-icon>
            Back
          </button>
          <v-spacer></v-spacer>
          <div class="navigation d-flex align-center">
            <nuxt-link to="/">Home</nuxt-link>
            <v-icon color="#555" class="mx-2 mt-1">mdi-chevron-right</v-icon>
            <div v-for="(item, index) in paths" :key="index">
              <nuxt-link
                v-if="item !== 'services'"
                :to="getPageRoute(item, index)"
                :style="index === paths.length - 1 ? 'color: #e7028e' : ''"
                >{{
                  item && item.length > textLimit
                    ? `${_StartCase(_ToLower(item.substring(0, textLimit)))}...`
                    : _StartCase(_ToLower(item))
                }}</nuxt-link
              >
              <v-icon
                v-if="item !== 'services' && showHeaderIcon(index)"
                color="#555"
                class="mx-2"
                >mdi-chevron-right</v-icon
              >
            </div>
          </div>
          <v-spacer></v-spacer>
          <button
            v-if="mdAndUp"
            class="d-flex align-center action__btn"
            @click="router.go(+1)"
          >
            Next
            <v-icon color="#e7028e" class="ml-2"> mdi-chevron-right</v-icon>
          </button>
          <v-btn v-if="!mdAndUp" elevation="0" text rounded @click="drawer = !drawer">
            <iconify-icon
              icon="material-symbols:menu-open-rounded"
              class="services-sidebar--mob"
            ></iconify-icon>
          </v-btn>
        </v-container>
      </div>
      <section class="mainn d-flex">
        <aside v-if="mdAndUp" class="services-sidebar">
          <v-list class="sidebar__list">
            <v-list-item
              v-for="(item, index) in services"
              :key="index"
              :class="item.children ? 'px-0' : ''"
            >
              <v-expansion-panels
                v-if="item.subservices && item.subservices.length > 0"
                flat
                content-class="nested-menu"
              >
                <v-expansion-panel>
                  <v-expansion-panel-title
                    color="#FEF3F9"
                    :style="isCurrentRoute(item) ? 'color: #02aace' : ''"
                    @click="routeToService(item)"
                  >
                    {{ item.title }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text color="#FEF3F9">
                    <v-list>
                      <v-list-item
                        v-for="(element, index) in item.subservices"
                        :key="index"
                        @click="routeToSubService(item, element)"
                      >
                        <v-list-item-title
                          :style="
                            isCurrentSubRoute(item, element) ? 'color: #02aace' : ''
                          "
                        >
                          <iconify-icon
                            icon="material-symbols:arrow-right-rounded"
                          ></iconify-icon>
                          {{ element.title }}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-list-item-title
                v-else
                class="pointer px-6"
                :style="isCurrentRoute(item) ? 'color: #02aace' : ''"
                @click="routeToService(item)"
              >
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </aside>
        <main class="services-main">
          <slot />
          <div class="my-4"></div>
        </main>
      </section>
      <div v-if="drawer && !mdAndUp">
        
        <v-navigation-drawer absolute v-model="drawer" width="80%" class="mobile-services">
          <section class="mainn d-flex">
            <aside class="services-sidebar services-sidebar--mobile">
              <v-container>
                <nuxt-link to="/" class="logo">
                  <nuxt-img src="/svg/logo.svg" width="140px" />
                </nuxt-link>
  
                <h3>Our Services</h3>
                <v-list class="sidebar__list">
                  <v-list-item
                    v-for="(item, index) in services"
                    :key="index"
                    :class="item.children ? 'px-0' : ''"
                  >
                    <v-expansion-panels
                      v-if="item.subservices && item.subservices.length > 0"
                      flat
                      content-class="nested-menu"
                    >
                      <v-expansion-panel>
                        <v-expansion-panel-title
                          color="#FEF3F9"
                          :style="isCurrentRoute(item) ? 'color: #02aace' : ''"
                          @click="routeToService(item)"
                        >
                          {{ item.title }}
                        </v-expansion-panel-title>
                        <v-expansion-panel-text color="#FEF3F9">
                          <v-list>
                            <v-list-item
                              v-for="(element, index) in item.subservices"
                              :key="index"
                              @click="routeToSubService(item, element)"
                            >
                              <v-list-item-title
                                :style="
                                  isCurrentSubRoute(item, element) ? 'color: #02aace' : ''
                                "
                              >
                                <iconify-icon
                                  icon="material-symbols:arrow-right-rounded"
                                ></iconify-icon>
                                {{ element.title }}
                              </v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                    <v-list-item-title
                      v-else
                      class="pointer"
                      :style="{
                        'color: #02aace':
                          route.path === `/services/${useGetSlug(item.title)}`,
                      }"
                      @click="routeToService(item)"
                    >
                      {{ item.title }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-container>
            </aside>
          </section>
        </v-navigation-drawer>
      </div>
    </default-layout>
  </div>
</template>

<style scoped lang="scss">
.header {
  & a {
    color: #555;
    line-height: normal;
    font-size: 16px;
  }
  & .v-icon {
    font-size: 1rem;
  }
}
.mainn {
  position: relative;
  min-height: 50vh;
  & aside {
    width: 25%;
    background-color: $loiz-pink-light;
  }
  & main {
    width: 75%;
    // height: 100vh;
    // overflow-y: scroll;
  }
}
.services-sidebar {
  border-right: 0.5px solid $loiz-grey;
  &__list {
    background-color: $loiz-pink-light;
  }
  & .v-list {
    background-color: $loiz-pink-light;
  }
  & .v-list-item {
    padding: 0px 4px;
  }
  & .v-expansion-panel-header {
    font-size: 14px;
  }
  & .v-list-item__title {
    font-size: 14px;
  }
}
.action {
  &__btn {
    padding: 7px 16px;
    border-radius: 10px;
    border: 1px solid $loiz-pink;
    font-size: 0.9rem;
    color: $loiz-pink;
  }
}
.mobile-services {
  max-width: 400px;
  z-index: 4;
}
.services-sidebar--mob {
  font-size: 24px;
  color: $loiz-pink;
}

// Media Querries
@media screen and (max-width: 1200px) {
  .services-sidebar {
    & .v-expansion-panel-header {
      font-size: 0.8rem;
    }
    & .v-list-item__title {
      font-size: 0.8rem;
    }
  }
}
@media screen and (max-width: 960px) {
  .mainn aside.services-sidebar {
    width: 100%;
    min-height: 100vh;
  }
  .mainn main {
    width: 100%;
  }
  .header {
    a {
      font-size: 13px;
    }
  }
}
@media screen and (max-width: 600px) {
  .navigation {
    width: 80%;
  }
  .mainn {
    main {
      height: auto;
    }
  }
}
</style>
