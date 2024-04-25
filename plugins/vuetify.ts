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
            primary: "#EB0C8F",
            secondary: "#5AB9C2", 
            variant: "#2A2A2A",
            info: "#F585C7",
            error: "#EB5757",
            accent: "#0BDFED",
            warning: "#F1BC19",
            success: "#27AE60",
            metal: "#152230",
          }
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
