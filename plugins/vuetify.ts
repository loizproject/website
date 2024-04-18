import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import colors from 'vuetify/util/colors'

export default defineNuxtPlugin((nuxtApp) => {
  // Doing something with nuxtApp
  const vuetify = createVuetify({
    // your config will come here
    ssr: true,
    components,
    directives,
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            primary: "#4A4A68",
            secondary: "#5E606A",
            variant: "#E97437",
            info: "#2E697E",
            error: "#D85A42",
            error_light: "#FF766E",
            warning: "#F5C34A",
            success: "#34C759",
            metal: "#152230",
          }
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
