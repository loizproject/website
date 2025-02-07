<script setup>
import { format } from "date-fns";
import { useConsultationStore } from "~/store/consultation";
import { useDisplay } from "vuetify";

const emit = defineEmits(["close", "submit"]);

const consultationStore = useConsultationStore();
const { xl } = useDisplay();
const rules = useFormRules;

const modal = ref(true);

function getTomorrowsDate() {
  // const today = new Date();
  let tomorrow = new Date();
  tomorrow.setDate(new Date().getDate() + 1);
  const formattedDate = format(new Date(tomorrow), "yyyy-MM-dd");
  return tomorrow;
}

// const date = ref(null);
const date = ref(getTomorrowsDate());
const today = new Date();
const time = ref(null);

const availableDates = computed(() => consultationStore.availableDates);
console.log("The available dates for a consultation session", availableDates.value);
const todaysDate = computed(() => {
  return formatDate(today, "yyyy-MM-dd");
});
const tomorrowsDate = computed(() => {
  return getTomorrowsDate();
});
const allowedTimes = computed(() => {
  const selDate = availableDates.value[format(new Date(date.value), "yyyy-MM-dd")] || [];
  const times = selDate || [];
  const filteredTimes = times.filter(
    (time) => !isLessThanNHoursAway(date.value, time, 24)
  );
  const res = filteredTimes.map((time) => ({
    name: formatTime(time),
    value: time,
  }));
  return res;
});
function allowedDates(val) {
  const dates = availableDates.value;
  const today = todaysDate.value;
  const result = [];
  for (const date in dates) {
    const times = dates[date] || [];
    if (times.length !== 0 && date !== today) {
      result.push(date);
    }
  }
  const day = formatDate(val, "yyyy-MM-dd");
  return result.includes(day);
}

function formatDate(date, pattern) {
  if (!date) return null;
  return format(new Date(date), pattern);
}
function isLessThanNHoursAway(date, time, timeDiff) {
  const currentTime = new Date();
  const targetTime = new Date(date);
  const [hours, minutes, seconds] = time.split(":");

  targetTime.setHours(parseInt(hours, 10));
  targetTime.setMinutes(parseInt(minutes, 10));
  targetTime.setSeconds(parseInt(seconds, 10));

  return targetTime.getTime() - currentTime.getTime() <= timeDiff * 60 * 60 * 1000;
}
function formatTime(time24) {
  const timeParts = time24.split(":");
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  // Determine AM or PM
  const period = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  const hours12 = (hours % 12 === 0 ? 12 : hours % 12).toString().padStart(2, "0");
  const minutesPadded = minutes.toString().padStart(2, "0");

  // Construct the formatted time string
  const formattedTime = `${hours12}:${minutesPadded} ${period}`;
  return formattedTime;
}

function setDate(val) {
  time.value = null;
}

function submit() {
  if (time.value) {
    const data = {
      date: formatDate(date.value, "yyyy-MM-dd"),
      formattedDate: formatDate(date.value, "dd-MM-yyyy"),
      time: time.value,
      formattedTime: formatTime(time.value),
    };
    emit("submit", data);
  } else {
    store.setToast("Please select a valid date and time!", { type: "info" });
  }
}

onMounted(() => {
  // Any initialization logic can go here
});
</script>

<template>
  <v-dialog
    v-model="modal"
    persistent
    width="85%"
    :max-width="xl ? '600px' : '450px'"
    content-class="consultation-schedule"
  >
    <v-form ref="form" lazy-validation @submit.prevent="submit">
      <v-card class="calendar pa-8 text-center">
        <v-icon class="calendar__close" @click="emit('close')">mdi-close</v-icon>
        <div class="mt-5 mt-md-0">
          <v-row no-gutters justify="center">
            <v-col cols="12" class="tw-flex tw-justify-center">
              <v-date-picker
                v-model="date"
                :allowed-dates="allowedDates"
                color="#02aace"
                class="mt-4"
                :min="format(tomorrowsDate, 'yyyy-MM-dd')"
                @update:model-value="setDate"
              ></v-date-picker>
            </v-col>
            <v-col cols="12" class="mt-5">
              <label for="timeInput">Select time:</label>
              <v-select
                v-model="time"
                :items="allowedTimes"
                required
                :rules="[rules.required]"
                item-title="name"
                item-value="value"
                outlined
                label="Select consultation time"
                class="mt-4"
              ></v-select>
            </v-col>
          </v-row>
          <div
            v-if="time && isLessThanNHoursAway(date, time, 48)"
            class="info-prompt d-flex align-center mb-6"
          >
            <v-icon class="mr-2">mdi-information-outline</v-icon>
            <p class="text-left mb-0">
              The selected consultation time is less than 48 hrs. Please note that by
              proceeding, you will not be able to reschedule.
            </p>
          </div>
          <div class="d-flex justify-center mt-0">
            <v-btn type="submit" class="submit px-8">Proceed</v-btn>
          </div>
        </div>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<style lang="scss" scoped>
.calendar {
  background-color: #eeeeee;
}

.select-time {
  background-color: #fff;
  border-radius: 12px;
  padding: 5px 10px;
  width: 100%;

  &:focus {
    outline: none;
  }
}

.info-prompt {
  background-color: #e3cd89;
  padding: 16px;
  border-radius: 6px;
  animation-name: show;
  animation-duration: 0.35s;
  animation-iteration-count: 1;
  & p {
    font-size: 14px;
  }
}
</style>
