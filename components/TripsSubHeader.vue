<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const menuOpen = ref(false);

// Props for the trips data
const props = defineProps({
  trips: {
    type: Array,
    required: true
  },
  currentShowingCards: {
    type: Array,
    required: true
  }
});

const navigateToTrip = (slug) => {
  if (slug) {
    router.push(`/trips/${slug}`);
    menuOpen.value = false;
  };
};
</script>

<template>
  <section
    toggleable="lg"
    type="dark"
    class="sub-header d-flex align-center"
  >
    <v-container>
      <nav class="d-flex justify-start justify-md-space-between mx-auto">
        <v-menu
          v-model="menuOpen"
          offset-y
          content-class="services-menu"
          min-width="300"
        >
          <template v-slot:activator="{ props }">
            <button
              class="sub-header__title d-flex align-center ml-3"
              color="primary"
              dark
              v-bind="props"
            >
              London Trips
              <iconify-icon
                icon="mingcute:down-line"
                rotate="270deg"
                class="tw-pt-[1.5px]"
              ></iconify-icon>
            </button>
          </template>
          <v-list class="sub-header__list">
            <v-list-item
              v-for="item in currentShowingCards"
              :key="item.id"
              class="px-0"
            >
              <v-list-item-title>
                <p
                  class="tw-text-base tw-w-full mb-0"
                  @click="navigateToTrip(item.slug)"
                >
                  {{ item.title || "Untitled Trip" }}
                </p>
              </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="!currentShowingCards.length">
              <v-list-item-title>
                <p class="tw-text-base tw-w-full mb-0">No trips available</p>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </nav>
    </v-container>
  </section>
</template>

<style scoped>
/* Sub-Header Styles */
.sub-header {
  background: $funsha-pink;
  backdrop-filter: blur(15px);
  color: white;
  min-height: 60px;
  position: fixed;
  top: 90px;
  width: 100%;
  z-index: 2;
}

.sub-header .container {
  width: 100%;
  overflow-x: auto;
}

.sub-header nav {
  min-width: 100%;
}

.sub-header__title {
  font-size: 1rem;
  color: white;
  text-decoration: none;
  transition: 0.2s;
}

.sub-header__title:hover {
  color: $loiz-pink-light !important;
  transition: 0.2s;
}

.sub-header__title img {
  width: 18px;
}

.sub-header__list {
  height: 310px;
  overflow-y: scroll;
}

.sub-header__list .v-list-item {
  width: 100%;
  transition: 0.3s;
  cursor: pointer;
}

.sub-header__list .v-list-item:hover {
  background-color: #ccc;
  transition: 0.3s;
}

.sub-header__list .v-list-item button {
  width: 100%;
  transition: 0.2s;
}

.sub-header__list .v-list-item button:hover {
  color: $loiz-pink !important;
  transition: 0.2s;
}

.sub-header__list .v-list-item button .v-icon {
  color: #555555;
  font-size: 18px;
}

.sub-header__list .v-list-item-title {
  padding-left: 16px;
  padding-right: 16px;
}

@media screen and (max-width: 1264px) {
  .sub-header__title {
    flex: 0 0 auto;
    font-size: 0.9rem;
  }
}

@media screen and (max-width: 960px) {
  .sub-header {
    z-index: 1;
  }
}

@media screen and (max-width: 600px) {
  .sub-header__title {
    font-size: 0.85rem;
  }
}
</style>