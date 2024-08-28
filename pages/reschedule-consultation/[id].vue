@ -1,145 +0,0 @@
<script setup>
import { useConsultationStore } from "~/store/consultation";

const route = useRoute();
const rules = useFormRules;
const consultationStore = useConsultationStore();

const id = route.params.id;

const form = ref({});
const htmlForm = ref(null);
const message = ref({});
const modal = ref(false);
const submitting = ref(false);
const showConsultationSchedule = ref(false);

function setDateTime(args) {
  form.value.booked_date = args.date;
  form.value.booked_date_formatted = args.formattedDate;
  form.value.booked_time = args.time;
  form.value.booked_time_formatted = args.formattedTime;
  form.value.date_time = convertToUTC(form.value);
  showConsultationSchedule.value = false;
}

function convertToUTC(dateTimeObject) {
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
}

function pad(value) {
  return value < 10 ? `0${value}` : value;
}

async function submit() {
  const { valid } = await htmlForm.value.validate();
  if (valid) {
    submitting.value = true;
    try {
      await useAxiosPut(`/user/consultations/${id}/reschedule`, {
        form: form.value,
      });
      message.value = {
        title: "Consultation Rescheduled Succesfully",
        text:
          "Your consultation session has been rescheduled sucessfully! Redirecting in 5seconds...",
      };
      modal.value = true;
      submitting.value = false;
      setTimeout(() => {
        router.push("/");
      }, 5000);
    } catch (error) {
      submitting.value = false;
      useErrorHandler(error);
    }
  }
}

onMounted(() => {
  consultationStore.fetchAvailableDates();
});

definePageMeta({
  middleware: "auth",
  layout: "services",
});
</script>

<template>
  <section>
    <div class="reschedule mx-auto">
      <h3>Reschedule your consultation</h3>
      <p>Please select the new date and time for your consultation</p>
      <v-form ref="htmlForm" class="mt-8" @submit.prevent="submit">
        <div
          class="form-entry pa-4 mb-4 d-flex justify-space-between align-center pointer"
          @click="showConsultationSchedule = true"
        >
          <label
            v-if="!form.booked_date"
            style="color: rgba(0, 0, 0, 0.6)"
            @click="showConsultationSchedule = true"
          >
            Select new consultation date and time
          </label>
          <p v-else>
            {{ form.booked_date_formatted }} <i>({{ form.booked_time_formatted }})</i>
          </p>
          <v-icon class="ml-2"> mdi-calendar-month </v-icon>
        </div>
        <ConsultationSchedule
          v-if="showConsultationSchedule"
          @close="showConsultationSchedule = false"
          @submit="setDateTime"
        />
        <v-text-field
          v-model="form.reason"
          label="Reason (optional)"
          variant="outlined"
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

<style scoped lang="scss">
.reschedule {
  width: 60%;
  padding: 5%;
  min-height: 70vh;
  & h3 {
    font-size: 1.6rem;
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
.form-entry {
  border: 0.5px solid $normal-text;
  border-radius: 6px;
  p {
    margin-bottom: 0;
    font-size: 1rem;
  }
}
@media screen and (max-width: 600px) {
  .reschedule {
    width: 85%;
  }
}
</style>
