<script setup>
const props = defineProps(["meta"]);
</script>

<template>
  <div>
    <div
      class="tw-fixed tw-top-0 tw-right-0 tw-max-w-[650px] tw-m-8 tw-z-50 tw-font-yana-header-bold tw-rounded-full"
    >
      <v-alert
        density="compact"
        :variant="meta.variant ? meta.variant : 'flat'"
        :type="meta.type ? meta.type : 'success'"
        :title="meta.title"
        :text="meta.text"
        :icon="meta.icon ? meta.icon : '$success'"
        :color="meta.color"
      ></v-alert>
    </div>
  </div>
</template>
