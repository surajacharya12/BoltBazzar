"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";

export default function ShopPage() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        {isSignedIn ? `Welcome to the Shop, ${user.firstName}` : "Welcome to the Shop"}
      </h1>
      <p>Browse our amazing collection of products.</p>
    </div>
  );
}