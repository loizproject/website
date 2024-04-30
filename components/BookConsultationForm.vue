<script setup>
import { useStore } from "~/store";
import { useAuthStore } from "~/store/auth";
import { useBasketStore } from "~/store/basket";
import { useConsultationStore } from "~/store/consultation";
import { useContentStore } from "~/store/content";
import { ulid } from "ulid";

const store = useStore();
const authStore = useAuthStore();
const consultationStore = useConsultationStore();
const basketStore = useBasketStore();
const contentStore = useContentStore();
const rules = useFormRules;
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const countries = computed(() => contentStore.countries);
const price = computed(() => consultationStore.price);
const priceNGN = computed(() => consultationStore.priceNGN);
const availableDates = computed(() => consultationStore.availableDates);
const basket = computed(() => basketStore.basket);
const rate = computed(() => store.rate);
const location = computed(() => store.location.countryName);

const form = ref({
  service: { fields: [] },
  booked_date: null,
  booked_time: null,
});
const formHtml = ref(null);
const modal = ref(false);
const intendedDateModal = ref(false);
const searchTerm = ref("");
const phoneResult = ref(null);
const type = ref(route.params.type);
const user = ref(authStore.user);
const submitting = ref(false);
const saving = ref(false);
const consultationServices = ref(_CloneDeep(consultationStore.services));
const showConsultationSchedule = ref(false);

const subserviceId = computed(() => route.query.subservice_id);
const isNigerian = computed(() => store.location.countryName === "Nigeria");
const filteredCountries = computed(() => {
  if (!searchTerm.value) {
    return countries.value;
  } else {
    const result = countries.value.filter((country) => {
      return country.name.toLowerCase().indexOf(searchTerm.value.toLowerCase()) > -1;
    });
    return result;
  }
});
const disclaimerMsg = computed(() => {
  return {
    title: "Disclaimer!",
    items: [
      `A fee of ${
        isNigerian.value
          ? `₦${useAmtToString(priceNGN.value)}`
          : `$${useAmtToString(price.value)}`
      } will be charged for this consultation session. This fee is non-refundable`,
      "Only Paid fees validate the date and Time for consultation session",
      "Consultation session is a one-off and it is for 45 minutes",
      "You can only re-schedule 72hours to booked consultation date",
      "The company can request a customer to change their booked date and time of a consultation",
    ],
  };
});

const storageKey = computed(() => {
  let res = "";
  try {
    if (form.value.service && form.value.service.id) {
      res = `cnsltn_${user.value.email}_${form.value.service.id}`;
    }
  } catch (error) {}
  return res;
});

const getForm = () => {
  try {
    const res = localStorage.getItem(storageKey.value);
    res ? (form.value = JSON.parse(res)) : null;
  } catch (error) {
    useErrorHandler(error);
  }
};

const fetchAvailableDates = async () => {
  await consultationStore.fetchAvailableDates();
};

const allowedDates = (val) => {
  const currentDate = new Date();
  const targetDateTime = new Date(val);
  return targetDateTime > currentDate;
};

const setService = () => {
  const service = consultationServices.value.filter(
    (item) => _CamelCase(item.text) === _CamelCase(type.value)
  );
  service.length > 0 ? (form.value.service = service[0]) : "";
  form.value.service.id === 5 ? (form.value.countryOfInterest = "Nigeria") : null;
};

const changeService = () => {
  const service = form.value.service;
  router.push(`/book-consultation/${_KebabCase(service.text)}`);
};

const openDisclaimer = async () => {
  clearToast();
  const { valid } = await formHtml.value.validate();
  if (
    valid &&
    form.value.booked_date &&
    form.value.booked_time &&
    phoneResult.value.isValid
  ) {
    modal.value = true;
  } else if (!phoneResult.value.isValid) {
    store.setToast("Please enter a valid phone number.", { icon: "info", type: "info" });
  } else if (!(form.value.booked_date && form.value.booked_time)) {
    store.setToast("Please enter a valid date and time.", { icon: "info", type: "info" });
  } else {
    store.setToast("Please fill all required fields.", { icon: "info", type: "info" });
  }
};

