@ -1,145 +0,0 @@
<template>
  <section>
    <div class="signin mx-auto">
      <h3>Reset your password</h3>
      <p>Please fill in the details below</p>
      <v-form ref="htmlForm" class="mt-8" @submit.prevent="submit">
        <v-text-field
          label="Enter Password"
          v-model="form.password"
          variant="outlined"
          :rules="[rules.required, rules.password]"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append-inner="showPassword = !showPassword"
        ></v-text-field>
        <v-text-field
          label="Confirm Password"
          v-model="form.password_confirmation"
          variant="outlined"
          :rules="[rules.required, confirmPassword]"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append-inner="showPassword = !showPassword"
        ></v-text-field>
        <div class="d-flex align-center justify-center my-6">
          <v-btn
            type="submit"
            class="submit"
            :disabled="submitting"
            :loading="submitting"
          >
            Submit
          </v-btn>
        </div>
      </v-form>
    </div>
    <SuccessModal v-if="modal" @close="modal = !modal" :message="message" login />
  </section>
</template>

<script setup>
import { ref } from "vue";
import SuccessModal from "~/components/SuccessModal.vue";

const route = useRoute();

const form = ref({
  token: route.params.token,
  email: route.query.email,
});
const htmlForm = ref(null);
const message = ref({});
const modal = ref(false);
const showPassword = ref(false);
const submitting = ref(false);

const rules = useFormRules;
const confirmPassword = (v) => v === form.value.password || "Password doesn't match";

async function submit() {
  const { valid } = await htmlForm.value.validate();
  if (valid) {
    const data = form.value;
    submitting.value = true;
    try {
      await useAxiosPost(`/reset-password?token=${form.value.token}`, data);
      message.value = {
        title: "Password Reset Succesful",
        text: "Your password has been reset succesfully. Please proceed to sign in.",
      };
      modal.value = true;
    } catch (error) {
      useErrorHandler(error);
    } finally {
      submitting.value = false;
    }
  }
}
</script>

<style scoped lang="scss">
.signin {
  width: 50%;
  padding: 5%;
  min-height: 70vh;
  & h3 {
    font-size: 2rem;
  }
  & h4 {
    font-size: 1.2rem;
  }
}
.actions {
  &__checkbox {
    font-size: 0.9rem;
  }
  &__link {
    color: $loiz-pink;
    font-size: 0.9rem;
    text-decoration: none;
  }
}
.v-btn.submit {
  background-image: linear-gradient(90deg, #ea0390 6.22%, #f178ae 47%, #13abd3 142.14%);
  box-shadow: 0px 8.94967px 11.1871px rgba(0, 0, 0, 0.15);
  width: 40%;
}
.line {
  background-image: linear-gradient(269.97deg, #ffffff 4.18%, #00000020 77.28%);
  width: 30%;
  border: none;
  height: 2px !important;
  max-height: 2px !important;
  &--reverse {
    transform: rotate(180deg);
  }
}
.sign-in-options {
  & .v-btn {
    font-size: 1.6rem;
    min-width: 0;
    height: auto;
    padding: 6px;
    box-shadow: none;
    border: 1px solid #e8b83d;
  }
}
.footer {
  font-size: 0.85rem;
  & a {
    color: #13abd3;
    text-decoration: none;
    border-bottom: 0.1px solid #13abd3;
  }
}
@media screen and (max-width: 600px) {
  .signin {
    width: 85%;
  }
}
</style>
