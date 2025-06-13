"use client";
import React, { useState } from "react";
import { ModeToggle } from "./themeMode";
import { Heart, ShoppingBag, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { navLinks } from "../constant/navlink";
import { UserButton, SignInButton, useUser, ClerkLoaded, SignIn, SignedIn } from "@clerk/nextjs";
import { useStore } from "./store";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

export const query = `*[_type == "product" && name match $term] | order(name desc) { ..., "category": categories[]->title }`;

export default function NavBar() {
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const pathname = usePathname();
  const [isFavActive, setIsFavActive] = useState(false);
  const [isCartActive, setIsCartActive] = useState(false);
  const { favorites, cart } = useStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchActive, setSearchActive] = useState(false);

  // Live search: fetch as user types
  React.useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setSearchActive(false);
      return;
    }
    const fetchSearch = async () => {
      setSearchActive(true);
      const query = `*[_type == "product" && name match $term] | order(name desc) { ..., "category": categories[]->title }`;
      const params = { term: `*${searchTerm}*` };
      try {
        const results = await client.fetch(query, params);
        setSearchResults(results);
      } catch (err) {
        setSearchResults([]);
      }
    };
    fetchSearch();
  }, [searchTerm]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Mobile Menu Toggle on Left */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-gray-700 dark:text-gray-300"
              aria-label="Open Menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 ml-2 md:ml-0">
            <a href="/">
              <img src="/download.png" alt="Logo" className="h-30 w-auto" />
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative group text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-700 dark:text-gray-300"
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
                <div className="flex flex-col w-full relative">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-3 pr-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-36"
                    />
                    <button
                      onClick={() => { setMobileSearchOpen(false); setSearchTerm(""); setSearchActive(false); }}
                      className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 dark:text-gray-300"
                      aria-label="Close Search"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  {/* Mobile Search Results Dropdown */}
                  {searchActive && searchResults.length > 0 && (
                    <div className="absolute left-0 top-10 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50 max-h-80 overflow-y-auto">
                      {searchResults.map(product => {
                        let imageUrl = "/placeholder.jpg";
                        if (product.images && product.images.length > 0) {
                          try {
                            imageUrl = urlFor(product.images[0]).url();
                          } catch {
                            imageUrl = product.images[0].asset?.url || "/placeholder.jpg";
                          }
                        }
                        return (
                          <div
                            key={product._id}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            onClick={() => {
                              router.push(`/product/${product.slug?.current || product._id}`);
                              setSearchActive(false);
                              setSearchTerm("");
                              setMobileSearchOpen(false);
                            }}
                          >
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white">{product.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{product.category?.join(", ") || "Categories"}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Search Input */}
            <div className="hidden md:flex relative">
              {/* Remove the form, use a div instead for live search */}
              <div className="w-full flex">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="absolute left-2 top-1.5 h-4 w-4 text-gray-400 bg-transparent border-none">
                  <Search className="h-4 w-4" />
                </span>
              </div>
              {/* Search Results Dropdown */}
              {searchActive && searchResults.length > 0 && (
                <div className="absolute left-0 top-10 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50 max-h-80 overflow-y-auto">
                  {searchResults.map(product => {
                    let imageUrl = "/placeholder.jpg";
                    if (product.images && product.images.length > 0) {
                      try {
                        imageUrl = urlFor(product.images[0]).url();
                      } catch {
                        imageUrl = product.images[0].asset?.url || "/placeholder.jpg";
                      }
                    }
                    return (
                      <div
                        key={product._id}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => {
                          router.push(`/product/${product.slug?.current || product._id}`);
                          setSearchActive(false);
                          setSearchTerm("");
                        }}
                      >
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{product.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{product.category?.join(", ") || "Categories"}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={() => router.push("/favorites")}
              className="p-1 rounded-full focus:outline-none relative"
              aria-label="Favorite"
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  favorites.length > 0
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => router.push("/cart")}
              className="p-1 rounded-full focus:outline-none relative"
              aria-label="Cart"
            >
              <ShoppingBag
                className={`h-5 w-5 transition-colors ${
                  cart.length > 0
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full px-1">
                  {cart.length}
                </span>
              )}
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
                  <button className="text-sm font-medium text-gray-800 dark:text-white">
                    Sign In
                  </button>
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
              <img src="/download.png" alt="Logo" className="h-30 w-auto" />
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
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-700 dark:text-gray-300"
                } hover:bg-indigo-50 dark:hover:bg-gray-800`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </nav>
  );
}
