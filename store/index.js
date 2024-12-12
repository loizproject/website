import { countryCodeToUnicodeFlag } from "maz-ui";
import { defineStore } from "pinia";

export const useStore = defineStore({
  id: "rootStore",
  state: () => ({
    cookies: true,
    likeWatchVideo: false,
    authToken: null,
    toast: false,
    toastMeta: {},
    rate: 900,
    location: {
      countryName: "",
      countryCode: "",
    },
    countries: [],
  }),
  actions: {
    // former vuex mutations
    setCookies(payload) {
      this.cookies = payload;
    },
    setLikeWatchVideo(payload) {
      this.likeWatchVideo = payload;
    },
    setAuthToken(payload) {
      this.authToken = `Bearer ${payload}`;
    },
    setRate(payload) {
      this.rate = payload;
    },
    setCountries(payload) {
      this.countries = payload;
    },
    // Actions
    setToast(text, payload) {
      this.toastMeta = {
        title: text,
        ...payload,
      };
      this.toast = true;
      setTimeout(
        () => {
          this.toast = false;
        },
        payload && payload.duration ? payload.duration : 5000
      );
    },
    async fetchRates() {
      try {
        const res = await useAxiosFetch("/rates");
        const rate = res.data.data.rates.currencies.NGN;
        this.setRate(rate);
      } catch (error) {
        useErrorHandler(error);
      }
    },
    async fetchLocation() {
      const config = useRuntimeConfig();
      let res = {
        data: {
          success: true,
          message: "Location information fetched successfully",
          data: {
            location: {
              countryName: "Nigeria",
              countryCode: "NG",
            },
          },
        },
      };
      try {
        if (config.public.APP_ENV !== "local") {
          res = await useAxiosFetch("/location");
          const response = await useAxiosFetch("/countries");
          const countries = response.data.data.countries;
          const country = countries.find(
            (country) => country.code === location.countryCode
          );
          this.location.countryName = country.name;
          this.location.countryCode = location.countryCode;
        } else if (config.public.APP_ENV === "local") {
          this.location = res.data.data.location;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
});
