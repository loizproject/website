<script setup>
import {ref, defineProps, defineEmits, onMounted} from "vue";
import {useRouter} from "vue-router";
import {computed} from "vue";
import {useBasketStore} from "~/store/basket";
import {ulid} from "ulid";
import {useStore} from "~/store";
import {useContentStore} from "~/store/content";
import {useConsultationStore} from "~/store/consultation";

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
  const utcString = `${utcYear}-${pad(utcMonth)}-${pad(utcDay)}T${pad(
      utcHours
  )}:${pad(utcMinutes)}:${pad(utcSeconds)}Z`;
  dateTimeObject.utcDateTime = utcString;
  return utcString;
};

const consultationStore = useConsultationStore();
const basketStore = useBasketStore();
const router = useRouter();
const store = useStore();
const contentStore = useContentStore();
const countries = computed(() => contentStore.countries);
const hello = countries.value;
const isNigerian = computed(() => store.location.countryCode === "NG");
const file = ref(null);
const fileUrl = ref(null);
const showConsultationError = ref(false);
const isUploading = ref(false);
const isSubmitting = ref(false);

const showConsultationSchedule = ref(false);
const setDateTime = (args) => {
  formData.value.booked_date = args.date;
  formData.value.booked_date_formatted = args.formattedDate;
  formData.value.booked_time = args.time;
  formData.value.booked_time_formatted = args.formattedTime;
  formData.value.date_time = convertToUTC(formData.value);
  showConsultationSchedule.value = false;
};
const searchTerm = ref("");

const pad = (value) => {
  return value < 10 ? `0${value}` : value;
};

// Form reference
const formHtml = ref(null);

// Form data state
const formData = ref({
  title: "",
  firstName: "",
  middleName: "",
  surname: "",
  email: "",
  phone: "",
  age: "",
  gender: "",
  country_of_residence: "",
  vacationDate: "",
  booked_date: "",
  booked_time: "",
  payment_option: "",
  passport_biodata_page: "",
});

// Add these for phone validation
const phoneValid = ref(true);
const phoneErrorMessage = ref("");

// Function to validate phone number
const validatePhone = (isValid, phoneData) => {
  phoneValid.value = isValid;
  if (!isValid) {
    phoneErrorMessage.value = "Please enter a valid phone number";
  } else {
    phoneErrorMessage.value = "";
  }
};

// Function to check if phone is empty or invalid on submit
const checkPhoneEmpty = () => {
  if (!formData.value.phone || formData.value.phone.trim() === '') {
    phoneValid.value = false;
    phoneErrorMessage.value = "Phone number is required";
    return false;
  }
  // Trigger validation if phone is not empty but potentially invalid
  if (!phoneValid.value) {
    phoneErrorMessage.value = "Please enter a valid phone number";
    return false;
  }
  return true;
};

definePageMeta({
  middleware: ["auth"],
});

const setSearchterm = () => {
  searchTerm.value = "";
  save();
};

