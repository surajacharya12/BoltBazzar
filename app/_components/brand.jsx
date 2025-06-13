"use client";

import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { useRouter } from 'next/navigation';

// ✅ Includes `slug`
const brandQuery = `*[_type == "brand"]{_id, title, slug, image}`;

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    client.fetch(brandQuery)
      .then((data) => {
        setBrands(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <h1 className="text-4xl md:text-6xl font-extrabold text-white animate-pulse drop-shadow-lg tracking-widest">
        BoltBazzarr
      </h1>
    );
  }

  return (
    <div className="w-full py-8 bg-gradient-to-r from-amber-50 to-yellow-100 dark:from-amber-900 dark:to-yellow-800 rounded-xl shadow flex flex-col items-center">
      <h2 className="text-2xl font-bold text-amber-700 dark:text-yellow-200 mb-6">Our Brands</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {brands.map((brand) => (
          <div
            key={brand._id}
            className="flex flex-col items-center gap-2 bg-white dark:bg-gray-900 rounded-lg shadow p-4 w-36 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-800 transition"
            onClick={() => {
              if (brand.slug?.current) {
                router.push(`/brand/${brand.slug.current}`);
              }
            }}
          >
            {brand.image && (
              <img
                src={urlFor(brand.image).width(80).height(80).url()}
                alt={brand.title}
                className="w-20 h-20 object-contain rounded-full border border-amber-200 dark:border-amber-700 bg-white"
              />
            )}
            <span className="text-base font-semibold text-gray-800 dark:text-gray-200 text-center hover:underline">
              {brand.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brand;
