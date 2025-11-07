import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Github, Linkedin, Mail, Link2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-700 mt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-blue-600 mb-3"
            >
              <Link2 className="w-5 h-5" />
              LinkSphere
            </Link>
            <p className="text-sm text-gray-500">
              Connect, share, and explore links that matter.  
              Your digital network in one sphere.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-blue-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-600 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-blue-600 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/blog"
                  className="hover:text-blue-600 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-blue-600 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="hover:text-blue-600 transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-blue-50 transition"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-blue-50 transition"
              >
                <Twitter className="w-5 h-5 text-blue-400" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-blue-50 transition"
              >
                <Github className="w-5 h-5 text-gray-800" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-blue-50 transition"
              >
                <Linkedin className="w-5 h-5 text-blue-700" />
              </a>
              <a
                href="mailto:support@linksphere.com"
                className="p-2 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-blue-50 transition"
              >
                <Mail className="w-5 h-5 text-red-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} LinkSphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
