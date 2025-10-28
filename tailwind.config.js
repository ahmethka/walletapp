/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg:   "#ffffff",  // Uygulama arka planı
        card: "#f4f4f5",  // Kartlar
        text: "#000000",  // Siyah metin
        muted:"#6b7280",  // Gri metin
        line: "#e5e7eb",  // Ayırıcı çizgi
        accent:"#374151", // Vurgu (buton/ikon)
        success: "#22c55e",
        danger: "#ef4444"
      },
      borderRadius: { xl: "14px" }
    }
  },
  plugins: [],
}
