import React from 'react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-600 hover:text-primary-500">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">Terms & Conditions</span>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg p-8 md:p-12 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-lg md:text-xl opacity-90">
            Last updated: February 21, 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6 leading-relaxed">
              Welcome to Glowiva. By accessing and using our website, you agree to comply with and 
              be bound by the following terms and conditions. Please read these terms carefully before 
              using our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              By accessing or using Glowiva's website and services, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms & Conditions. If you do not agree with 
              any part of these terms, you must not use our website.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Use of Website</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Eligibility</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
              <li>You must be at least 18 years old to make purchases on our website</li>
              <li>You must provide accurate and complete information during registration</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Account Security</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-4">
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>You are responsible for all activities that occur under your account</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Product Information</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-4">
              <li>We strive to display product colors and images as accurately as possible</li>
              <li>Actual colors may vary slightly due to screen settings</li>
              <li>Product descriptions are provided for informational purposes</li>
              <li>We reserve the right to limit quantities of any products or services</li>
              <li>All products are subject to availability</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Pricing and Payment</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Pricing</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
              <li>All prices are listed in Bangladeshi Taka (BDT)</li>
              <li>Prices are subject to change without notice</li>
              <li>We reserve the right to correct pricing errors</li>
              <li>The price charged will be the price displayed at the time of your order</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Payment Methods</h3>
            <p className="text-gray-600 mb-4">We accept the following payment methods:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-4">
              <li>Cash on Delivery (COD)</li>
              <li>bKash</li>
              <li>Nagad</li>
              <li>Bank Transfer</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Orders and Delivery</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Order Processing</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
              <li>Orders are processed within 1-2 business days</li>
              <li>You will receive order confirmation via email</li>
              <li>We reserve the right to refuse or cancel any order</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Delivery</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-4">
              <li>Delivery time varies by location (typically 3-7 business days)</li>
              <li>Delivery charges apply based on location and order value</li>
              <li>Please ensure accurate delivery information is provided</li>
              <li>We are not responsible for delays caused by incorrect addresses</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Returns and Refunds</h2>
            <p className="text-gray-600 mb-4">
              Our return and refund policy is detailed separately. Please refer to our 
              <Link to="/refund-policy" className="text-pink-600 hover:underline"> Refund and Return Policy </Link>
              for complete information.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-4">
              <li>Returns must be initiated within 7 days of delivery</li>
              <li>Products must be in original, unopened condition</li>
              <li>Refunds are processed within 7-10 business days</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Intellectual Property</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-4">
              <li>All content on this website is owned by Glowiva or its licensors</li>
              <li>You may not reproduce, distribute, or modify any content without permission</li>
              <li>Product images and descriptions are protected by copyright</li>
              <li>Brand names and logos belong to their respective owners</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Prohibited Activities</h2>
            <p className="text-gray-600 mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-4">
              <li>Use the website for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Transmit viruses or malicious code</li>
              <li>Interfere with the proper functioning of the website</li>
              <li>Impersonate another person or entity</li>
              <li>Collect user information without consent</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Limitation of Liability</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Glowiva is not liable for indirect, incidental, or consequential damages</li>
                <li>Our liability is limited to the amount paid for the product in question</li>
                <li>We are not responsible for delays or failures due to circumstances beyond our control</li>
                <li>Product results may vary; we make no guarantees about specific outcomes</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Product Authenticity</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-4">
              <li>We guarantee 100% authentic products from authorized sources</li>
              <li>If you receive a counterfeit product, contact us immediately</li>
              <li>We will investigate and take appropriate action</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Privacy</h2>
            <p className="text-gray-600 mb-6">
              Your privacy is important to us. Please review our 
              <Link to="/privacy" className="text-pink-600 hover:underline"> Privacy Policy </Link>
              to understand how we collect, use, and protect your personal information.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Modifications to Terms</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-4">
              <li>We reserve the right to modify these terms at any time</li>
              <li>Changes will be effective immediately upon posting</li>
              <li>Your continued use of the website constitutes acceptance of modified terms</li>
              <li>We recommend reviewing these terms periodically</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">13. Governing Law</h2>
            <p className="text-gray-600 mb-6">
              These terms are governed by the laws of Bangladesh. Any disputes will be resolved 
              in the courts of Dhaka, Bangladesh.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">14. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              For questions about these Terms & Conditions, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-2">
                <p className="flex items-center text-gray-700">
                  <span className="mr-2 text-2xl">📞</span>
                  <span><strong>Phone:</strong> +8801314893055</span>
                </p>
                <p className="flex items-center text-gray-700">
                  <span className="mr-2 text-2xl">✉️</span>
                  <span><strong>Email:</strong> studycrip@gmail.com</span>
                </p>
                <p className="flex items-center text-gray-700">
                  <span className="mr-2 text-2xl">⏰</span>
                  <span><strong>Business Hours:</strong> 9 AM - 9 PM (Daily)</span>
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-pink-50 border-l-4 border-pink-600 rounded">
              <p className="text-gray-700">
                <strong>Note:</strong> By placing an order or using our services, you acknowledge that 
                you have read, understood, and agree to these Terms & Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
