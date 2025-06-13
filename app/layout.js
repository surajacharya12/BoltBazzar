import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import ClientLayout from './_components/ClientLayout'; // Your client wrapper (wraps NavBar, etc.)
import { StoreProvider } from "./_components/store";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'BoltBazaar',
  description: 'Your fast and reliable online marketplace...',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
          <ClientLayout>{children}</ClientLayout>
        </StoreProvider>
      </body>
    </html>
  );
}
