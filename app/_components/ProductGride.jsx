"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { productType } from "../constant/ProductType";
import { Button } from "@/components/ui/button";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { useStore } from "./store";

const ProductGride = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(productType[0]?.title || "");
  const router = useRouter();
  const { favorites, addToFavorites, removeFromFavorites, cart, addToCart } = useStore();

  const query = `*[_type == "product" && variant == $variant] | order(name desc) {
    ...,
    "category": categories[]->title
  }`;
  const params = { variant: selectedTab.toLowerCase() };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await client.fetch(query, params);
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab]);

  return (
    <div className="w-full mt-10 px-6 md:px-12">
      {/* Tabs + See All */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-4">
          {productType?.map((item) => (
            <Button
              key={item?.title}
              variant={selectedTab === item.title ? "default" : "outline"}
              onClick={() => setSelectedTab(item.title)}
              className={`rounded-full text-sm font-semibold px-6 py-3 transition-all duration-300 shadow-md ${
                selectedTab === item.title
                  ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-white hover:from-amber-600 hover:to-yellow-500 shadow-lg"
                  : "border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              {item?.title}
            </Button>
          ))}
        </div>

        <Button
          onClick={() => router.push("/shop")}
          className="rounded-full text-sm font-semibold px-7 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white hover:from-yellow-500 hover:to-amber-600 shadow-lg transition-transform duration-300 hover:scale-110"
        >
          See All
        </Button>
      </div>

      {/* Selected Tab Display */}
      {selectedTab && (
        <div className="text-center text-lg md:text-xl text-gray-800 dark:text-gray-200 mb-8 font-semibold tracking-wide">
          Showing products for: <span className="text-amber-500">{selectedTab}</span>
        </div>
      )}

      {/* Product Display */}
      {loading ? (
        <div className="text-center text-gray-500 text-lg">Loading products...</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.slice(0, 8).map((product) => {
            const isFav = favorites.some((item) => item._id === product._id);
            const imageUrl =
              product.images && product.images.length > 0
                ? urlFor(product.images[0]).url()
                : "/placeholder.jpg";

            return (
              <div
                key={product._id}
                className="relative bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-300"
              >
                {/* Wishlist */}
                <div className="absolute top-3 right-3 z-10">
                  <button
                    className={`text-xl ${isFav ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                    onClick={() =>
                      isFav ? removeFromFavorites(product._id) : addToFavorites(product)
                    }
                  >
                    {isFav ? "❤️" : "🤍"}
                  </button>
                </div>

                {/* Image */}
                <div
                  onClick={() =>
                    router.push(`/product/${product.slug?.current || product._id}`)
                  }
                  className="cursor-pointer overflow-hidden rounded-t-xl"
                >
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Product Status */}
                {product.status && (
                  <span className="inline-block mb-2 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200">
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </span>
                )}

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {product.category?.join(", ") || "Categories"}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center text-sm text-yellow-500 my-1">
                    {"★".repeat(5)}
                    <span className="ml-2 text-gray-500 dark:text-gray-400">(5 Reviews)</span>
                  </div>

                  {/* Stock */}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    In Stock: {product.stock ?? 0}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      ${product.price ?? "N/A"}
                    </p>
                    {product.oldPrice && (
                      <p className="text-sm line-through text-gray-400">
                        ${product.oldPrice}
                      </p>
                    )}
                  </div>

                  {/* Add to Cart */}
                  <Button
                    className="mt-3 w-full rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg">No products found.</div>
      )}
    </div>
  );
};

export default ProductGride;
