'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';
import { StarIcon } from 'lucide-react';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { FiShare2 } from 'react-icons/fi';
import { RxBorderSplit } from 'react-icons/rx';
import { TbTruckDelivery } from 'react-icons/tb';
import { CornerDownLeft, Truck } from 'lucide-react';
import { useStore } from "@/app/_components/store";

const productDetailQuery = (slug) => `*[_type == 'product' && slug.current == "${slug}"][0]{
  _id,
  name,
  slug,
  images,
  price,
  discount,
  description,
  additionalInformation,
  reviews,
  stock,
  status,
  "category": categories[]->title,
  variant,
}`;

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [tabIndex, setTab] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, favorites, addToFavorites, removeFromFavorites } = useStore();

  useEffect(() => {
    if (!slug) return;
    client
      .fetch(productDetailQuery(slug))
      .then((data) => {
        setProduct(data);
        setLoading(false);
        setSelectedImageIndex(0);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="text-center mt-20 text-xl">Loading...</div>;
  if (!product) return <div className="text-center py-10 text-gray-500">Product not found.</div>;

  const mainImage = product.images?.[selectedImageIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-10">
      {/* LEFT SIDE: Images and Tabs */}
      <div className="md:w-1/2 flex flex-col gap-8">
        {/* Product Image */}
        <div className="flex flex-col items-center">
          {mainImage ? (
            <div className="overflow-hidden rounded-2xl shadow-lg border w-full max-w-lg h-[400px] flex items-center justify-center group">
              <img
                src={urlFor(mainImage).width(600).height(500).url()}
                alt={product.name}
                className="w-full h-[400px] object-contain transition-transform duration-300 group-hover:scale-110"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </div>
          ) : (
            <div className="w-full max-w-lg h-[400px] bg-gray-100 flex items-center justify-center rounded-xl shadow">
              <span className="text-gray-400">No Image</span>
            </div>
          )}

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 mt-4 flex-wrap justify-center">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={urlFor(img).width(100).height(100).url()}
                  onClick={() => setSelectedImageIndex(idx)}
                  alt={`Thumbnail ${idx}`}
                  className={`w-20 h-20 object-cover rounded-lg border cursor-pointer transition hover:scale-105 ${
                    idx === selectedImageIndex
                      ? 'border-emerald-500 ring-2 ring-emerald-400'
                      : 'border-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* TAB SECTION */}
        <div className="mt-4">
          <div className="flex border-b">
            {['Description', 'Additional Information', 'Reviews'].map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setTab(idx)}
                className={`py-2 px-4 font-medium border-b-2 transition ${
                  tabIndex === idx
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-emerald-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-700">
            {tabIndex === 0 && <p>{product.description}</p>}
            {tabIndex === 1 && (
              <p>{product.additionalInformation || 'No additional information available.'}</p>
            )}
            {tabIndex === 2 && (
              <div>
                {(product.reviews?.length ?? 0) > 0 ? (
                  <ul className="space-y-4">
                    {product.reviews.map((review, i) => (
                      <li key={i} className="border p-3 rounded-md">
                        <p className="font-semibold">{review.user || 'Anonymous'}</p>
                        <p className="text-gray-600">{review.comment || 'No comment'}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No reviews yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Product Info */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <Link href="/shop" className="text-blue-600 hover:underline text-sm">
          ← Back to Shop
        </Link>
        <h1 className="text-3xl font-bold">{product.name}</h1>

        {/* Star Rating */}
        <div className="flex items-center gap-1 text-sm text-gray-700">
          {[...Array(5)].map((_, idx) => (
            <StarIcon key={idx} size={14} className="fill-yellow-500 text-yellow-500" />
          ))}
          <span className="ml-2">(123)</span>
        </div>

        {/* Price and Stock */}
        <div className="space-y-2 border-t border-b py-4">
          {product.discount ? (
            <>
              <p className="text-lg text-gray-400 line-through">${product.price}</p>
              <p className="text-2xl font-bold text-green-600">
                ${(product.price - product.discount).toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-2xl font-bold text-green-600">${product.price}</p>
          )}
          <p
            className={`px-4 py-1.5 inline-block text-sm font-semibold rounded-lg ${
              product.stock > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}
          >
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </p>
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

        {/* Description (Short preview only) */}
        <p className="text-sm text-gray-600 line-clamp-4">{product.description}</p>

        {/* Action Icons */}
        <div className="flex flex-wrap justify-between gap-3 border-y py-4 text-sm text-black">
          <div className="flex items-center gap-2 hover:text-red-600 cursor-pointer">
            <RxBorderSplit />
            <span>Compare color</span>
          </div>
          <div className="flex items-center gap-2 hover:text-red-600 cursor-pointer">
            <FaRegQuestionCircle />
            <span>Ask a question</span>
          </div>
          <div className="flex items-center gap-2 hover:text-red-600 cursor-pointer">
            <TbTruckDelivery />
            <span>Delivery & Return</span>
          </div>
          <div className="flex items-center gap-2 hover:text-red-600 cursor-pointer">
            <FiShare2 />
            <span>Share</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="flex flex-col border rounded-lg overflow-hidden">
          <div className="p-3 flex items-center gap-3 border-b">
            <Truck className="text-shop_orange" />
            <div>
              <p className="font-semibold">Free Delivery</p>
              <p className="text-sm text-gray-500 underline">
                Enter your Postal code for availability.
              </p>
            </div>
          </div>
          <div className="p-3 flex items-center gap-3">
            <CornerDownLeft className="text-shop_orange" />
            <div>
              <p className="font-semibold">Return Delivery</p>
              <p className="text-sm text-gray-500">
                Free 30 days Delivery Return. <span className="underline">Details</span>
              </p>
            </div>
          </div>
        </div>

        {/* Add to Cart with Quantity Controls */}
        <div className="flex items-center gap-4 mt-4">
          <button
            className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-xl font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
          <button
            className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-xl font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            onClick={() => setQuantity((q) => Math.min((product.stock || 99), q + 1))}
            disabled={quantity >= (product.stock || 99)}
            aria-label="Increase quantity"
          >
            +
          </button>
          <button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold shadow ml-4"
            onClick={() => addToCart(product, quantity)}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
