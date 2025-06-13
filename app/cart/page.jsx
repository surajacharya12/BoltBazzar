"use client";
import React from "react";
import { useStore } from "../_components/store";
import { Button } from "@/components/ui/button";
import { urlFor } from "../_components/image";

const CartScreen = () => {
  const { cart, removeFromCart } = useStore();

  const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 -mt-25">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center text-gray-500">Your cart is empty.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {cart.map((product) => (
              <div key={product._id} className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col">
                <img
                  src={product.images && product.images.length > 0 ? urlFor(product.images[0]).url() : "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.category?.join(", ") || "Uncategorized"}</p>
                <p className="font-bold text-amber-600 dark:text-amber-400 mb-2">${product.price || "N/A"} x {product.qty || 1}</p>
                <Button onClick={() => removeFromCart(product._id)} className="bg-red-500 text-white hover:bg-red-600 mt-auto">Remove</Button>
              </div>
            ))}
          </div>
          <div className="text-right text-lg font-semibold text-gray-800 dark:text-white">
            Total: ${total}
          </div>
        </>
      )}
    </div>
  );
};

export default CartScreen;
