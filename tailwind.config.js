/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Geologica"', 'sans-serif'],
      },
      colors: {
        publishing: {
          paper: '#FBFBF9',     // Світлий папір преміум класу
          panel: '#F6F3EB',     // Контрастні зони манускрипту
          ink: '#1A1A1C',       // Колір друкарської сажі
          muted: '#76726A',     // Приглушений сухий пил
          burgundy: '#82132d',  // Шляхетний бордовий сургуч
          gold: '#B8974D',      // Класичне золоте тиснення фольгою
          success: '#358f35',   // Зелений книжковий форзац
          cyan: '#2A5C6A',      // Глибокий синьо-морський відлив
          danger: '#9E2A2B'     // Сигнальний червоний маркер правок
        }
      },
      boxShadow: {
        editorial: '0 4px 20px -2px rgba(26, 26, 28, 0.08), 0 2px 6px -1px rgba(26, 26, 28, 0.04)',
      }
    },
  },
  plugins: [],
}