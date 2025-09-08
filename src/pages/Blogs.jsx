import React from "react";
import { MdDateRange } from "react-icons/md";
import { PageNav } from "../Components/PageNavigation";

function Blogs() {
  const blogPosts = [
    {
      title: "How to Get the Fastest Rides in Your City",
      excerpt: "Discover tips and tricks to get rides quickly and avoid waiting times...",
      date: "September 7, 2025",
    },
    {
      title: "Top 5 Safety Tips for Commuting",
      excerpt: "Your safety matters! Learn how to stay safe while using our services...",
      date: "August 25, 2025",
    },
    {
      title: "The Future of Urban Transportation",
      excerpt: "Explore how technology is transforming the way we travel in cities...",
      date: "August 10, 2025",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
         <PageNav/>
      {/* Header */}
      <div className="text-center mb-12 mt-16">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Blog</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Stay updated with our latest articles, news, and tips about urban commuting and services.
        </p>
      </div>

      {/* Blog Posts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogPosts.map((post, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center text-gray-500 text-sm mb-2">
              <MdDateRange className="w-5 h-5 mr-1" />
              <span>{post.date}</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-500 text-sm mb-4">{post.excerpt}</p>
            <a
              href="#"
              className="text-blue-500 font-medium hover:underline"
            >
              Read More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blogs;
