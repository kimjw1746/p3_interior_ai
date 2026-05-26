import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import Provider from "./provider";

export const metadata = {
  title: "Interior AI",
  description: "AI-powered interior design",
  manifest: '/manifest.json',
  themeColor: '#000000',
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