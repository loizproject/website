import { defineStore } from 'pinia';
import { useBasketStore } from './basket';

export const useAuthStore = defineStore({
  id: 'authStore',
  state: () => ({
    user: null
  }),
  actions: {
    async login(reqPayload) {
      const res = await useAxiosPost("/login", reqPayload);
      const { token: authToken } = res.data.authorization
      const token = await useCookie("loiz_auth_token", { maxAge: 60 * 60 })
      token.value = authToken // save auth token as cookie
    },
    async googleAuth() {
      const config = useRuntimeConfig()
      const route = useRoute()
      try {
        const url = _CloneDeep(route.fullPath);
        const newUrl = url.replace("auth/google", "google/login");
        const res = await useAxiosFetch(`${config.public.BASE_URL}${newUrl}`);
        // set token
        const { token: authToken } = res.data.authorization
        const token = await useCookie("loiz_auth_token", { maxAge: 60 * 60 });
        token.value = authToken; // save auth token as cookie)
      } catch (error) {
        useErrorHandler(error);
        throw new Error(error)
      }
    },
    async facebookAuth() {
      const config = useRuntimeConfig()
      const route = useRoute()
      try {
        const url = _CloneDeep(route.fullPath);
        const newUrl = url.replace("auth/facebook", "facebook/login");
        const res = await useAxiosFetch(`${config.public.BASE_URL}${newUrl}`);
        // set token
        const { token: authToken } = res.data.authorization
        const token = await useCookie("loiz_auth_token", { maxAge: 60 * 60 });
        token.value = authToken; // save auth token as cookie)
      } catch (error) {
        useErrorHandler(error);
        throw new Error(error)
      }
    },
    async fetchUser() {
      try {
        const resUser = await useAxiosFetch("/user");
        if (resUser) {
          const user = resUser.data.data.user;
          this.user = user;
        }
      } catch (error) {
        console.error(error);
        this.logout()
      }
    },
    async logout() {
      const basketStore = useBasketStore()
      try {
        useAxiosPost("/logout");
        const token = useCookie("loiz_auth_token")
        token.value = null // destroy auth token
        basketStore.basket = []
        this.user = null
      } catch (error) {
        console.log(error);
      }
    }
  },
});