const formatDate = (date) => {
  if (!date) return null;
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

const setDateTime = (args) => {
  form.value.booked_date = args.date;
  form.value.booked_date_formatted = args.formattedDate;
  form.value.booked_time = args.time;
  form.value.booked_time_formatted = args.formattedTime;
  form.value.date_time = convertToUTC(form.value);
  showConsultationSchedule.value = false;
};

const convertToUTC = (dateTimeObject) => {
  const localDate = new Date(
    `${dateTimeObject.booked_date}T${dateTimeObject.booked_time}`
  );
  const utcYear = localDate.getUTCFullYear();
  const utcMonth = localDate.getUTCMonth() + 1;
  const utcDay = localDate.getUTCDate();
  const utcHours = localDate.getUTCHours();
  const utcMinutes = localDate.getUTCMinutes();
  const utcSeconds = localDate.getUTCSeconds();
  const utcString = `${utcYear}-${pad(utcMonth)}-${pad(utcDay)}T${pad(utcHours)}:${pad(
    utcMinutes
  )}:${pad(utcSeconds)}Z`;
  dateTimeObject.utcDateTime = utcString;
  return utcString;
};

const pad = (value) => {
  return value < 10 ? `0${value}` : value;
};

const setMisc = (event) => {
  const str = event.target.value;
  if (str) {
    form.value.misc = str.substring(0, 500);
  }
};

const save = () => {
  saving.value = true;
  localStorage.setItem(storageKey.value, JSON.stringify(form.value));
  saving.value = false;
};

const clearForm = () => {
  const keyToRemove = storageKey.value;
  if (localStorage.getItem(keyToRemove) !== null) {
    localStorage.removeItem(keyToRemove);
  }
};

const clearToast = () => {
  store.toast = false;
};

const bookConsultation = async () => {
  clearToast();
  try {
    form.value.nationality = location;
    const { valid } = await formHtml.value.validate();
    if (valid) {
      if (phoneResult.value.isValid) {
        submitting.value = true;
        const data = {
          price:
            location.value === "Nigeria"
              ? Math.ceil(_CloneDeep(priceNGN.value) / rate.value)
              : _CloneDeep(price.value),
          attributes: {
            id: ulid(),
            consultation: true,
            requestDetails: form.value,
          },
        };
        const res = await basketStore.addToBasket(data);
        submitting.value = false;
        if (res) {
          clearForm();
          basket.value && basket.value.length > 0 ? router.push("/basket") : null;
        }
      } else {
        store.setToast("Please enter a valid phone number.", {
          icon: "info",
          type: "info",
        });
      }
    } else {
      store.setToast("Please fill all required fields.", { type: "info" });
    }
  } catch (error) {
    useErrorHandler(error);
  }
};

onMounted(async () => {
  await setService();
  await getForm();
  await fetchAvailableDates();
});
</script>

<template>
  <div>
    <v-form ref="formHtml" lazy-validation @submit.prevent="openDisclaimer">
      <h2 v-if="form && form.service" class="form-title">{{ form.service.text }}</h2>
      <v-card v-if="form.service && form.service.text">
        <div class=""></div>
        <v-text-field
          v-if="_Includes(form.service.fields, 'title')"
          v-model="form.title"
          variant="outlined"
          label="Title"
          :rules="[rules.required]"
          @change="save"
        ></v-text-field>
        <v-text-field
          v-if="_Includes(form.service.fields, 'first name')"
          v-model="form.fName"
          variant="outlined"
          label="First Name"
          :rules="[rules.required, rules.text]"
          @change="save"
        ></v-text-field>
        <v-text-field
          v-if="_Includes(form.service.fields, 'middle name')"
          v-model="form.mName"
          variant="outlined"
          label="Middle Name"
          @change="save"
        ></v-text-field>
        <v-text-field
          v-if="_Includes(form.service.fields, 'surname')"
          v-model="form.lName"
          variant="outlined"
          label="Surname"
          :rules="[rules.required, rules.text]"
          @change="save"
        ></v-text-field>
        <v-text-field
          v-if="_Includes(form.service.fields, 'email')"
          v-model="form.email"
          variant="outlined"
          label="Email Address"
          type="email"
          :rules="[rules.required, rules.email]"
          @change="save"
        ></v-text-field>
        <MazPhoneNumberInput
          v-if="_Includes(form.service.fields, 'phone')"
          v-model="form.phone"
          default-country-code="NG"
          class="mb-6"
          @update="phoneResult = $event"
          @change="save"
        />
        <v-text-field
          v-if="_Includes(form.service.fields, 'group name')"
          v-model="form.noOfChildren"
          variant="outlined"
          label="Family/Group/Organisation Name"
          :rules="[rules.required]"
          @change="save"
        ></v-text-field>
        <v-text-field
          v-if="_Includes(form.service.fields, 'age')"
          v-model="form.age"
          type="number"
          min="18"
          variant="outlined"
          label="Age"
          :rules="[rules.required, rules.number, rules.age]"
          @change="save"
        ></v-text-field>
        <v-select
          v-if="_Includes(form.service.fields, 'marital status') && subserviceId != 8"
          v-model="form.marital_status"
          :items="['Single', 'Married', 'Divorced', 'Widowed']"
          variant="outlined"
          label="Marital Status"
          :rules="[rules.required, rules.text]"
          @change="save"
        ></v-select>
        <v-text-field
          v-if="_Includes(form.service.fields, 'educational qualification')"
          v-model="form.qualification"
          variant="outlined"
          label="Current Educational Qualification"
          :rules="[rules.required]"
          @change="save"
        ></v-text-field>
        <v-text-field
          v-if="_Includes(form.service.fields, 'course')"
          v-model="form.course"
          variant="outlined"
          label="Course of Study"
          :rules="[rules.required]"
          @change="save"
        ></v-text-field>
        <v-select
          v-if="_Includes(form.service.fields, 'desired educational qualification')"
          v-model="form.categry_of_service"
          :items="['First Degree', 'Masters', 'Diploma', 'Short Courses']"
          variant="outlined"
          label="Desired Educational Status"
          :rules="[rules.required]"
          @change="save"
        ></v-select>
        <v-select
          v-if="_Includes(form.service.fields, 'visa type')"
          v-model="form.visaType"
          :items="[
            'Spouse',
            'Family',
            'Settlement',
            'Medical',
            'Study',
            'Work ',
            'Migrant',
            'Migrant Super Special visa',
          ]"
          variant="outlined"
          label="Visa Type"
          :rules="[rules.required]"
          @change="save"
        ></v-select>
        <v-text-field
          v-if="_Includes(form.service.fields, 'no of dependants')"
          v-model="form.noOfDependants"
          variant="outlined"
          type="number"
          min="1"
          inputmode="numeric"
          label="No of Depenedants"
          :rules="[rules.required]"
          @change="save"
        ></v-text-field>
        <v-select
          v-if="_Includes(form.service.fields, 'holiday package type')"
          v-model="form.visaType"
          :items="['Parent', 'School owner', 'Other']"
          variant="outlined"
          label="Package Type"
          :rules="[rules.required]"
          @change="save"
        ></v-select>
        <v-text-field
          v-if="_Includes(form.service.fields, 'no of children')"
          v-model="form.noOfChildren"
          variant="outlined"
          type="number"
          min="1"
          label="No of children"
          :rules="[rules.required]"
          @change="save"
        ></v-text-field>
        <v-select
          v-if="_Includes(form.service.fields, 'job category')"
          v-model="form.job_category"
          :items="['Skilled Migrant', 'Highly Skilled Migrant']"
          variant="outlined"
          label="Job Category"
          :rules="[rules.required]"
          @change="save"
        ></v-select>
        <v-select
          v-if="_Includes(form.service.fields, 'country')"
          v-model="form.country"
          :items="filteredCountries"
          item-title="name"
          variant="outlined"
          label="Country of Residence"
          @change="
            searchTerm = '';
            save();
          "
          :rules="[rules.required]"
        >
          <template v-slot:prepend-item>
            <div class="d-flex align-center justify-end">
              <v-text-field
                v-model="searchTerm"
                hide-details
                type="text"
                label="Search"
                placeholder="Search"
                variant="outlined"
                class="mx-3 mt-4"
              />
            </div>
            <v-divider class="mt-2"></v-divider>
          </template>
        </v-select>
        <v-select
          v-if="_Includes(form.service.fields, 'country of interest')"
          v-model="form.countryOfInterest"
          :items="filteredCountries"
          item-title="name"
          variant="outlined"
          label="Country of Interest"
          :rules="[rules.required]"
          :disabled="form.service.id === 5"
          @change="
            searchTerm = '';
            save();
          "
        >
          <template v-slot:prepend-item>
            <div class="d-flex align-center justify-end">
              <v-text-field
                v-model="searchTerm"
                hide-details
                type="text"
                label="Search"
                placeholder="Search"
                variant="outlined"
                class="mx-3 mt-4"
              />
            </div>
            <v-divider class="mt-2"></v-divider>
          </template>
        </v-select>
        <div
          v-if="_Includes(form.service.fields, 'travel date')"
          class="form-entry pa-4 mb-4 d-flex justify-space-between align-center pointer"
          @click="intendedDateModal = true"
        >
          <label
            v-if="!form.intended_trip_date"
            style="color: rgba(0, 0, 0, 0.6)"
            @click="intendedDateModal = true"
          >
            Select Intended Date of Trip
          </label>
          <p v-else>
            {{ formatDate(form.intended_trip_date) }}
          </p>
          <v-icon class="ml-2"> mdi-calendar-month </v-icon>
        </div>
        <div
          class="form-entry pa-4 mb-4 d-flex justify-space-between align-center pointer"
          @click="showConsultationSchedule = true"
        >
          <label
            v-if="!form.booked_date"
            style="color: rgba(0, 0, 0, 0.6)"
            @click="showConsultationSchedule = true"
          >
            Select Consultation Date and Time
          </label>
          <p v-else>
            {{ form.booked_date_formatted }} <i>({{ form.booked_time_formatted }})</i>
          </p>
          <v-icon class="ml-2"> mdi-calendar-month </v-icon>
        </div>
        <div v-if="_Includes(form.service.fields, 'misc')">
          <p class="misc">
            If there are specific topics or questions you would like to discuss during the
            consultation, feel free to share them with us in advance, so we can ensure
            that our session is tailored to your needs.
          </p>
          <v-textarea
            v-model="form.misc"
            :rules="[rules.required, rules.miscLength]"
            counter
            variant="outlined"
            rows="6"
            no-resize
            label="Let us know how we can help."
            @keyup="setMisc"
            @change="save"
          ></v-textarea>
        </div>
        <v-checkbox
          v-model="form.agreement"
          :rules="[rules.required]"
          class="terms-cond"
          @change="save"
        >
          <template v-slot:label>
            <span class="mr-1"> I agree to Loiz Tours and Travels </span>
            <a target="_blank" :href="`${config.public.APP_URL}/terms`" @click.stop>
              Terms & Conditions
            </a>
            <span class="mx-1">and</span>
            <a
              target="_blank"
              :href="`${config.public.APP_URL}/privacy-policy`"
              @click.stop
            >
              Privacy Policy
            </a>
          </template>
        </v-checkbox>
        <div class="d-flex align-center justify-center">
          <v-btn
            large
            type="submit"
            class="submit"
            elevation="0"
            :disabled="submitting"
            :loading="submitting"
          >
            Proceed
          </v-btn>
        </div>
      </v-card>
      <DisclaimerModal
        v-if="modal"
        :message="disclaimerMsg"
        :submitting="submitting"
        actionText="Proceed to Checkout"
        @close="modal = false"
        @submit="bookConsultation"
      />
      <ConsultationSchedule
        v-if="showConsultationSchedule"
        @close="showConsultationSchedule = false"
        @submit="setDateTime"
      />
      <v-dialog v-model="intendedDateModal" width="85%" max-width="500px">
        <v-card class="select-date pa-6">
          <v-row no-gutters justify="center">
            <v-col cols="12">
              <h3 class="text-center mt-5">Select date</h3>
              <div class="d-flex justify-center">
                <v-date-picker
                  v-model="form.intended_trip_date"
                  :allowed-dates="allowedDates"
                  color="#02aace"
                  class="mt-4 ma"
                  @update:model-value="intendedDateModal = false"
                ></v-date-picker>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
    </v-form>
  </div>
</template>

<style scoped lang="scss">
.form-title {
  font-size: 24px;
  margin: 16px 0;
}
a.guide-link {
  color: $loiz-pink;
  font-size: 16px;
}
.m-phone-number-input {
  width: 100%;
}

.v-form {
  & .v-card {
    box-shadow: 0px 10px 55px rgba(0, 0, 0, 0.14);
    padding: 4%;
    margin: 0 0 40px;
    border-radius: 12px;

    & .v-text-field--outlined fieldset {
      border-style: solid;
      border-width: 0.3px;
      border-color: $loiz-sky-blue;
    }

    & .v-btn {
      border-radius: 8px;
      letter-spacing: 0;
      min-width: 40%;

      &.save {
        background-image: none;
      }
    }
  }

  .form-entry {
    border: 0.5px solid $loiz-sky-blue;
    border-radius: 6px;

    p {
      margin-bottom: 0;
      font-size: 1rem;
    }
  }

  p.misc {
    font-size: 12px;
    color: #0a5668;
  }
}

.terms-cond {
  & a {
    font-size: 14px;
  }
}
</style>
