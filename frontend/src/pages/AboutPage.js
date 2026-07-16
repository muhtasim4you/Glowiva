import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-600 hover:text-primary-500">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">About Us</span>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg p-8 md:p-12 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">About Glowiva</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl">
            Your trusted destination for authentic beauty and skincare products
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Who We Are</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Glowiva is a refined destination for premium beauty and skincare, curating authentic, 
              high-quality products from trusted global brands. We are committed to elegance, excellence, 
              and delivering a seamless luxury shopping experience with care and sophistication.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our mission is to empower individuals to look and feel their best by providing access to 
              premium beauty and skincare products. We believe that everyone deserves to experience the 
              confidence that comes with quality skincare routines and authentic products.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="border-l-4 border-pink-600 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">100% Authentic Products</h3>
                <p className="text-gray-600">
                  We guarantee the authenticity of all our products, sourced directly from authorized 
                  distributors and brands.
                </p>
              </div>
              <div className="border-l-4 border-pink-600 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Curated Selection</h3>
                <p className="text-gray-600">
                  Our team carefully selects each product to ensure it meets our high standards of 
                  quality and effectiveness.
                </p>
              </div>
              <div className="border-l-4 border-pink-600 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Expert Guidance</h3>
                <p className="text-gray-600">
                  Our knowledgeable team is always ready to help you find the perfect products for 
                  your skin type and concerns.
                </p>
              </div>
              <div className="border-l-4 border-pink-600 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast & Reliable Delivery</h3>
                <p className="text-gray-600">
                  We ensure your products reach you quickly and safely, with careful packaging and 
                  tracking available.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Values</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li><strong>Authenticity:</strong> We only sell genuine products from authorized sources</li>
              <li><strong>Quality:</strong> Every product is carefully selected and inspected</li>
              <li><strong>Customer Care:</strong> Your satisfaction is our top priority</li>
              <li><strong>Transparency:</strong> We believe in honest communication and clear information</li>
              <li><strong>Innovation:</strong> We continuously update our selection with the latest and best products</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Get In Touch</h2>
            <p className="text-gray-600 mb-4">
              Have questions or need assistance? Our team is here to help!
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="flex items-center text-gray-700 mb-2">
                    <span className="mr-2 text-2xl">📞</span>
                    <span><strong>Phone:</strong> +8801314893055</span>
                  </p>
                  <p className="flex items-center text-gray-700">
                    <span className="mr-2 text-2xl">✉️</span>
                    <span><strong>Email:</strong> studycrip@gmail.com</span>
                  </p>
                </div>
                <div>
                  <p className="flex items-center text-gray-700 mb-2">
                    <span className="mr-2 text-2xl">⏰</span>
                    <span><strong>Business Hours:</strong> 9 AM - 9 PM (Daily)</span>
                  </p>
                  <p className="flex items-center text-gray-700">
                    <span className="mr-2 text-2xl">📍</span>
                    <span><strong>Location:</strong> Dhaka, Bangladesh</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Ready to Start Your Beauty Journey?
          </h2>
          <p className="text-gray-600 mb-6">
            Explore our collection of premium beauty and skincare products
          </p>
          <Link
            to="/products"
            className="inline-block bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition-colors font-semibold"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
