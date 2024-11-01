<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { useBasketStore } from "~/store/basket";
import { ulid } from "ulid";
const basketStore = useBasketStore()
const router = useRouter();
import { useStore } from "~/store";
import { useContentStore } from "~/store/content";
const store = useStore();
const contentStore = useContentStore();
const countries = computed(() => contentStore.countries);
const hello = countries.value


// const filteredCountries = computed(() => {
//   if (!searchTerm.value) {
//     return countries.value;
//   } else {
//     const result = countries.value.filter((country) => {
//       return country.name.toLowerCase().indexOf(searchTerm.value.toLowerCase()) > -1;
//     });
//     return result;
//   }
// });


// const searchTerm = ref("");
// const setSearchterm = () => {
//   searchTerm.value = "";
//   save();
// };

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
  country: "",
  vacationDate: "",
});

definePageMeta({
  middleware: ["auth"],
});

// Form submission
const submitForm = async () => {
  const { valid } = await formHtml.value.validate(); // Validate form

  const { country, vacationDate, ...customer } = formData.value;

  if (valid) {
    const reqData = {
      qty: 1,
      price: props.trip?.ngnPrice,
      type: "trip",
      attributes: {
        id: ulid(),
        requestDetails: {
          customer,
          country,
          vacationDate,
          trip: {
            id: props.trip.id,
            title: props.trip.title,
          },
        },
      },
    };
    console.log(reqData);

    basketStore.addToBasket(reqData);
    console.log("Item added to cart:", formData.value);
    router.push("/basket");
  }
};

// {
//     "qty": 2,
//     "name": "World Travel Market International Event",
//     "price": 1170,
//     "attributes": {
//         "id": 39,
//         "country": "United Kingdom"
//     }
// }

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
</script>

<template>
  <div v-if="isModalOpen" class="modal-overlay" @click="closeModal"></div>

  <div v-if="isModalOpen" class="modal">
    <div>
      <div class="tw-bg-[#131313] tw-text-white tw-p-4 tw-w-full tw-flex tw-justify-between tw-items-center">
        <h4>Book Abeokuta Bi-monthly Daycation (Every Two Months)</h4>
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
        class="tw-p-10"
      >
        <p>Please fill out the form</p>

        <v-row>
          <!-- Left Column -->
          <v-col cols="12" md="6">
            <v-select
              label="Title"
              v-model="formData.title"
              :items="['Mr', 'Mrs', 'Master', 'Miss', 'Others']"
              :rules="[(v) => !!v || 'Title is required']"
              required
              variant="outlined"
            ></v-select>

            <v-text-field
              label="Middle Name"
              v-model="formData.middleName"
              :rules="[(v) => !!v || 'Middle name is required']"
              required
              variant="outlined"
            ></v-text-field>

            <v-text-field
              label="Age"
              v-model="formData.age"
              type="number"
              :rules="[(v) => !!v || 'Age is required']"
              required
              variant="outlined"
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

            <v-select
            v-model="formData.country"
          :items="hello"
          item-title="name"
          variant="outlined"
          label="Country of Residence"
    
          
            ></v-select>
          </v-col>

          <!-- Right Column -->
          <v-col cols="12" md="6">
            <v-text-field
              label="First Name"
              v-model="formData.firstName"
              :rules="[(v) => !!v || 'First name is required']"
              required
              variant="outlined"
            ></v-text-field>

            <v-text-field
              label="Surname"
              v-model="formData.surname"
              :rules="[(v) => !!v || 'Surname is required']"
              required
              variant="outlined"
            ></v-text-field>

            <div class="tw-w-full tw-max-w-auto tw-flex tw-pb-8">
              <MazPhoneNumberInput
                label="Phone Number"
                v-model="formData.phone"
                class="tw-w-full"
                default-country-code="NG"
                variant="outlined"
              />
            </div>

            <v-select
              label="Gender"
              v-model="formData.gender"
              :items="['Male', 'Female', 'Others']"
              :rules="[(v) => !!v || 'Gender is required']"
              required
              variant="outlined"
            ></v-select>

            <v-text-field
              label="Preferred Date of Vacation"
              v-model="formData.vacationDate"
              type="date"
              :rules="[(v) => !!v || 'Date is required']"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Form actions -->
        <v-row class="d-flex justify-end">
          <v-btn class="submit" type="submit"
            >Submit<client-only>
              <iconify-icon
                icon="teenyicons:arrow-right-solid"
                class="tw-text-xl tw-text-white tw-ml-2"
              ></iconify-icon>
            </client-only>
          </v-btn>
        </v-row>
      </v-form>
    </div>
  </div>
</template>

<style scoped>
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

.v-select  {
  border: none;
  outline: none;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 8px;
  z-index: 20;
  width: 70%;
}

.m-phone-number-input {
  width: 100%;
}
.maz-input__field {
  width: 250px !important; /* Fixed width */
  height: 40px !important; /* Fixed height */
}
.v-text-field {
  outline: none;
  border: none;
}

.maz-border {
  border-width: 40px !important;
}


</style>
