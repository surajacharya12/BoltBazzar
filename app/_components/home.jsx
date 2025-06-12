import React from 'react'

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to BoltBazzarr</h1>
      <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 mb-6">
        Discover the best deals, trending products, and more!
      </p>
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <a href="/shop" className="px-6 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition">
          Shop Now
        </a>
        <a href="/blog" className="px-6 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition">
          Read Blog
        </a>
      </div>
    </div>
  )
}

export default Home