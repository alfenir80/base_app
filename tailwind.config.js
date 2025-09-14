/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Escaneia o arquivo HTML principal
    "./src/**/*.{js,ts,jsx,tsx}", // Escaneia todos os arquivos JS, TS, JSX, TSX dentro da pasta src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

