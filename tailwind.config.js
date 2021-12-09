module.exports = {
  mode: 'jit',
  purge: ['./**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        primary: '#0A65FF',
        gray: {
          'table-head': '#F4F7FC',
          secondary: '#606F89',
          primary: '#2E3B52',
        },
        red: {
          negative: '#E01A1A'
        },
        green: {
          positive: '#008400',
        }
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
