"use client";
import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';


const allProductsQuery = `*[_type == 'product']|order(name asc){
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
  brand->{title}
}`;

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    client.fetch(allProductsQuery)
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    client.fetch(`*[_type == 'category']{title}`)
      .then((data) => setCategories(data.map(c => c.title)));

    client.fetch(`*[_type == 'brand']{title}`)
      .then((data) => setBrands(data.map(b => b.title)));
  }, []);

  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory && categories.includes(urlCategory) && !selectedCategories.includes(urlCategory)) {
      setSelectedCategories([urlCategory]);
    }
  }, [categories, searchParams]);

  const filteredProducts = products.filter((product) => {
    if (selectedCategories.length > 0 && !product.category?.some((cat) => selectedCategories.includes(cat))) {
      return false;
    }
    if (selectedBrands.length > 0 && (!product.brand || !selectedBrands.includes(product.brand.title))) {
      return false;
    }
    return true;
  });

  const addToFavorites = (product) => {
    setFavorites((prev) => [...prev, product]);
  };

  const removeFromFavorites = (id) => {
    setFavorites((prev) => prev.filter((fav) => fav._id !== id));
  };

  if (loading) {
    return (
      <h1 className="text-4xl md:text-6xl font-extrabold text-white animate-pulse drop-shadow-lg tracking-widest">
        BoltBazzarr
      </h1>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 md:py-10 -mt-20">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-amber-600">All Products</h1>
        <button
          className="px-4 py-2 rounded bg-amber-600 text-white font-semibold shadow"
          onClick={() => setSidebarOpen((open) => !open)}
        >
          {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-10">
        {/* Sidebar */}
        <aside
          className={`md:col-span-1 bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col gap-8 h-fit sticky top-24 z-10
            ${sidebarOpen ? 'block' : 'hidden'} md:block`}
        >
          <div>
            <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">Product Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat, idx) => (
                <li key={cat ? String(cat) : `cat-${idx}` } className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() =>
                      setSelectedCategories(selectedCategories.includes(cat)
                        ? selectedCategories.filter(c => c !== cat)
                        : [...selectedCategories, cat])
                    }
                    className="accent-amber-500"
                  />
                  <span>{cat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">Brands</h3>
            <ul className="space-y-2">
              {brands.map((brand) => (
                <li key={brand} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() =>
                      setSelectedBrands(selectedBrands.includes(brand)
                        ? selectedBrands.filter(b => b !== brand)
                        : [...selectedBrands, brand])
                    }
                    className="accent-amber-500"
                  />
                  <span>{brand}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        {/* Product Grid */}
        <div className="md:col-span-4">
          <h1 className="hidden md:block text-3xl font-bold mb-8 text-amber-600">All Products</h1>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {filteredProducts.map((product) => {
                const imageUrl =
                  product.images && product.images.length > 0
                    ? urlFor(product.images[0]).url()
                    : "/placeholder.jpg";
                const hasOldPrice = product.oldPrice && product.oldPrice > product.price;

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
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-2">
                        {product.category?.join(", ") || "Categories"}
                      </p>
                      <div className="flex items-baseline gap-2 mt-auto">
                        {hasOldPrice && (
                          <span className="text-sm line-through text-gray-400">
                            ${product.oldPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                          ${product.price.toFixed(2)}
                        </span>
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
            <div className="text-center text-gray-500 text-lg">No products found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;
