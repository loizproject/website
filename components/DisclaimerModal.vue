<script setup>
const props = defineProps({
  message: {
    type: Object,
    default: () => {},
  },
  actionText: {
    type: String,
    default: "Proceed",
  },
  resendMail: {
    type: Boolean,
    default: false,
  },
  login: {
    type: Boolean,
    default: false,
  },
  submitting: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["close", "submit"]);
const modal = ref(true);
</script>

<template>
  <v-dialog
    v-model="modal"
    width="85%"
    persistent
    max-width="400px"
    content-class="disclaimer"
  >
    <v-card class="pa-5 text-center">
      <v-icon class="disclaimer__close" @click="emit('close')">mdi-close</v-icon>
      <v-icon class="disclaimer__icon mx-auto">mdi-information</v-icon>
      <div class="">
        <h2 class="mb-4 mx-auto">Disclaimer!</h2>
      </div>
      <p>
        {{ message.text }}
      </p>
      <ul class="disclaimer__list text-left tw-list-disc pl-5">
        <li v-for="(n, index) in message.items" :key="index">{{ n }}</li>
      </ul>
      <v-btn
        :disabled="submitting"
        :loading="submitting"
        color="primary"
        class="submit mt-5"
        @click="emit('submit')"
      >
        {{ actionText }}
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.disclaimer {
  position: relative;
  &__close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.5rem;
  }
  &__icon {
    font-size: 3rem;
    color: $loiz-pink;
  }
  & p {
    font-size: 1rem;
  }
  &__list {
    li {
      font-size: 0.9rem;
    }
  }
}

@media screen and (max-width: 600px) {
  .disclaimer {
    &__close {
      font-size: 2rem;
    }
  }
}
</style>
