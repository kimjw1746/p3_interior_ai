import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import Provider from "./provider";

export const viewport = {
  themeColor: '#000000',
};

export const metadata = {
  title: "Interior AI",
  description: "AI-powered interior design",
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Provider>
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}