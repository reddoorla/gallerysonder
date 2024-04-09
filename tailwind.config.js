/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    screens: {
      sm: '560px',
      md: '768px',
      lg: '1024px',
      xl: '1340px',
    },
    extend: {
      colors: {
        'subtle-primary': "#E4EEEA",
        'mid-primary': '#D7E7D9',
        'dark-primary' : '#9CC0BC',
        'accent-pink' : '#E8587C',
        'accent-purple' : '#C28BE8',
        'subtle-blue' : '#AACDEC',
        'subtle-mauve' : '#DDB8CA',
        'subtle-tan' : '#F2E8D9',
        'dark-grey' : '#ABABAB',
        'cold-grey' : '#E7E8EB',
        'warm-grey' : '#F3F3F3'
      },
        transitionTimingFunction: {
          'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
          'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
          'fast-slow':'cubic-bezier(.5,0,0,1)'
        },
        height: {
          'screen-75': '75vh',
          'screen-50': '50vh',
          'screen-25': '25vh',
          'screen-10': '10vh',
          'screen-5': '5vh',
          'screen-75': '75vh',
          'screen-50': '50vh',
          'screen-25': '25vh',
          'screen-10': '10vh',
          'screen-5': '5vh',
          'screen-75': '75vh',
          'screen-50': '50vh',
          'screen-25': '25vh',
          'screen-10': '10vh',
          'screen-5': '5vh',
          'screen-75': '75vh',
          'screen-50': '50vh',
          'screen-25': '25vh',
          'screen-10': '10vh',
          'screen-5': '5vh',
          'screen-75': '75vh',
          'screen-50': '50vh',
          'screen-25': '25vh',
          '112': '28rem',
          '128': '32rem',
          '144': '36rem',
          '160': '40rem',
          '192': '48rem',
          '256': '64rem',
          '384': '96rem',
          '512': '128rem',
          '640': '160rem',
          'full': '100%',
          'screen': '100vh',
          'min': 'min-content',
          'max': 'max-content',
          'fit': 'fit-content',
          'proportion': 'proportion'
        }
    },
  },
  plugins: [],
}

