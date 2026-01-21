import type { Config } from 'tailwindcss'; 
  
export default { 
  content: [ 
    "./app/**/*.{js,ts,jsx,tsx,mdx}", 
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", 
    "./components/**/*.{js,ts,jsx,tsx,mdx}", 
    "./lib/**/*.{js,ts,jsx,tsx,mdx}", 
  ], 
  theme: { 
    extend: { 
      animation: { 
        'fade-in-right': 'fadeInRight 0.5s ease-in-out forwards', 
        'fade-in-left': 'fadeInLeft 0.5s ease-in-out forwards', 
        'fade-in-up': 'fadeInUp 0.5s ease-in-out forwards', 
      }, 
      keyframes: { 
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }, 
      screens: {
        '4k': '2560px',
      },
    }, 
  }, 
  plugins: [], 
} satisfies Config; 
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
    },
  },
  plugins: [],
};
