import { useGetCookie } from "../composables/getCookie";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  if (process.client) {
    const cookiePreferences = useGetCookie("loiz_user_preferences")
    const { performance } = cookiePreferences && cookiePreferences.value ? JSON.parse(cookiePreferences.value) : { performance: true }
    // console.log(cookiePreferences, performance);
    if (performance) {
      // Add the Google Analytics script dynamically
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${config.public.googleAnalytics.id}`;
      script.async = true;
      document.head.appendChild(script);

      // Initialize Google Analytics
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', config.public.googleAnalytics.id);
    }
  }
});