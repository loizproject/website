/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  prefix: 'tw-',
  content: [
    `components/**/*.{vue,js}`,
    `layouts/**/*.vue`,
    `pages/**/*.vue`,
    `app.vue`,
    `plugins/**/*.{js,ts}`,
    `nuxt.config.{js,ts}`,
  ],
  theme: {
    extend: {
      screens: {
        '3xl': { min: '1535px' },
        // => @media (max-width: 1535px) { ... }

        '2xl': { min: '1430px' },
        // => @media (max-width: 1535px) { ... }

        xl: { min: '1290px' },
        // => @media (max-width: 1279px) { ... }

        lg: { min: '1023px' },
        // => @media (max-width: 1023px) { ... }

        md: { min: '767px' },
        // => @media (max-width: 767px) { ... }

        sm: { min: '539px' },
        // => @media (max-width: 639px) { ... }
      },
      extend: {
        fontSize: {
          'xxs': '0.65rem'
        },
      },
      fontFamily: {
        'inter': ['"Inter"', 'sans-serif'],
        'display': ['Oswald'],
        'body': ['Open Sans'],
       },
      animation: { // all keyframes are defined in: ~/assets/styles/animations.css
        dropdown: 'dropdown .4s linear 1',
        fall: 'fall .4s ease-in-out 1',
        show: 'show 0.5s ease-in-out 1',
        showSlow: 'show 1s ease-in-out 1',
        moveUp: 'moveUp .5s ease-in-out 1',
        slide: 'slide 2s ease-in-out 1',
        close: 'close 0.3s ease-in-out 1',
        fadeDown: 'fadeDown 1s ease-in-out 1',
        fadeUp: 'fadeUp 1s ease-in-out 1',
        fadeRight: 'fadeRight 1s ease-in-out 1',
        fadeLeft: 'fadeLeft 1s ease-in-out 1',
        fadeRightNav: 'fadeRight 0.5s ease-in-out 1',
        fadeLeftNav: 'fadeLeft 0.5s ease-in-out 1',
        'zoom-in': 'zoomIn 0.5s ease-in-out 1',
      },
    },
  },
  plugins: [],
}