// Form submission
const submitForm = async () => {
  if (isUploading.value) {
    alert("Please wait for passport upload to complete");
    return;
  }

  isSubmitting.value = true;

  try {

    if (!checkPhoneEmpty()) {
      return;
    }

    // Consultation date validation for foreign trips
    if (props.trip.type === 'foreign' && !formData.value.passport_biodata_page) {
      alert("Please upload your passport biodata page");
      return;
    }

    // Add passport validation for foreign trips
    if (props.trip.type === 'foreign' && !formData.value.passport_biodata_page) {
      alert("Please upload your passport biodata page");
      return;
    }

    const emptyFields = Object.entries(formData.value)
        .filter(([key, value]) => {
          if (props.trip.type !== "domestic" && key === "vacationDate") return false;
          if (key === "phone") return false; // Handled separately
          return value === "" || value === null || value === undefined;
        })
        .map(([key]) => key);

    const {country_of_residence, vacationDate, ...customer} = formData.value;
    let price = 0;
    let payment_type = "";

    if (formData.value.payment_option === "Full Payment") {
      price = isNigerian.value ? props.trip?.ngn_price : props.trip?.usd_price;
      payment_type = "onetime";
    } else {
      price = isNigerian.value
          ? props.trip?.installments.ngn.first
          : props.trip?.installments.usd.first;
      payment_type = "installments";
    }

    const request_data =
        props.trip.type === "foreign"
            ? {
              qty: 1,
              price,
              type: "trip",
              attributes: {
                id: ulid(),
                requestDetails: {
                  customer: {
                    ...customer,
                    country_of_residence,
                    location: isNigerian.value ? "Nigeria" : "Other",
                  },
                  trip: {
                    title: props.trip.title,
                    trip_type: "foreign",
                    expected_trip_month: "",
                    payment_type,
                    selected_consultation_date: formData.value.booked_date,
                    selected_consultation_time: formData.value.booked_time,
                    destination: props.trip.destinations[0].country,
                  },
                },
              },
            }
            : {
              qty: 1,
              price,
              type: "trip",
              attributes: {
                id: ulid(),
                requestDetails: {
                  customer: {...customer, country_of_residence},
                  trip: {
                    title: props.trip.title,
                    trip_type: props.trip.type,
                    expected_trip_month: "",
                    payment_type,
                  },
                },
              },
            };
    basketStore.addToBasket(request_data);
    router.push("/basket");
  } catch (error) {
    console.error("Submission error:", error);
    alert("An error occurred during submission");
  } finally {
    isSubmitting.value = false;
  }
};

