import getSiteHead from './utils/getSiteHead'

export default defineNuxtConfig({
  devtools: { enabled: true },

  devServer: {
    port: 3000,
  },

  app: {
    head: {
      // ...getSiteHead({}),
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      script: [
        {
          src: 'https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js',
          tagPosition: 'head',
          async: true
        },
      ],
    }
  },

  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
    "~/assets/css/tailwind.css",
    "~/assets/css/global.scss",
    "~/assets/css/animations.scss",
    "~/assets/css/wordpress.scss",
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [// ...
  '@pinia/nuxt', '@nuxt/image', '@nuxtjs/google-fonts', "nuxt-lodash", // "nuxt-graphql-request",
  "maz-ui/nuxt"],

  mazUi: {
    injectComponents: true,
    injectCss: true,
    injectAos: {
      injectCss: true,
    },
    injectUseToast: true,
    injectUseThemeHandler: true,
    devtools: true,
  },

  lodash: {
    prefix: "_",
  },

  image: {
    provider: 'cloudinary',
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/loiztours/image/upload/site-media',
      modifiers: {
        effect: 'sharpen:100',
        quality: 'auto:best',
      }
    },
    providers: {
      default: {
        provider: '~/providers/default',
        options: {
          baseURL: process.env.ASSETS_URL,
        }
      }
    }
  },

  googleFonts: {
    download: false,
    families: {
      Inter: {
        wght: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      },
      'Plus+Jakarta+Sans': {
        wght: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        ital: [100, 200, 300, 400, 500, 600, 700, 800, 900]
      },
    }
  },

  // graphql: {
  //   clients: {
  //     default: {
  //       endpoint: process.env.CMS_BASE_URL!,
  //       options: {
  //         method: 'get', // Default to `POST`
  //       },
  //     },
  //   },
  // },
  runtimeConfig: {
    public: {
      sanctumCookieURL: process.env.AUTH_BASE_URL,
      APP_URL: process.env.APP_URL,
      BASE_URL: process.env.BASE_URL,
      CMS_BASE_URL: process.env.CMS_BASE_URL,
      APP_ENV: process.env.APP_ENV,
      MEDIA_ASSETS_URL: process.env.MEDIA_ASSETS_URL,
      PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
      FLW_PUBLIC_KEY: process.env.FLW_PUBLIC_KEY,
      PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY,
      googleAnalytics: {
        id: process.env.GOOGLE_ANALYTICS_ID,
        debug: process.env.GOOGLE_ANALYTICS_DEBUG // Set this to false in production
      },
    }
  },

  build: {
    transpile: ["vuetify", "nuxt-graphql-request", "lodash-es"],
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => {
        return tag.startsWith('iconify-icon')
      }
    }
  },

  vite: {
    define: {
      "process.env.DEBUG": false,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/css/variables.scss";',
        },
      },
    },
  },

  compatibilityDate: '2024-11-02',
});