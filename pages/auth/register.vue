<script setup>
import { ref } from "vue";
import { useStore } from "~/store";

const store = useStore();
const rules = useFormRules;
const confirmPassword = (v) => v === form.value.password || "Password doesn't match";

const form = ref({});
const phoneResult = ref(null);
const htmlForm = ref(null);
const valid = ref(true);
const showPassword1 = ref(false);
const showPassword2 = ref(false);
const submitting = ref(false);
const modal = ref(false);
const mazPhoneKey = ref(1);

const message = {
  title: "Registered Successfully",
  content: [
    "Thank you for registering on the Loiz e-commerce website.",
    "We have sent a verification email to the address you provided at registration",
    "Check your inbox and follow the instructions in the email to complete the Verification process. If you did not receive the email verification, please check your junk/spam",
  ],
};

function clearForm() {
  htmlForm.value.reset();
  form.value.phone = null;
  mazPhoneKey.value++;
}
function closeSuccessModal() {
  modal.value = false;
  clearForm();
}

async function signup() {
  if (phoneResult.value.isValid) {
    const { valid } = await htmlForm.value.validate();
    if (valid) {
      const data = form.value;
      submitting.value = true;
      try {
        const res = await useAxiosPost("/register", data);
        submitting.value = false;
        modal.value = true;
      } catch (error) {
        submitting.value = false;
        useErrorHandler(error);
      }
    } else {
      store.setToast("Please fill in all fields properly", { type: "info" });
    }
  } else {
    store.setToast("Enter a valid phone number with the correct country code.", {
      icon: "info",
      type: "info",
    });
  }
}

async function resendVerificationMail() {
  try {
    await useAxiosPost("/email/verification-notification", {
      email: form.value.email,
    });
    store.setToast("Verification mail sent succesfully", { type: "success" });
  } catch (error) {
    useErrorHandler(error);
  }
}

async function googleLogin() {
  try {
    const res = await useAxiosFetch("/google/login/redirect");
    const url = res.data;
    window.location.replace(url);
  } catch (error) {
    useErrorHandler(error);
  }
}

async function facebookLogin() {
  try {
    const res = await useAxiosFetch("/facebook/login/redirect");
    const url = res.data;
    window.location.replace(url);
  } catch (error) {
    useErrorHandler(error);
  }
}

const meta = {
  title:
    "Register: Loiz Tours & Travels Ltd - Your Gateway to Exhilarating & Seamless Travel Experiences!",
  description:
    "Whether you're planning your next adventure or seeking assistance with visa services, flights, or tours, trust Loiz Tours & Travels to make your travel experience unforgettable. Join us on our journey as we redefine the standards of excellence in the travel industry. Discover the world with Loiz Tours & Travels – Where Every Journey Begins with Excellence!",
  image:
    "https://res.cloudinary.com/loiztours/image/upload/site-media/img/atikh-bana.png",
  keywords:
    "travel, tours, vacations, domestic tours in nigeria, visa, visa services, 3rd party travel companies, travel companies in nigeria",
};
useSeoMeta({
  title: meta.title,
  ogTitle: meta.title,
  twitterTitle: meta.title,
  description: meta.description,
  ogDescription: meta.description,
  twitterDescription: meta.description,
  ogImage: meta.image,
  twitterImage: meta.image,
  twitterCard: "summary_large_image",
  twitterSite: "@Loiztravels",
  keywords: meta.keywords,
});
</script>

<template>
  <section>
    <div class="signin mx-auto">
      <h3>Register</h3>
      <h4>Please fill in your details below:</h4>
      <v-form
        v-model="valid"
        lazy-validation
        ref="htmlForm"
        class="mt-8"
        @submit.prevent="signup"
      >
        <v-text-field
          v-model="form.first_name"
          :rules="[rules.required, rules.text]"
          label="First Name"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          v-model="form.last_name"
          :rules="[rules.required, rules.text]"
          label="Last Name"
          variant="outlined"
        ></v-text-field>
        <MazPhoneNumberInput
          v-model="form.phone"
          default-country-code="NG"
          :key="mazPhoneKey"
          class="mb-6 tw-w-full"
          @update="phoneResult = $event"
        />
        <v-text-field
          v-model="form.email"
          :rules="[rules.required, rules.email]"
          label="Email"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          v-model="form.password"
          :rules="[rules.required, rules.password]"
          label="Password"
          variant="outlined"
          :append-inner-icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword1 ? 'text' : 'password'"
          @click:append-inner="showPassword1 = !showPassword1"
        ></v-text-field>
        <v-text-field
          v-model="form.password_confirmation"
          :rules="[rules.required, confirmPassword]"
          label="Confirm Password"
          variant="outlined"
          :append-inner-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword2 ? 'text' : 'password'"
          @click:append-inner="showPassword2 = !showPassword2"
        ></v-text-field>
        <div class="d-flex align-center justify-center my-6">
          <v-btn
            type="submit"
            class="submit"
            :disabled="!valid || submitting"
            :loading="submitting"
            >Register</v-btn
          >
        </div>
        <div class="d-flex align-center justify-center">
          <v-divider class="line line--reverse"></v-divider>
          <p class="mb-0 mx-4 tw-w-4/5">Or Sign Up with</p>
          <v-divider class="line"></v-divider>
        </div>
        <div class="sign-in-options d-flex align-center justify-center my-5">
          <v-btn class="d-flex align-center" @click="googleLogin">
            <client-only>
              <iconify-icon
                icon="flat-color-icons:google"
                class="icon mr-2"
              ></iconify-icon>
            </client-only>
            Google
          </v-btn>
          <!-- <v-btn class="d-flex align-center" @click="facebookLogin">
            <iconify-icon icon="logos:facebook" class="icon mr-2"></iconify-icon>
            Facebook
          </v-btn> -->
        </div>
        <div class="footer text-center">
          By signing up, you agree to Loiz Tours and Travels
          <nuxt-link to="/">Terms & Conditions</nuxt-link> and
          <nuxt-link to="/">Privacy Policy</nuxt-link>.
        </div>
      </v-form>
    </div>
    <SuccessModal
      v-if="modal"
      @close="closeSuccessModal"
      :message="message"
      resendMail
      @resendEvent="resendVerificationMail"
    />
  </section>
</template>

<style scoped lang="scss">
.signin {
  width: 52%;
  padding: 2% 5%;
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
  width: 40%;
  letter-spacing: 0;
}
.line {
  background-image: linear-gradient(269.97deg, #ffffff 4.18%, #00000080 77.28%);
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
    font-size: 1rem;
    min-width: 180px;
    height: auto;
    padding: 8px;
    box-shadow: none;
    border: 1px solid #55555570;
    // border: 1px solid $normal-text;
    background-color: #ffffff;
    color: $normal-text !important;
    & .icon {
      font-size: 1.6rem;
    }
  }
}
.footer {
  font-size: 0.85rem;
  & a {
    color: #13abd3;
    text-decoration: none;
    font-size: 0.85rem;
    border-bottom: 0.1px solid #13abd3;
  }
}
@media screen and (max-width: 600px) {
  .signin {
    width: 85%;
  }
}
</style>
