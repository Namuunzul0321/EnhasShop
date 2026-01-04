import "./globals.css";

export const metadata = {
  title: "EnhaS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&display=swap&subset=cyrillic"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
