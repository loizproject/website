<script setup>
import { useAuthStore } from "~/store/auth";
import { useBasketStore } from "~/store/basket";

const authStore = useAuthStore();
const basketStore = useBasketStore();
const route = useRoute();
const router = useRouter();
const rules = useFormRules;

// const { rdr } = route.query;
const rdr = useCookie("loiz_redirect");

const form = ref({});
const formData = ref({
  code: "",
});
const showPassword = ref(false);
const submitting = ref(false);
const otpSent = ref( false );

const getOtp = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    const data = formData.value;
    submitting.value = true;
    try {
       const res = await useAxiosPost("/login", data);
      if ( res.data.twoFAEnabled )
      {
        otpSent.value = true;
      } else
      {
        signIn(res.data.authorization.token);
      }
    } catch (error) {
      useErrorHandler(error);
    } finally {
      submitting.value = false;
    }
  }
};

const signInWith2FA = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    const data = formData.value;
    submitting.value = true;
    try {
      await authStore.loginWith2FA(data);
      await authStore.fetchUser();
      await basketStore.fetchBasket();
      submitting.value = false;
      rdr.value ? router.push(rdr.value) : router.push("/");
      rdr.value = null; // delete redirect path after action has been done
    } catch (error) {
      submitting.value = false;
      useErrorHandler(error);
    }
  }
};

const signIn = async (token) =>
{
  try
  {
      await authStore.login(token);
      await authStore.fetchUser();
      await basketStore.fetchBasket();
      submitting.value = false;
      rdr.value ? router.push(rdr.value) : router.push("/");
      rdr.value = null; // delete redirect path after action has been done
    } catch (error) {
      submitting.value = false;
      useErrorHandler(error);
    }
}

const googleLogin = async () => {
  try {
    const res = await useAxiosFetch("/google/login/redirect");
    const url = res.data;
    window.location.replace(url);
  } catch (error) {
    useErrorHandler(error);
  }
};

const facebookLogin = async () => {
  try {
    const res = await useAxiosFetch("/facebook/login/redirect");
    const url = res.data;
    window.location.replace(url);
  } catch (error) {
    useErrorHandler(error);
  }
};

const meta = {
  title:
    "Sign In: Loiz Tours & Travels Ltd - Your Gateway to Exhilarating & Seamless Travel Experiences!",
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
  <main>
    <section v-if="!otpSent">
      <div class="signin mx-auto">
        <h3>Welcome Back!</h3>
        <h4>Please Login to your account</h4>
        <v-form ref="form" class="mt-8" @submit.prevent="getOtp">
          <v-text-field
            v-model="formData.email"
            :rules="[rules.required, rules.email]"
            label="Enter Email"
            variant="outlined"
            type="email"
          ></v-text-field>
          <v-text-field
            v-model="formData.password"
            :rules="[rules.required]"
            label="Enter Password"
            placeholder="Enter your password"
            variant="outlined"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="showPassword ? 'text' : 'password'"
            @click:append-inner="showPassword = !showPassword"
            class="mt-2"
          ></v-text-field>
          <div class="actions d-flex align-center justify-end">
            <nuxt-link to="/auth/forgot-password" class="actions__link">
              Forgot Password?
            </nuxt-link>
          </div>
          <div class="d-flex align-center justify-center my-6">
            <v-btn
              type="submit"
              class="submit"
              :disabled="submitting"
              :loading="submitting"
            >
              Sign In
            </v-btn>
          </div>
          <div class="d-flex align-center justify-center">
            <v-divider class="line line--reverse"></v-divider>
            <p class="mb-0 mx-4 tw-w-3/4 text-center">Or Sign In with</p>
            <v-divider class="line"></v-divider>
          </div>
          <div
            class="sign-in-options d-flex align-center justify-center text-center my-5"
          >
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
          <p class="no-acct text-center">
            Don't have an account?
            <nuxt-link to="/auth/register" class="actions__link"
              >Create Account</nuxt-link
            >
          </p>
          <div class="footer text-center">
            By signing in, you agree to Loiz Tours and Travels
            <nuxt-link to="/terms">Terms & Conditions</nuxt-link> and
            <nuxt-link to="/privacy-policy">Privacy Policy</nuxt-link>.
          </div>
        </v-form>
      </div>
    </section>
    <section v-else>
      <div class="signin mx-auto text-center">
        <h3 class="tw-text-md">2FA Login</h3>
        <p>An OTP has been emailed to your email. Kindly enter it below.</p>
        <v-form ref="form" class="mt-8" @submit.prevent="signInWith2FA">
          <v-otp-input
            v-model="formData.code"
            :rules="[rules.required]"
            label="Enter OTP"
            variant="outlined"
            type="password"
          ></v-otp-input>
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
          <div class="footer text-center">
            By signing in, you agree to Loiz Tours and Travels
            <nuxt-link to="/">Terms & Conditions</nuxt-link> and
            <nuxt-link to="/">Privacy Policy</nuxt-link>.
          </div>
        </v-form>
      </div>
    </section>
  </main>
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
.no-acct {
  font-size: 16px;
  & a {
    font-size: 16px;
  }
}
@media screen and (max-width: 600px) {
  .signin {
    width: 85%;
  }
}
</style>
