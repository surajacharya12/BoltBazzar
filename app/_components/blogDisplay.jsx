import React from "react";


function BlogDisplay() {
  return (
    <div className="flex flex-col items-center px-4 mt-10">
      <div className="w-full max-w-6xl bg-gradient-to-r from-amber-100 to-yellow-50 dark:from-amber-900 dark:to-yellow-800 shadow-xl rounded-2xl border border-amber-200 dark:border-amber-700 px-6 py-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
          Latest Blog Posts
        </h1>
        {/* Blog content will go here */}
      </div>
    </div>
  );
}
export default BlogDisplay;