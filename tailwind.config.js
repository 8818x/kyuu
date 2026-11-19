/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./app.js"],
  theme: {
    extend: {
      colors: {
        ground: "#171a20",
        surface: "#24272d",
        cream: "#efe1c7",
        muted: "#a9aaa5",
        orange: "#ff6129",
        olive: "#99af67",
        salmon: "#fb8c70",
        yellow: "#f5c500",
        red: "#ff3237",
        rule: "#363941",
        white: "#edeee6"
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "Times New Roman", "serif"],
        body: ["system-ui", "Segoe UI", "sans-serif"]
      },
      maxWidth: {
        container: "1240px",
        detail: "980px"
      }
    }
  },
  plugins: []
};
