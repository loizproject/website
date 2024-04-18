<script setup>
import { useStore } from "~/store";
const store = useStore();
onMounted(() => {
  store.fetchLocation();
  store.fetchRates();
});
</script>

<template>
  <div>
    <nuxt-link to="/abc">Abc</nuxt-link>
  </div>
</template>
