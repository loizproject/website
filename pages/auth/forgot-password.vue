<template>
  <section>
    <div class="signin mx-auto">
      <h3>Forgot Password?</h3>
      <p>
        Enter your email address below, and we'll send you a link to reset your password.
      </p>
      <v-form ref="htmlForm" class="mt-8" @submit.prevent="sendResetLink">
        <v-text-field
          v-model="form.email"
          variant="outlined"
          clearable
          :rules="[rules.required, rules.email]"
          label="Enter Email"
        ></v-text-field>
        <div class="d-flex align-center justify-center my-6">
          <v-btn
            type="submit"
            class="submit"
            :disabled="submitting"
            :loading="submitting"
          >
            Proceed
          </v-btn>
        </div>
      </v-form>
    </div>
  </section>
</template>

<script setup>
import { useStore } from "~/store";

const store = useStore();

const form = ref({});
const htmlForm = ref(null);
const showPassword = ref(false);
const submitting = ref(false);

const rules = useFormRules;

async function sendResetLink() {
  const { valid } = await htmlForm.value.validate();
  if (valid) {
    const data = form.value;
    submitting.value = true;
    try {
      await useAxiosPost("/forgot-password", data);
      store.setToast("We have emailed your password reset link!");
      submitting.value = false;
    } catch (error) {
      submitting.value = false;
      useErrorHandler(error);
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
  p {
    font-size: 1rem;
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
