"use client";
import React from "react";
import { useStore } from "../_components/store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { urlFor } from "../_components/image";

const FavoriteScreen = () => {
  const { favorites, removeFromFavorites, addToCart } = useStore();
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Favorite Products</h1>
      {favorites.length === 0 ? (
        <div className="text-center text-gray-500">No favorite products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <div key={product._id} className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col">
              <img
                src={product.images && product.images.length > 0 ? urlFor(product.images[0]).url() : "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.category?.join(", ") || "Uncategorized"}</p>
              <p className="font-bold text-amber-600 dark:text-amber-400 mb-2">${product.price || "N/A"}</p>
              <div className="flex gap-2 mt-auto">
                <Button onClick={() => addToCart(product)} className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700">Add to Cart</Button>
                <Button onClick={() => removeFromFavorites(product._id)} className="flex-1 bg-red-500 text-white hover:bg-red-600">Remove</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteScreen;
