import { defineStore } from "pinia";
import { useStore } from "./";
import { useAuthStore } from "./auth";
import { useConsultationStore } from "./consultation";

export const useBasketStore = defineStore({
  id: "basket",
  state: () => ({
    basket: [],
  }),
  getters: {
    getSubTotal(state) {
      const store = useStore();
      const consultationStore = useConsultationStore();

      let total = 0;
      const country = store.location.countryName;

      // Ensure country is valid
      if (!country) {
        console.warn("Country not set in store.location.countryName");
        return total;
      }

      state.basket.forEach((item) => {
        switch (item.type) {
          case "consultation":
            if (country === "Nigeria") {
              total += consultationStore.price_ngn;
            } else {
              total += consultationStore.price_usd;
            }
            break;
          case "trip":
            if (country === "Nigeria") {
              total += item.ngnPrice * item.qty;
            } else {
              total += item.usdPrice * item.qty;
            }
            break;
          default:
            break;
        }
      });

      return total;
    },
  },
  actions: {
    setBasket(payload) {
      this.basket = payload;
    },
    addItemToBasket(payload) {
      this.basket.push(payload);
      store.setToast("Item added to basket", { type: "success" });
    },
    removeItemFromBasket(payload) {
      this.basket = this.basket.filter((item) => item.id !== payload.id);
    },
    async fetchBasket() {
      const authStore = useAuthStore();
      try {
        if (authStore.user) {
          const res = await useAxiosFetch("/basket");
          let { items } = res.data.data.basket;
          if (Array.isArray(items)) {
            this.setBasket(items);
          } else if (typeof items === "object") {
            let result = [];
            for (const key in items) {
              result.push(items[key]);
            }
            this.setBasket(result);
          } else {
            this.setBasket([]);
          }
        }
      } catch (error) {
        useErrorHandler(error);
      }
    },
    async addToBasket(payload) {
      let resp = false;
      let authStore = useAuthStore();
      const store = useStore();
      try {
        if (authStore.user) {
          await useAxiosPost("/basket", payload);
          await this.fetchBasket();
          resp = true;
        } else {
          store.setToast("Please sign in to add item to basket", {
            type: "info",
          });
        }
      } catch (error) {
        useErrorHandler(error);
      } finally {
        return resp;
      }
    },
    async removeFromBasket(payload) {
      let authStore = useAuthStore();
      try {
        if (authStore.user) {
          await useAxiosDel(`/basket/${payload.id}`);
          this.removeItemFromBasket(payload);
        }
      } catch (error) {
        useErrorHandler(error);
      }
    },
    async clearBasket() {
      let authStore = useAuthStore();
      try {
        if (authStore.user) {
          await useAxiosDel("/basket");
          this.basket = [];
        }
      } catch (error) {
        useErrorHandler(error);
      }
    },
  },
});
