import { defineStore } from "pinia";

export const usePricingStore = defineStore( {
    id: "pricingStore",
    state: () => ({
        rates: [],
        selectedCurrency: "USD"
    }),
    actions: {
        async fetchCurrencyRates() {
            const res = await useAxiosFetch("/api/pricing/rates");
            this.plans = res.data;
        },
        async switchCurrency ()
        {
            
        }
    },
} );