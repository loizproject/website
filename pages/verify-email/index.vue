<script setup>
import SuccessModal from "~/components/SuccessModal.vue";
import { ref } from "vue";
import { useStore } from "~/store";

const store = useStore();
const route = useRoute();

const { url } = route.query;
const message = ref({});
const loading = ref(true);
const error = ref(false);
const modal = ref(false);

async function verifyEmail() {
  try {
    await useAxiosFetch(url);
    message.value = {
      title: "Email Verified",
      text: "Your email has been verified successfully",
    };
    modal.value = true;
    loading.value = false;
  } catch (err) {
    error.value = true;
    loading.value = false;
    useErrorHandler(err);
  }
}

async function retryVerification() {
  try {
    await useAxiosFetch("/retry-verification");
    store.setToast("Verification email sent", {
      icon: "check",
    });
  } catch (error) {
    useErrorHandler(error);
  }
}

onMounted(() => {
  verifyEmail();
});
</script>

<template>
  <section>
    <v-container class="d-flex align-center justify-center">
      <div class="verification text-center mx-auto">
        <div v-if="loading">
          <h3 class="mb-4">Email Verification</h3>
          <p>Please hold on. We are verifying your email...</p>
          <img src="/svg/loading.svg" class="verification__loading mx-auto" />
        </div>
        <div v-if="error">
          <h3 class="mb-4">Oops!</h3>
          <p>Sorry we couldn't verify your email. An error occoured.</p>
          <v-btn class="submit" @click="retryVerification">Retry</v-btn>
        </div>
      </div>
      <SuccessModal v-if="modal" :message="message" login @close="modal = !modal" />
    </v-container>
  </section>
</template>

<style scoped lang="scss">
.verification {
  width: 50%;
  padding: 5%;
  min-height: 70vh;
  & h3 {
    font-size: 1.5rem;
  }
  & h4 {
    font-size: 1.2rem;
  }
  & .v-card {
    padding: 5%;
  }
  &__loading {
    width: 80px;
  }
}
@media screen and (max-width: 600px) {
  .signin {
    width: 85%;
  }
}
</style>
