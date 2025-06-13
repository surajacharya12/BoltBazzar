"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

const blogDetailQuery = (slug) => `*[_type == "blog" && slug.current == "${slug}"][0]{
  _id,
  title,
  slug,
  mainImage,
  publishedAt,
  "author": author->name,
  body,
  "categories": blogcategories[]->title
}`;

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);

  useEffect(() => {
    if (!slug) return;
    client.fetch(blogDetailQuery(slug))
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    client.fetch(`*[_type == "blogcategory"]{title, "count": count(*[_type=='blog' && references(^._id)])}`)
      .then(setCategories);
    client.fetch(`*[_type == 'blog' && slug.current != '${slug}']|order(publishedAt desc)[0...3]{_id, title, slug, mainImage}`)
      .then(setLatestBlogs);
  }, [slug]);

  if (loading) {
    return (

        <h1 className="text-4xl md:text-6xl font-extrabold text-white animate-pulse drop-shadow-lg tracking-widest">
          BoltBazzarr
        </h1>
  
    );
  }

  if (!blog) {
    return <div className="text-center text-gray-500 py-20 text-xl">Blog post not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <Link href="/blog" className="text-blue-600 hover:underline mb-6 inline-block text-sm font-medium">← Back to Blog</Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight tracking-tight">
          {blog.title}
        </h1>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex gap-2 items-center">
          {blog.author && <span>By {blog.author}</span>}
          {blog.publishedAt && (
            <span>&middot; {new Date(blog.publishedAt).toLocaleDateString()}</span>
          )}
        </div>

        {blog.mainImage && (
          <img
            src={urlFor(blog.mainImage).width(1000).height(500).url()}
            alt={blog.title}
            className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-md mb-8"
          />
        )}

        <div className="flex flex-wrap items-center gap-3 mb-8">
          {blog.publishedAt && (
            <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-1 rounded-full font-medium">
              {new Date(blog.publishedAt).toLocaleDateString()}
            </span>
          )}
          {blog.categories?.map((cat, idx) => (
            <span key={idx} className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 px-4 py-1 rounded-full font-semibold">
              {cat}
            </span>
          ))}
        </div>

        <div className="prose dark:prose-invert max-w-none prose-lg dark:text-gray-100">
          {blog.body?.map((block, idx) => {
            if (block._type === 'block' && block.children?.length > 0) {
              return <p key={idx}>{block.children.map((child) => child.text).join(' ')}</p>;
            }
            if (block._type === 'image' && block.asset) {
              return (
                <img
                  key={idx}
                  src={urlFor(block).width(800).url()}
                  alt={block.alt || 'Blog image'}
                  className="my-8 rounded-xl shadow-lg"
                />
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-8">
        {/* Categories */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Categories</h3>
          <ul className="space-y-3">
            {categories.map((cat, idx) => (
              <li key={idx} className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition">
                <span>{cat.title}</span>
                <span className="bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded-full text-xs font-bold">
                  {cat.count}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Latest Blogs */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Latest Blogs</h3>
          <ul className="space-y-5">
            {latestBlogs.map((b) => (
              <li key={b._id} className="flex items-start gap-4 group">
                {b.mainImage && (
                  <img
                    src={urlFor(b.mainImage).width(64).height(64).url()}
                    alt={b.title}
                    className="w-16 h-16 rounded-xl object-cover shadow-sm"
                  />
                )}
                <Link
                  href={`/blog/${b.slug?.current}`}
                  className="text-sm font-medium text-gray-700 dark:text-gray-100 group-hover:underline line-clamp-2"
                >
                  {b.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
