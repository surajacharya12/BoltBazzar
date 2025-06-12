"use client";
import React, { useState } from "react";
import { ModeToggle } from "./themeMode";
import { Heart, ShoppingBag, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { navLinks } from "../constant/navlink";
import { UserButton, SignInButton, useUser, ClerkLoaded, SignedIn } from "@clerk/nextjs";

export default function NavBar() {
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const pathname = usePathname();
  const [isFavActive, setIsFavActive] = useState(false);
  const [isCartActive, setIsCartActive] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-gray-700 dark:text-gray-300"
              aria-label="Open Menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 ml-2 md:ml-0">
            <a href="/">
              <img src="/image.png" alt="Logo" className="h-10 w-auto" />
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              if (!isSignedIn && link.href !== "/") {
                // For signed out users, show sign-in modal for non-home links
                return (
                  <SignInButton mode="modal" key={link.href} afterSignInUrl={link.href}>
                    <button
                      className={`relative group text-sm font-medium transition-colors duration-200 ${
                        isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300"
                      }`}
                      type="button"
                    >
                      {link.label}
                      <span
                        className={`absolute left-0 -bottom-1 h-0.5 w-full bg-indigo-600 dark:bg-indigo-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left ${
                          isActive ? "scale-x-100" : ""
                        }`}
                      ></span>
                    </button>
                  </SignInButton>
                );
              } else if (!isSignedIn && link.href === "/") {
                // For signed out users, Home link always redirects to root
                return (
                  <SignInButton mode="modal" key={link.href} afterSignInUrl="/">
                    <button
                      className={`relative group text-sm font-medium transition-colors duration-200 ${
                        isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300"
                      }`}
                      type="button"
                    >
                      {link.label}
                      <span
                        className={`absolute left-0 -bottom-1 h-0.5 w-full bg-indigo-600 dark:bg-indigo-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left ${
                          isActive ? "scale-x-100" : ""
                        }`}
                      ></span>
                    </button>
                  </SignInButton>
                );
              }
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative group text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 w-full bg-indigo-600 dark:bg-indigo-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left ${
                      isActive ? "scale-x-100" : ""
                    }`}
                  ></span>
                </a>
              );
            })}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Toggle */}
            <div className="md:hidden flex items-center">
              {!mobileSearchOpen ? (
                <button
                  onClick={() => setMobileSearchOpen(true)}
                  className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 dark:text-gray-300"
                  aria-label="Open Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-3 pr-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-36"
                  />
                  <button
                    onClick={() => setMobileSearchOpen(false)}
                    className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 dark:text-gray-300"
                    aria-label="Close Search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Search Input */}
            <div className="hidden md:flex relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Favorite Button */}
            <button
              onClick={() => setIsFavActive(!isFavActive)}
              className="p-1 rounded-full focus:outline-none"
              aria-label="Favorite"
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isFavActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-300"
                }`}
              />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartActive(!isCartActive)}
              className="p-1 rounded-full focus:outline-none"
              aria-label="Cart"
            >
              <ShoppingBag
                className={`h-5 w-5 transition-colors ${
                  isCartActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-300"
                }`}
              />
            </button>

            {/* Theme Toggle */}
            <ModeToggle />

            {/* Auth Buttons */}
            <ClerkLoaded>
              <SignedIn>
                <UserButton />
              </SignedIn>
              {!isSignedIn && (
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-gray-800 dark:text-white">Sign In</button>
                </SignInButton>
              )}
            </ClerkLoaded>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 z-50 shadow-lg transform transition-transform duration-300 ease-in-out">
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-700">
            {/* Logo inside sidebar */}
            <a href="/" className="flex-shrink-0">
              <img src="/image.png" alt="Logo" className="h-10 w-auto" />
            </a>

            {/* Close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 dark:text-gray-300"
              aria-label="Close Menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Nav links inside sidebar */}
          <nav className="px-4 py-6 space-y-2">
            {navLinks.map((link) => {
              if (!isSignedIn && link.href !== "/") {
                return (
                  <SignInButton mode="modal" key={link.href} afterSignInUrl={link.href}>
                    <button
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        pathname === link.href ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300"
                      } hover:bg-indigo-50 dark:hover:bg-gray-800`}
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </button>
                  </SignInButton>
                );
              } else if (!isSignedIn && link.href === "/") {
                return (
                  <SignInButton mode="modal" key={link.href} afterSignInUrl="/">
                    <button
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        pathname === link.href ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300"
                      } hover:bg-indigo-50 dark:hover:bg-gray-800`}
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </button>
                  </SignInButton>
                );
              }
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === link.href ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300"
                  } hover:bg-indigo-50 dark:hover:bg-gray-800`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </nav>
  );
}
