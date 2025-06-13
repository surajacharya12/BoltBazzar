'use client';

import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';

const blogquery = `*[_type == "blog"]|order(publishedAt desc){
  _id,
  title,
  slug,
  mainImage,
  publishedAt,
  "author": author->name,
  body,
}`;

function BlogDisplay() {
  const [blog, setBlog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.fetch(blogquery)
      .then((data) => {
        setBlog(data);
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
    <div className="items-center px-4 -mt-2">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
        Latest Blog Posts
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blog.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No blog posts found.</div>
        )}

        {blog.map((post) => (
          <div key={post._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col">
            {post.mainImage && (
              <img
                src={urlFor(post.mainImage).width(400).height(220).url()}
                alt={post.title}
                className="w-full h-44 object-cover rounded mb-4"
              />
            )}
            <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
            <div className="text-xs text-gray-500 mb-2">
              {post.author && <span>By {post.author}</span>}
              {post.publishedAt && (
                <span> &middot; {new Date(post.publishedAt).toLocaleDateString()}</span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {post.body && Array.isArray(post.body) && post.body[0]?.children?.[0]?.text
                ? post.body[0].children[0].text
                : 'No excerpt available.'}
            </p>
            <Link href={`/blog/${post.slug?.current}`} className="text-blue-500 hover:underline mt-auto">
              Read more
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogDisplay;
