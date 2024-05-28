import { defineStore } from 'pinia';
import testimonials from "~/utils/site-content/testimonials.json"
import destinations from "~/utils/site-content/destinations.json"
import siteMapItems from "~/utils/site-content/site-map.json"

export const useContentStore = defineStore({
  id: 'content',
  state: () => ({
    countries: [],
    services: [],
    testimonials,
    destinations,
    siteMapItems,
    dontShowPersons: ["solo-trip-tour-holiday-packages", "trip-for-two-holiday-tour-packages"],
    advisoryServices: [
      'Exclusive expert travel advise and assistance',
      'Customer care and assistance by our Visa Facilitation/Renewal team',
      'High quality travel services',
      'Immigration advice for intended destination',
      'Tracking of applications, updates and information regarding application status',
      'Advisory services about documents requirements for particular destination',
      'Referral to immigration lawyers and advisors',
    ],
  }),
  getters: {
    getServiceBySlug: (state) => (slug) => {
      return state.services.find(service => service.slug === slug);
    },
    getServiceById: (state) => (id) => {
      return state.services.find(service => service.id === id);
    },
    getSubservicesBySlug: (state) => (slug, serviceSlug) => {
      const service = state.services.find(service => service.slug === serviceSlug);
      return service?.subservices.find(subservice => subservice.slug === slug) || {};
    },
    getSubservicesById: (state) => (id) => {
      let response = {};
      state.services.forEach(service => {
        const res = service.subservices.find(subservice => subservice.id == id);
        res ? response = res : null
      });
      return response;
    },
    servicesWithChildren: (state) => {
      return state.services.filter(service => service.subservices && service.subservices.length > 0);
    },
    premiumServices: (state) => {
      return state.services.slice(0, 4);
    },
    allTestimonials: (state) => {
      return state.testimonials.flat();
    },
  },
  mutations: {
  },
  actions: {
    // Former vuex mutations
    toggleLikeService(payload) {
      const service = this.services.find(item => item.title === payload);
      if (service) {
        service.like = !service.like;
      }
    },
    toggleDestinationContent(payload) {
      const destination = this.destinations.find(item => item.title === payload.title);
      if (destination) {
        destination.showContent = !destination.showContent;
      }
    },
    setServices(payload) {
      this.services = payload;
    },
    setCountries(payload) {
      this.countries = payload;
    },

    // Actions
    async fetchServices() {
      try {
        const res = await useAxiosFetch("/services");
        const services = res.data.data.services;
        services.sort((a, b) => a.order - b.order);
        services.forEach(service => {
          service.subservices.sort((a, b) => a.order - b.order);
        });
        this.setServices(services);
      } catch (error) {
        console.log(error);
        useErrorHandler(error)
      }
    },
    async fetchCountries() {
      try {
        const res = await useAxiosFetch("/countries");
        this.setCountries(res.data.data.countries);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
