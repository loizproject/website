import { defineStore } from 'pinia';
import consultationMeta from "~/utils/site-content/consultation-services-meta.json"

export const useConsultationStore = defineStore({
  id: 'consultation',
  state: () => ({
    price_usd: 60,
    price_ngn: 30000,
    availableDates: {},
    services: consultationMeta,
  }),
  actions: {
    /**
     * Fetch available dates for consultation
     * and populates the available dates for the consultation when the consultation page is loaded
     * @returns {Promise<void>}
     */
    async fetchAvailableDates() {
      try {
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const date = new Date();
        const month = monthNames[date.getMonth()];
        const nextMonthIndx = date.getMonth() === 11 ? 0 : date.getMonth() + 1; // if December, set to January
        const nextMonth = monthNames[nextMonthIndx];

        const res = await useAxiosFetch(`/consultation/available-dates?month=${month}`);
        const nextMonthRes = month === "December" ? null : await useAxiosFetch(`/consultation/available-dates?month=${nextMonth}`);
        const { available_dates } = res.data.data.schedule;
        const nextMonthAvailableDates = nextMonthRes ? nextMonthRes.data.data.schedule.available_dates : {};
        const result = {
          ...available_dates,
          ...nextMonthAvailableDates
        };
        this.availableDates = result;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