async function uploadFile(e) {
  if (!e?.target?.files?.[0]) return;

  isUploading.value = true;
  file.value = e.target.files[0];

  try {
    const uploadData = new FormData();
    uploadData.append("file", file.value);

    const {data} = await useAxiosPost("/biodata/upload", uploadData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (data) {
      formData.value.passport_biodata_page = data?.url;

      alert("Passport uploaded successfully!");
    } else {
      alert("File upload failed");
    }
  } catch (error) {
    alert("Error uploading file");
    console.error(error);
  } finally {
    isUploading.value = false;
  }
}

// Props to control modal visibility
const props = defineProps({
  isModalOpen: Boolean,
  trip: Object,
});

// Emit events to parent to close the modal
const emit = defineEmits(["close-modal"]);

// Method to close modal without submitting the form
const closeModal = () => {
  emit("close-modal");
};

onMounted(() => {
  consultationStore.fetchAvailableDates();
});
</script>

<template>
  <div v-if="isModalOpen" class="modal-overlay" @click="closeModal"></div>

  <div v-if="isModalOpen" class="modal modal-content tw-md:w-5/6 tw-w-5/6">
    <div class="tw-rounded-lg tw-max-h-screen">
      <div
          class="tw-bg-[#C40977] tw-text-white tw-p-4 tw-w-full tw-flex tw-justify-between tw-items-center"
      >
        <h4>{{ props.trip.title }}</h4>
        <button>
          <client-only>
            <iconify-icon
                icon="ic:baseline-close"
                class="tw-text-2xl tw-text-white"
                @click="closeModal"
            ></iconify-icon>
          </client-only>
        </button>
      </div>

      <v-form
          ref="formHtml"
          @submit.prevent="submitForm"
          lazy-validation
          class="tw-p-10 tw-overflow-y-auto tw-h-[80vh] md:tw-h-[50vh] tw-w-full"
      >
        <p>Please fill out the form</p>

        <v-row class="tw-grid md:tw-grid-cols-2 tw-grid-cols-1 tw-items-center">
          <!-- Left Column -->
          <v-col>
            <v-text-field
                label="Title"
                v-model="formData.title"
                :rules="[
                (v) => !!v || 'Title is required',
                (v) =>
                  /^[A-Za-z.]+$/.test(v) || 'Title must only contain letters',
              ]"
                required
                variant="outlined"
                maxlength="10"
            ></v-text-field>

            <v-text-field
                label="Surname"
                v-model="formData.surname"
                :rules="[
                (v) => !!v || 'Surname is required',
                (v) =>
                  /^[A-Za-z-]+$/.test(v) || 'Surname must only contain letters',
              ]"
                required
                variant="outlined"
                maxlength="20"
            ></v-text-field>

            <v-text-field
                label="First Name"
                v-model="formData.firstName"
                :rules="[
                (v) => !!v || 'Firstname is required',
                (v) =>
                  /^[A-Za-z]+$/.test(v) ||
                  'Firstname must only contain letters',
              ]"
                required
                variant="outlined"
                maxlength="20"
            ></v-text-field>

            <v-text-field
                label="Middle Name"
                v-model="formData.middleName"
                :rules="[
                (v) => !!v || 'Middlename is required',
                (v) =>
                  /^[A-Za-z]+$/.test(v) ||
                  'Middlename must only contain letters',
              ]"
                required
                variant="outlined"
                maxlength="20"
            ></v-text-field>

            <v-text-field
                label="Email Address"
                v-model="formData.email"
                type="email"
                :rules="[
                (v) => !!v || 'Email is required',
                (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
              ]"
                required
                variant="outlined"
            ></v-text-field>

            <v-file-upload
                label="International Data Page"
                accept=".pdf"
                :rules="[
                (v) => !!v || 'Please upload your International Data Page',
              ]"
                required
                variant="outlined"
                @change="uploadFile"
                v-if="props.trip.type === 'foreign'"
            ></v-file-upload>
          </v-col>

          <!-- Right Column -->
          <v-col>
            <v-select
                label="Age"
                v-model="formData.age"
                :items="[
                '0 - 6',
                '7 - 12',
                '13 - 18',
                '19 - 30',
                '31 - 40',
                '41 - 50',
                '51 - 65',
                '65+',
              ]"
                type="number"
                :rules="[(v) => !!v || 'Age is required']"
                required
                variant="outlined"
            ></v-select>

            <div class="tw-w-min-1/5 tw-max-w-auto tw-flex tw-flex-col tw-pb-8">
              <MazPhoneNumberInput
                  label="Phone Number"
                  v-model="formData.phone"
                  class="tw-w-full"
                  default-country-code="NG"
                  variant="outlined"
                  required
                  :error="!phoneValid"
                  :error-message="phoneErrorMessage"
                  @update:valid="validatePhone"
                  :rules="[
                    () => phoneValid.value || phoneErrorMessage.value
                  ]"
              />
              <span v-if="!phoneValid" class="tw-text-red-500 tw-text-xs tw-mt-1">
                {{ phoneErrorMessage }}
              </span>
            </div>

            <v-select
                label="Gender"
                v-model="formData.gender"
                :items="['Male', 'Female', 'Others']"
                :rules="[(v) => !!v || 'Gender is required']"
                required
                variant="outlined"
            ></v-select>

            <v-select
                v-model="formData.country_of_residence"
                :items="hello"
                item-title="name"
                variant="outlined"
                label="Country of Residence"
                :rules="[(v) => !!v || 'Country of residence is required']"
                required
                @update:model-value="setSearchterm"
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
                      required
                  />
                </div>
                <v-divider class="mt-2"></v-divider>
              </template>
            </v-select>

            <div>
              <v-text-field
                  v-if="props.trip.type === 'domestic'"
                  label="Select your Intended Trip Date "
                  v-model="formData.vacationDate"
                  type="date"
                  :rules="[(v) => !!v || 'Date is required']"
                  required
                  variant="outlined"
              >

              </v-text-field>

              <label
                  class="form-entry pa-4 mb-4 d-flex justify-space-between align-center pointer"
                  v-else
                  :class="{ 'error-state': showConsultationError }"
                  @click="showConsultationSchedule = true"
              >
                <span v-if="formData.booked_date_formatted">
                  {{ formData.booked_date_formatted }}
                  <i>({{ formData.booked_time_formatted }})</i>
                </span>
                <span v-else>
                  Select Consultation Date and Time
                  <span v-if="showConsultationError" class="tw-text-red-500 tw-text-xs">
                    * Required
                  </span>
                </span>
              </label>
              <ConsultationSchedule
                  v-if="showConsultationSchedule"
                  @close="showConsultationSchedule = false"
                  @submit="setDateTime"
              />
              <v-dialog
                  v-model="intendedDateModal"
                  width="85%"
                  max-width="500px"
                  variant="outlined"
              >
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
                            variant="outlined"
                            @update:model-value="intendedDateModal = false"
                        ></v-date-picker>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-dialog>
            </div>
          </v-col>
        </v-row>
        <v-row class="tw-grid md:tw-grid-cols-2 tw-grid-cols-1 tw-items-center">
          <v-col>
            <v-select
                label="Payment Option"
                v-model="formData.payment_option"
                :items="['Full Payment', 'Installmental Payment']"
                type="string"
                required
                :rules="[(v) => !!v || 'Payment Option is required']"
                variant="outlined"
                class="fixed-size-select"
            ></v-select>
          </v-col>
          <v-col>
            <v-file-input
                label="Passport Data Page"
                accept=".pdf"
                :rules="formData.value.passport_biodata_page ? [] : [
                    (v) => !!v || 'Please upload your passport biodata page',
                    (v) => !v || v.size < 5000000 || 'File size should be less than 5MB',
                    ]"
                :hint="formData.value.passport_biodata_page ? 'Passport uploaded successfully' : ''"
                :persistent-hint="!!formData.value.passport_biodata_page"
                required
                v-if="props.trip.type === 'foreign'"
                @change="uploadFile"
                v-model="file"
                variant="outlined"
                show-size
                class="fixed-size-file-input"
            ></v-file-input>
          </v-col>
        </v-row>

        <!-- Form actions -->
        <v-row class="d-flex justify-end">
          <v-btn
              class="submit"
              type="submit"
              :disabled="isUploading || isSubmitting"
              :loading="isSubmitting"
          >
            <span v-if="isUploading">Uploading Passport...</span>
            <span v-else-if="isSubmitting">Processing...</span>
            <span v-else>Submit</span>

            <client-only>
              <iconify-icon
                  v-if="!isUploading && !isSubmitting"
                  icon="teenyicons:arrow-right-solid"
                  class="tw-text-xl tw-text-white tw-ml-2"
              ></iconify-icon>
            </client-only>
          </v-btn>
        </v-row>
      </v-form>

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
    </div>
  </div>
