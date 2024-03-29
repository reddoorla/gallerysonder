/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'subtle-primary': "#E4EEEA",
        'mid-primary': '#D7E7D9',
        'dark-primary' : '#9CC0BC',
        'accent-pink' : '#E8587C',
        'accent-purple' : '#C28BE8',
        'subtle-blue' : '#AACDEC',
        'subtle-mauve' : '#DDB8CA',
        'subtle-tan' : '#DCCDB9',
        'dark-grey' : '#ABABAB',
        'cold-grey' : '#E7E8EB',
        'warm-grey' : '#F3F3F3'
      }
    },
  },
  plugins: [],
}

