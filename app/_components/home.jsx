import React from 'react'
import Image from 'next/image'
import bannerImage from '../../images/banner/download.png'

function Home() {
  return (
    <div className="flex justify-center mt-60 md:mt-70 px-4">
      <div className="w-full max-w-6xl md:max-w-7xl bg-gradient-to-r from-amber-100 to-yellow-50 dark:from-amber-900 dark:to-yellow-800 shadow-xl rounded-2xl border border-amber-200 dark:border-amber-700 px-10 py-6 md:py-6 flex flex-col md:flex-row items-center gap-12 transition-all duration-300">

        {/* Image Section */}
        <div className="hidden md:flex justify-center items-center flex-shrink-0">
          <Image
            src={bannerImage}
            alt="E-commerce banner"
            width={320}
            height={60}
            className="object-contain"
            priority
          />
        </div>

        {/* Text Content */}
        <div className="text-center md:text-left max-w-2xl">
          <h1 className="text-4xl font-extrabold mb-3 text-amber-700 dark:text-yellow-200 leading-tight tracking-tight">
            Your One-Stop Shop for Everything!
          </h1>

          <p className="text-lg text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">
            Explore the latest collections and unbeatable deals on fashion, electronics, home essentials, and more.
          </p>

          <p className="text-md text-amber-600 dark:text-yellow-300 font-semibold mb-3">
            Free shipping on orders over $50 & easy returns.
          </p>

          {/* Extra text for desktop only */}
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
      </div>

    </div>
  )
}

export default Home
