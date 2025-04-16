import defaultTheme from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'
import Color from 'color'

// const alpha = (clr, val) => Color(clr).alpha(val).rgb().string()
// const lighten = (clr, val) => Color(clr).lighten(val).rgb().string()
const darken = (clr, val) => Color(clr).darken(val).rgb().string()

console.log(defaultTheme.screens)

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mont: ['Montserrat', ...defaultTheme.fontFamily.sans],
        inter: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        primary: {
          DEFAULT: '#c5415d', //#06b6d4 //c5415d //004a98
          dark: darken('#c5415d', 0.1),
          darken: darken('#c5415d', 0.2)
        },
        secondary: {
          DEFAULT: '#004a98', //009ef7 //004a98
          dark: darken('#004a98', 0.1),
          darken: darken('#004a98', 0.2)
        },
        success: {
          DEFAULT: '#007167', //50cd89
          dark: darken('#007167', 0.1),
          darken: darken('#007167', 0.2)
        },
        warning: {
          DEFAULT: '#f5b335', //ffc700
          dark: darken('#f5b335', 0.1),
          darken: darken('#f5b335', 0.2)
        },
        danger: {
          DEFAULT: '#C10230', //f1416c
          dark: darken('#C10230', 0.1),
          darken: darken('#C10230', 0.2)
        },
        info: {
          DEFAULT: '#0dcaf0',
          dark: darken('#0dcaf0', 0.1),
          darken: darken('#0dcaf0', 0.2)
        },
        light: {
          DEFAULT: '#F9F9F9',
          dark: darken('#F9F9F9', 0.1),
          darken: darken('#F9F9F9', 0.2)
        },
        dark: {
          DEFAULT: '#181C32',
          dark: darken('#181C32', 0.1),
          darken: darken('#181C32', 0.2)
        }
      },
      boxShadow: {
        x: '-32px 0px 0px 0px rgba(0, 0, 0, 0.3), 32px 0px 0px 0px rgba(0, 0, 0, 0.3)',
        'md-top': '0 -4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'md-right': '4px 0 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'md-left': '-4px 0 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg-top': '0 -10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'lg-right': '10px 0 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'lg-left': '-10px 0 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
      },
      keyframes: {
        'fall-down': {
          '0%': { transform: 'translateY(-20px)', opacity: 0, pointerEvents: 'none' },
          '100%': { transform: 'translateY(0px)', pointerEvents: 'none' }
        },
        'fall-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0, pointerEvents: 'none' },
          '100%': { transform: 'translateY(0px)', pointerEvents: 'none' }
        },
        'fall-right': {
          '0%': { transform: 'translateX(-20px)', opacity: 0, pointerEvents: 'none' },
          '100%': { transform: 'translateX(0px)', pointerEvents: 'none' }
        },
        'fall-left': {
          '0%': { transform: 'translateX(20px)', opacity: 0, pointerEvents: 'none' },
          '100%': { transform: 'translateX(0px)', pointerEvents: 'none' }
        }
      },
      animation: {
        'fall-down': 'fall-down 0.2s ease',
        'fall-down-reverse': 'fall-down 0.2s ease reverse',
        'fall-up': 'fall-up 0.2s ease',
        'fall-up-reverse': 'fall-up 0.2s ease reverse',
        'fall-right': 'fall-right 0.2s ease',
        'fall-right-reverse': 'fall-right 0.2s ease reverse',
        'fall-left': 'fall-left 0.2s ease',
        'fall-left-reverse': 'fall-left 0.2s ease reverse'
      }
      // screens: {
      //   xxl: { max: '1536px' },
      //   xl: { max: '1280px' },
      //   lg: { max: '1024px' },
      //   md: { max: '768px' },
      //   sm: { max: '640px' },
      //   xs: { max: '480px' }
      // }
    }
  },
  plugins: [
    plugin(function ({ addBase, addComponents, addUtilities, config }) {
      ;[500, 1000, 1500, 2000, 2500, 3000].forEach((el) => {
        addUtilities({
          ['.animation-duration-' + el]: {
            'animation-duration': `${el}ms;`
          }
        })
      })
    })
  ]
}
