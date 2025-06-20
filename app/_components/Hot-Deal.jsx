"use client";

import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';

const hotDealQuery = `*[_type == 'product' && status == 'hot']|order(name asc){
  _id,
  name,
  slug,
  images,
  price,
  oldPrice,
  stock,
  status,
  "category": categories[]->title,
  variant,
}`;

function HotDeal() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    client.fetch(hotDealQuery)
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addToFavorites = (product) => {
    setFavorites((prev) => [...prev, product]);
  };

  const removeFromFavorites = (productId) => {
    setFavorites((prev) => prev.filter((fav) => fav._id !== productId));
  };

  if (loading) {
    return (
        <h1 className="text-4xl md:text-6xl font-extrabold text-white animate-pulse drop-shadow-lg tracking-widest">
          BoltBazzarr
        </h1>
   
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 -mt-20 ">
      <h1 className="text-3xl font-bold text-amber-600 mb-8 text-center">Hot Deals of the Week</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const imageUrl = product.images && product.images.length > 0 ? urlFor(product.images[0]).url() : "/placeholder.jpg";
            return (
              <Link
                key={product._id}
                href={`/product/${product.slug?.current || product._id}`}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-300 flex flex-col"
              >
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-2">{product.category?.join(", ") || "Categories"}</p>
                  <div className="flex items-baseline gap-2 mt-auto">
                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400">${product.price ?? "N/A"}</span>
                    {product.oldPrice && (
                      <span className="text-sm line-through text-gray-400">${product.oldPrice}</span>
                    )}
                  </div>
                  {/* Product Status and Heart Icon */}
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${product.status === 'hot' ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-600'}`}>{product.status || 'Normal'}</span>
                    <button
                      type="button"
                      className={`text-xl ${favorites.some(fav => fav._id === product._id) ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                      onClick={() => {
                        const isFav = favorites.some(fav => fav._id === product._id);
                        isFav ? removeFromFavorites(product._id) : addToFavorites(product);
                      }}
                      aria-label="Add to favorites"
                    >
                      {favorites.some(fav => fav._id === product._id) ? "❤️" : "🤍"}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg">No hot deal products found.</div>
      )}
    </div>
  );
}

export default HotDeal;