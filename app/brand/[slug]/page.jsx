"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { useStore } from "@/app/_components/store";

const brandDetailQuery = (slug) => `*[_type == 'brand' && slug.current == "${slug}"][0]{
  _id,
  title,
  slug,
  image,
  description
}`;

const productsByBrandQuery = (brandId) => `*[_type == 'product' && brand._ref == '${brandId}']|order(name asc){
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

export default function BrandProductsPage() {
  const { slug } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites, addToFavorites, removeFromFavorites } = useStore();

  useEffect(() => {
    if (!slug) return;
    client.fetch(brandDetailQuery(slug)).then((brandData) => {
      setBrand(brandData);
      if (brandData?._id) {
        client.fetch(productsByBrandQuery(brandData._id)).then((prods) => {
          setProducts(prods);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, [slug]);

  if (loading) {
    return (
        <h1 className="text-4xl md:text-6xl font-extrabold text-white animate-pulse drop-shadow-lg tracking-widest">
          BoltBazzarr
        </h1>
      
    );
  }

  if (!brand) {
    return <div className="text-center text-gray-500 py-10">Product not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">← Back Home</Link>
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-10">
        {brand.image && (
          <img
            src={urlFor(brand.image).width(120).height(120).url()}
            alt={brand.title}
            className="w-32 h-32 object-contain rounded-full border border-amber-200 dark:border-amber-700 bg-white shadow"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-amber-700 dark:text-yellow-200 mb-2">{brand.title}</h1>
          {brand.description && <p className="text-gray-700 dark:text-gray-300 max-w-xl">{brand.description}</p>}
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-6">Products by {brand.title}</h2>
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
                      className={`text-xl ${favorites?.some(fav => fav._id === product._id) ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                      onClick={e => {
                        e.preventDefault();
                        const isFav = favorites?.some(fav => fav._id === product._id);
                        isFav ? removeFromFavorites(product._id) : addToFavorites(product);
                      }}
                      aria-label="Add to favorites"
                    >
                      {favorites?.some(fav => fav._id === product._id) ? "❤️" : "🤍"}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg">No products found for this brand.</div>
      )}
    </div>
  );
}
