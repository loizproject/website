import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
  id: 'authStore',
  state: () => ({
    user: null
  }),
  actions: {
    async fetchUser() {
      try {
        const resUser = await useAxiosFetch("/user");
        if (resUser) {
          const user = resUser.data.data.user;
          this.user = user;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async logout() {
      this.user = null
    }
  },
});