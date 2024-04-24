<script setup>
import { useDisplay } from "vuetify";
import { useContentStore } from "~/store/content";

const contentStore = useContentStore();
const { mdAndUp } = useDisplay();
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const items = computed(() => contentStore.siteMapItems);
const activeItem = computed(() => {
  let currentRoute = route.fullPath;
  if (currentRoute.endsWith("/")) {
    currentRoute = currentRoute.slice(0, -1); // Remove the last character
  }
  const res = items.value.find((item) => item.route === currentRoute);
  return res;
});
</script>

<template>
  <div id="site-map" class="site-map d-flex mt-12">
    <aside v-if="mdAndUp">
      <v-container>
        <div
          v-for="n in items"
          :key="n.name"
          class="pointer py-2 my-1"
          :class="{ 'active-nav': route.path === n.route }"
          @click="router.push(n.route)"
        >
          {{ n.name }}
        </div>
      </v-container>
    </aside>
    <main>
      <v-container v-if="route.fullPath === '/site-map'">
        <v-img
          loading
          :src="`${config.public.MEDIA_ASSETS_URL}/${activeItem.imgUrl}`"
          class="img mx-auto"
        ></v-img>
      </v-container>
      <NuxtPage></NuxtPage>
    </main>
  </div>
</template>

<style scoped lang="scss">
.site-map {
  position: relative;
  min-height: 50vh;

  & aside {
    width: 20%;
    height: 100%;

    .active-nav {
      color: $loiz-pink;
    }
  }

  & main {
    border-left: 0.5px solid $loiz-grey;
    width: 80%;
  }
}
</style>
