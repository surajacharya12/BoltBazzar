import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

const brandQuery = `*[_type == "brand"]{_id, title, image}`;

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="flex items-center justify-center w-full h-24 bg-gradient-to-r from-amber-500 to-yellow-400 text-white rounded-xl shadow-md">
        <span className="text-lg font-semibold animate-pulse">Loading brands...</span>
      </div>
    );
  }

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900 dark:to-yellow-800 rounded-xl shadow-lg flex flex-col items-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-amber-700 dark:text-yellow-200 mb-10 text-center drop-shadow">
        Our Trusted Brands
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {brands.map((brand) => (
          <div
            key={brand._id}
            className="flex flex-col items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-amber-100 dark:border-amber-700 rounded-xl shadow-md p-5 w-36 hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl"
          >
            {brand.image && (
              <img
                src={urlFor(brand.image).width(90).height(90).url()}
                alt={brand.title}
                className="w-20 h-20 object-contain rounded-full border-2 border-amber-300 dark:border-yellow-500 bg-white shadow-sm"
              />
            )}
            <span className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 text-center">
              {brand.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brand;
