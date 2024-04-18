<script setup lang="ts">
import { useStore } from "~/store";

const store = useStore();
onMounted(() => {});
</script>

<template>
  <div>
    <div class="tw-animate-show tw-font-medium">
      <v-app>
        <Toast v-if="store.toast" :meta="store.toastMeta" />
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </v-app>
    </div>
  </div>
</template>
