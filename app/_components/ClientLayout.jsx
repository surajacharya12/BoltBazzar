'use client';

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';

import { ThemeProvider } from '@/components/components/theme-provider';
import NavBar from '../_components/navBar';        // Adjust based on your folder structure
import GuestHome from '../_components/GuestHome';
import Footer from '../_components/footer';        // ✅ Make sure file is named `Footer.jsx` or `Footer.tsx`

export default function ClientLayout({ children }) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {/* Header with SignIn / SignUp / User Info */}
        <header className="flex justify-end items-center p-4 gap-4 h-16 border-b">
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>

        {/* Main Navigation */}
        <NavBar />

        {/* Page Content */}
        <main className="pt-16 min-h-screen">
          <SignedOut>
            <GuestHome />
          </SignedOut>
          <SignedIn>{children}</SignedIn>
        </main>

        {/* Persistent Footer on all screens */}
        <Footer />
      </ThemeProvider>
    </ClerkProvider>
  );
}
