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
import NavBar from '../_components/navBar'; // Adjust path if needed

export default function ClientLayout({ children }) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {/* Auth Header */}
        <header className="flex justify-end items-center p-4 gap-4 h-16 border-b">
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>

        <NavBar />
        <main className="pt-16">{children}</main>
      </ThemeProvider>
    </ClerkProvider>
  );
}
