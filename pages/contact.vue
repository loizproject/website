<script setup>
import { useDisplay } from "vuetify";
import { useStore } from "~/store";

const form = ref({});
const formHtml = ref(null);
const submitting = ref(false);
const valid = ref(true);
const phoneResult = ref(null);

const rules = useFormRules;
const { mdAndUp } = useDisplay();
const store = useStore();

const footerContactSect = [
  {
    title: "Email Us",
    icon: "dashicons:email",
    text: "enquiries.support@loiztravels.com",
    url: "mailto:enquiries.support@loiztravels.com?subject=Mail from website!",
  },
  {
    multiple: true,
    icon: "ant-design:phone-filled",
    text: ["+234 704 617 8336", "+234 817 933 2985"],
    url: "",
  },
  {
    title: "Office Address",
    icon: "material-symbols:home-rounded",
    text: "32, Yaya Abatan Street, Ogba, Ikeja. Lagos, Nigeria.",
    url: "https://goo.gl/maps/QJzZY6wfv2mGAToT6",
  },
];

const loizContacts = [
  {
    name: "Twitter",
    icon: "mdi:twitter",
    url: "https://twitter.com/loiztravels",
    color: "#55ACEE",
  },
  {
    name: "LinkedIn",
    icon: "mdi:linkedin",
    url: "https://www.linkedin.com/company/loiz-tours-travels/",
    color: "#0A66C2",
  },
  {
    name: "Instagram",
    icon: "skill-icons:instagram",
    url: "https://www.instagram.com/loiztoursandtravels/",
  },
  {
    name: "Threads",
    icon: "simple-icons:threads",
    url: "https://www.threads.net/@loiztoursandtravels",
    color: "#222",
  },
];

const loizChat = [
  {
    name: "Whatsapp",
    icon: "logos:whatsapp-icon",
    url: "https://api.whatsapp.com/message/IXDNZJC7JRPYD1",
    color: "blue",
  },
  {
    name: "Telegram",
    icon: "simple-icons:telegram",
    url: "https://t.me/Loiztravels",
    color: "#40B3E0",
  },
  {
    name: "Facebook",
    icon: "akar-icons:facebook-fill",
    url: "https://www.facebook.com/people/Loiz-Tours-Travels-Ltd/100093653414058/",
    color: "#1C54D1",
  },
  {
    name: "Pinterest",
    icon: "ri:pinterest-fill",
    url: "https://www.pinterest.co.uk/loiztours/",
    color: "#E60023",
  },
];

const submit = async () => {
  submitting.value = true;
  try {
    const { valid } = await formHtml.value.validate();
    if (valid) {
      if (phoneResult.value.isValid) {
        await useAxiosPost("/contact-us", form.value);
        store.setToast("Message sent successfully", { type: "success" });
        formHtml.value.reset();
        form.value.phone = null;
      } else {
        store.setToast("Please enter a valid phone number", { type: "error" });
      }
    } else {
      store.setToast("Please fill all required fields", { type: "error" });
    }
  } catch (error) {
    useErrorHandler(error);
  } finally {
    submitting.value = false;
  }
};

