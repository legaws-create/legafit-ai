import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legafit AI",
  description: "AI-powered body transformation coach",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* iOS fullscreen mode */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Legafit AI" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        {/* Splash screen untuk iPhone (opsional, bisa ditambahkan nanti) */}
        {/* <link rel="apple-touch-startup-image" href="/splash.png" /> */}

        {/* Service Worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((reg) => console.log('SW registered', reg))
                    .catch((err) => console.error('SW registration failed', err));
                });
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}