import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Globe, Users, Share2, ArrowRight } from "lucide-react";
import api from "../utils/api";

export default function LandingPage() {
  const [recentPosts, setRecentPosts] = useState([]);

  // Load latest posts
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/posts");
        // Sort by newest and get top 3
        const sorted = res.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setRecentPosts(sorted);
      } catch (e) {
        console.error("Error fetching posts:", e);
      }
    })();
  }, []);

  return (
    <div className="pt-16 bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col">
      {/* 🌐 Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row items-center justify-between text-center md:text-left px-6 md:px-16 py-20 gap-10"
      >
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">
            Connect, Share, and Grow with{" "}
            <span className="text-blue-600">LinkSphere</span>
          </h1>
          <p className="text-gray-600 max-w-lg text-lg">
            A simple and powerful social platform to share your thoughts,
            connect with friends, and explore inspiring stories.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2 justify-center"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition justify-center"
            >
              Login
            </Link>
          </div>
        </div>

        <motion.img
          src="https://illustrations.popsy.co/blue/idea-launch.svg"
          alt="Social Network"
          className="w-full max-w-md md:max-w-lg drop-shadow-xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
      </motion.section>

      {/* 🚀 Features Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Why Choose <span className="text-blue-600">LinkSphere?</span>
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[ 
              { icon: Globe, title: "Global Community", desc: "Connect with people around the world who share your passions." },
              { icon: Users, title: "Meaningful Connections", desc: "Build your network and engage with inspiring individuals." },
              { icon: Share2, title: "Share Freely", desc: "Express yourself with posts, images, and stories that matter." },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                whileHover={{ y: -5 }}
                className="bg-blue-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <Icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 📰 Recent Posts Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Latest from the <span className="text-blue-600">Community</span>
          </h2>

          {recentPosts.length === 0 ? (
            <p className="text-center text-gray-500">No posts yet.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {recentPosts.map((p, index) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 font-bold rounded-full">
                      {p.author.name[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{p.author.name}</h4>
                      <p className="text-gray-500 text-sm">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 line-clamp-3">{p.text}</p>
                  {p.imageUrl && (
                    <img
                      src={p.imageUrl}
                      alt="Post visual"
                      className="rounded-xl object-cover w-full h-48 mb-4"
                    />
                  )}
                  <Link
                    to="/feed"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    View Post →
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 💡 CTA Section */}
      <section className="bg-blue-600 text-white py-20 px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Start Your Journey on LinkSphere Today
        </motion.h2>
        <Link
          to="/register"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
        >
          Join Now
        </Link>
      </section>
    </div>
  );
}
