import React from 'react';
import Image from 'next/image';
import bannerImage from '../../images/banner/download.png'; 
import rightBanner from '../../images/banner/banner_1.png';
import ProductGride from './ProductGride'; // assuming it's a local component
import Brand from './brand';
import Blog from './Blog';

function Home() {
  return (
    <div className="flex flex-col items-center px-4 mt-63 md:mt-65">
      <div className="w-full max-w-6xl md:max-w-7xl bg-gradient-to-r from-amber-100 to-yellow-50 dark:from-amber-900 dark:to-yellow-800 shadow-xl rounded-2xl border border-amber-200 dark:border-amber-700 px-6 py-6 md:py-6 flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-300">

        {/* Left Image */}
        <div className="hidden md:flex justify-center items-center flex-shrink-0">
          <Image
            src={bannerImage}
            alt="Left Banner"
            width={250}
            height={250}
            className="object-contain rounded-xl"
            priority
          />
        </div>

        {/* Center Text Content */}
        <div className="text-center md:text-left max-w-2xl flex-1">
          <h1 className="text-4xl font-extrabold mb-3 text-amber-700 dark:text-yellow-200 leading-tight tracking-tight">
            Your One-Stop Shop for Everything!
          </h1>

          <p className="text-lg text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">
            Explore the latest collections and unbeatable deals on fashion, electronics, home essentials, and more.
          </p>

          <div className="flex flex-wrap gap-3 mb-3 justify-center md:justify-start">
            <span className="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 text-sm font-semibold px-3 py-1 rounded-full">
              20% OFF
            </span>
            <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-sm font-semibold px-3 py-1 rounded-full">
              Free shipping on orders over $50
            </span>
          </div>

          <p className="hidden md:block text-sm text-gray-700 dark:text-gray-300 mb-2 leading-snug">
            Discover curated trends every season, personalized recommendations, and hand-picked items just for you.
            With thousands of products and daily deals, there's always something new to love.
          </p>

          <p className="hidden md:block text-sm text-gray-700 dark:text-gray-300 mb-6 leading-snug">
            Join our loyalty program and start earning rewards on every purchase. Shopping made smarter, just for you.
          </p>

          <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            Shop Now
          </button>
        </div>

        {/* Right Image */}
        <div className="hidden md:flex justify-center items-center flex-shrink-0">
          <Image
            src={rightBanner}
            alt="Right Banner"
            width={250}
            height={250}
            className="object-contain rounded-xl"
            priority
          />
        </div>
      </div>

      {/*  Grid Section */}
      <div className="w-full max-w-7xl mt-10">
        <ProductGride />
      </div>
      <div className="w-full max-w-7xl mt-10">
        <Brand />
      </div>
      <div className="w-full max-w-7xl mt-10">
        <Blog />
      </div>
    </div>
  );
}

export default Home;
