<script setup>
const props = defineProps({
  message: {
    type: Object,
    default: () => {},
  }
});
const emit = defineEmits(["close", "submit"]);
const modal = ref(true);
</script>

<template>
  <v-dialog persistent v-model="modal" width="85%" max-width="400px">
    <v-card
      class="register-success d-flex flex-column align-center justify-center text-center pa-6"
    >
      <iconify-icon
        icon="material-symbols:cancel-outline-rounded"
        class="cancel"
        @click="emit('close')"
      ></iconify-icon>
      <iconify-icon icon="clarity:bubble-exclamation" class="icon mt-3"></iconify-icon>
      <h3 class="py-2">{{ message.title }}</h3>
      <p
        v-if="message.info"
        class="success-info d-flex align-center justify-space-between my-2 py-5 px-5 mx-n12 w-full"
      >
        <span>{{ message.info }}</span>
        <!-- <v-icon class="ml-3" @click="useCopyText(message.info)">mdi-content-copy</v-icon> -->
      </p>
      <p class="py-4">
        {{ message.text }}
      </p>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.register-success {
  position: relative;
  .cancel {
    position: absolute;
    top: 5%;
    right: 5%;
    font-size: 24px;
  }
  .icon {
    font-size: 60px;
    color: gray;
  }
  p {
    font-size: 0.85rem;
  }
  a {
    color: $loiz-pink;
    font-size: 0.85rem;
  }
  .resend-email {
    color: $loiz-pink;
    font-weight: 600;
    cursor: pointer;
  }
  .success-info {
    width: 100%;
    background-color: lightblue;
    color: #000;
    font-weight: 500;
    border-radius: 6px;
  }
}
</style>
