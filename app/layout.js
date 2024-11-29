import "./globals.css";
import App from "./App.jsx";
export const metadata = {
  title: "WebApp",
  description: "Веб-приложения для управление базой данных",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body>
        <App>{children}</App>
      </body>
    </html>
  );
}