</template>

<style scoped lang="scss">
/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.v-select {
  border: none;
  outline: none;
}

.modal-content {
  overflow-y: auto;
  flex-grow: 1;
}

.form-entry {
  border: 0.5px solid;
  border-radius: 6px;

  p {
    margin-bottom: 0;
    font-size: 1rem;
  }
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 8px;
  z-index: 20;
  max-height: 90vh;
  max-width: auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.m-phone-number-input {
  width: 100%;
}

.v-text-field {
  outline: none;
  border: none;
}

.maz-border {
  border-width: 40px !important;
}

.fixed-size-select,
.fixed-size-file-input {
  width: 100%;
}

.error-state {
  border-color: #ff5252 !important;
  color: #ff5252;
}

/* Mobile responsiveness for phone number input */
@media screen and (max-width: 600px) {
  .v-form {
    :deep(.m-phone-number-input) {
      width: 100%;
      display: flex;
      align-items: center;
      border: 1px solid rgba(0, 0, 0, 0.38);
      border-radius: 4px;
      font-size: 14px;

      &:hover {
        border-color: rgba(0, 0, 0, 0.87);
      }

      :deep(.m-phone-number-input__country-selector) {
        min-width: 80px;
        max-width: 80px;
        padding: 0 4px;
        border-right: 1px solid rgba(0, 0, 0, 0.12);

        :deep(.m-phone-number-input__country-selector-button) {
          padding: 0 2px;
        }
      }

      :deep(.m-phone-number-input__input) {
        flex: 1;
        min-width: 0;
        padding: 10px 12px;
        font-size: 14px;
        border: none;
        outline: none;
        background: transparent;
      }
    }
  }
}
</style>