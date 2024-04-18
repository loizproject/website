<script setup>
import { useStore } from "~/store";
const store = useStore();
onMounted(() => {
  store.fetchLocation();
});
</script>

<template>
  <div>
    <nuxt-link to="/">home</nuxt-link>
  </div>
</template>