const meta = {
  title:
    "Contact Us: Loiz Tours & Travels Ltd - Your Gateway to Exhilarating & Seamless Travel Experiences!",
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
  <div class="contact">
    <v-container>
      <v-card class="">
        <v-row align="start" justify="space-between">
          <v-col cols="12" md="5" order="3" order-md="1" class="send-message">
            <h3>Send Us a Message</h3>
            <v-form
              ref="formHtml"
              lazy-validation
              v-model="valid"
              @submit.prevent="submit"
              class="mt-8"
            >
              <v-text-field
                variant="outlined"
                flat
                v-model="form.fName"
                label="First Name"
                :rules="[rules.required, rules.text]"
              ></v-text-field>
              <v-text-field
                variant="outlined"
                flat
                v-model="form.lName"
                label="Last Name"
                :rules="[rules.required, rules.text]"
              ></v-text-field>
              <v-text-field
                type="email"
                variant="outlined"
                flat
                v-model="form.email"
                label="Email"
                :rules="[rules.required, rules.email]"
              ></v-text-field>
              <MazPhoneNumberInput
                v-model="form.phone"
                default-country-code="NG"
                @update="phoneResult = $event"
                class="mb-6 tw-w-full"
              />
              <v-text-field
                type="address"
                variant="outlined"
                flat
                v-model="form.address"
                label="Address"
                :rules="[rules.required]"
              ></v-text-field>
              <v-textarea
                no-resize
                variant="outlined"
                flat
                v-model="form.note"
                label="How can we help?"
                :rules="[rules.required]"
              ></v-textarea>
              <div class="d-flex align-center justify-center my-6">
                <v-btn
                  type="submit"
                  class="submit"
                  :disabled="!valid || submitting"
                  :loading="submitting"
                  >Submit</v-btn
                >
              </div>
            </v-form>
          </v-col>
          <v-divider class="line order-2" :vertical="mdAndUp"></v-divider>
          <v-col cols="12" md="6" order="1" order-md="3">
            <h3>Contact Info</h3>
            <div
              v-for="item in footerContactSect"
              :key="item.title"
              class="contact-info d-flex align-center my-5"
            >
              <div class="icon mr-2 d-flex align-center">
                <iconify-icon :icon="item.icon" class="icon__main"></iconify-icon>
              </div>
              <div class="contact-info__main">
                <div v-if="item.multiple">
                  <a
                    v-for="(element, index) in item.text"
                    :key="index"
                    :href="`tel:${element}`"
                    target="_blank"
                    class="d-block mb-0"
                    >{{ element }}</a
                  >
                </div>
                <a v-else :href="item.url" target="_blank" class="d-block mb-0">{{
                  item.text
                }}</a>
              </div>
            </div>
            <v-row align="start" class="socials mt-10">
              <v-col cols="4" md="3">
                <p class="mt-2">Social Links:</p>
              </v-col>
              <v-col cols="8" md="9">
                <div class="d-flex align-center">
                  <a
                    class="icon bg-white mr-4 d-flex align-center"
                    :style="`color: ${item.color} !important`"
                    v-for="item in loizChat"
                    :key="item.name"
                    :href="item.url"
                    target="_blank"
                  >
                    <iconify-icon :icon="item.icon" class="icon__main"></iconify-icon>
                  </a>
                </div>
                <div class="d-flex align-center">
                  <a
                    class="icon bg-white mr-4 my-2 d-flex align-center"
                    :style="`color: ${item.color} !important`"
                    v-for="item in loizContacts"
                    :key="item.name"
                    :href="item.url"
                    target="_blank"
                  >
                    <iconify-icon :icon="item.icon" class="icon__main"></iconify-icon>
                  </a>
                </div>
              </v-col>
            </v-row>
            <div class="map my-8">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.0859138041715!2d3.339421614563207!3d6.636252223683905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b93e17ecd69db%3A0x6ad7eec6c2bdc805!2s32%20Yaya%20Abatan%20Rd%2C%20Ojodu%20101232%2C%20Lagos!5e0!3m2!1sen!2sng!4v1671018005938!5m2!1sen!2sng"
                height="450"
                style="border: 0; width: 100%"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
              <p class="mt-10">
                <a href="https://goo.gl/maps/KFqFJDBzZ2nxswdEA">
                  <iconify-icon icon="logos:google-maps" class="mr-1"></iconify-icon>
                  <span>View on Google Maps</span>
                </a>
              </p>
            </div>
            <v-divider class="line d-md-none my-5"></v-divider>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
h3 {
  text-transform: uppercase;
}
a {
  text-decoration: none;
  color: #555555;
}
.contact {
  & .v-card {
    box-shadow: 0px 10.2914px 56.6028px rgba(0, 0, 0, 0.14) !important;
    padding: 5%;
    & .submit {
      width: 65%;
      border-radius: 999px;
    }
  }
}
.contact-info {
  & .icon {
    &__main {
      color: #555555;
      font-size: 1.5rem;
    }
  }
}
.socials {
  color: #555555;
  & p {
    font-size: 1.2rem;
  }
  & .icon {
    padding: 16px;
    background-color: #f2f2f2;
    border-radius: 999px;
    &__main {
      font-size: 1.6rem;
    }
  }
}
.map {
  width: 85%;
  & p {
    text-align: center;
  }
  & a {
    & span {
      border-bottom: 0.3px solid #555555;
      margin-bottom: 1px;
    }
  }
}
@media screen and (max-width: 600px) {
  .contact {
    & .v-card {
      padding: 8% 5%;
    }
  }
  .map {
    width: 100%;
  }
  .socials {
    & .icon {
      padding: 10px;
      &__main {
        font-size: 1.3rem;
      }
    }
  }
}
</style>
