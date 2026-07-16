import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-600 hover:text-primary-500">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">Privacy Policy</span>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg p-8 md:p-12 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg md:text-xl opacity-90">
            Last updated: February 21, 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6 leading-relaxed">
              At Glowiva, we value your privacy and are committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, store, and protect your data when you use 
              our website and services.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">1.1 Personal Information</h3>
            <p className="text-gray-600 mb-4">When you use our services, we may collect:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
              <li><strong>Account Information:</strong> Name, email address, phone number, password</li>
              <li><strong>Delivery Information:</strong> Shipping address, billing address</li>
              <li><strong>Payment Information:</strong> Payment method details (processed securely)</li>
              <li><strong>Order History:</strong> Products purchased, order dates, amounts</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">1.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-4">
              <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, click patterns</li>
              <li><strong>Cookies:</strong> Small data files stored on your device</li>
              <li><strong>Location Data:</strong> General location based on IP address</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">We use your information for the following purposes:</p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">🛍️ Order Processing</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Process and fulfill your orders</li>
                  <li>• Send order confirmations</li>
                  <li>• Manage deliveries and returns</li>
                </ul>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">💬 Communication</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Respond to inquiries</li>
                  <li>• Send order updates</li>
                  <li>• Provide customer support</li>
                </ul>
              </div>
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">📊 Analytics</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Improve website performance</li>
                  <li>• Understand user behavior</li>
                  <li>• Enhance user experience</li>
                </ul>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">📧 Marketing</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Send promotional offers</li>
                  <li>• Notify about new products</li>
                  <li>• Share special discounts</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. How We Share Your Information</h2>
            <p className="text-gray-600 mb-4">We may share your information with:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-4">
              <li><strong>Delivery Partners:</strong> To fulfill and deliver your orders</li>
              <li><strong>Payment Processors:</strong> To process secure transactions</li>
              <li><strong>Service Providers:</strong> Who help us operate our business</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
            </ul>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-gray-700">
                <strong>Note:</strong> We never sell your personal information to third parties for their 
                marketing purposes.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Cookies and Tracking</h2>
            <p className="text-gray-600 mb-4">
              We use cookies and similar technologies to enhance your experience:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
              <li><strong>Essential Cookies:</strong> Required for website functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand website usage</li>
              <li><strong>Marketing Cookies:</strong> Used to show relevant advertisements</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <p className="text-gray-600 mb-6">
              You can control cookies through your browser settings. Note that disabling cookies may 
              affect website functionality.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate security measures to protect your information:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-4">
              <li>Secure SSL encryption for data transmission</li>
              <li>Regular security audits and updates</li>
              <li>Restricted access to personal information</li>
              <li>Secure password storage with encryption</li>
              <li>Firewall protection and intrusion detection</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Your Rights and Choices</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">You have the right to:</h3>
            <div className="space-y-3 mb-6">
              <div className="border-l-4 border-pink-600 pl-4">
                <p className="font-semibold text-gray-800">Access Your Data</p>
                <p className="text-gray-600">Request a copy of the personal information we hold about you</p>
              </div>
              <div className="border-l-4 border-purple-600 pl-4">
                <p className="font-semibold text-gray-800">Update Your Data</p>
                <p className="text-gray-600">Correct or update inaccurate information</p>
              </div>
              <div className="border-l-4 border-pink-600 pl-4">
                <p className="font-semibold text-gray-800">Delete Your Data</p>
                <p className="text-gray-600">Request deletion of your personal information (subject to legal requirements)</p>
              </div>
              <div className="border-l-4 border-purple-600 pl-4">
                <p className="font-semibold text-gray-800">Opt-Out of Marketing</p>
                <p className="text-gray-600">Unsubscribe from promotional emails at any time</p>
              </div>
              <div className="border-l-4 border-pink-600 pl-4">
                <p className="font-semibold text-gray-800">Object to Processing</p>
                <p className="text-gray-600">Object to certain uses of your personal information</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Data Retention</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-4">
              <li>We retain your information as long as necessary to provide our services</li>
              <li>Account information is kept until you request deletion</li>
              <li>Order history is retained for legal and accounting purposes</li>
              <li>Marketing data is kept until you opt out</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-600 mb-6">
              Our services are not intended for individuals under 18 years of age. We do not knowingly 
              collect personal information from children. If you believe a child has provided us with 
              personal information, please contact us immediately.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Third-Party Links</h2>
            <p className="text-gray-600 mb-6">
              Our website may contain links to third-party websites. We are not responsible for the 
              privacy practices of these websites. We encourage you to review their privacy policies 
              before providing any personal information.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Changes to Privacy Policy</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-4">
              <li>We may update this Privacy Policy periodically</li>
              <li>Changes will be posted on this page with an updated date</li>
              <li>Significant changes will be communicated via email</li>
              <li>Your continued use implies acceptance of the updated policy</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              For questions about this Privacy Policy or to exercise your rights, please contact us:
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
                <p className="flex items-center text-gray-700">
                  <span className="mr-2 text-2xl">📍</span>
                  <span><strong>Address:</strong> Dhaka, Bangladesh</span>
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-pink-50 border-l-4 border-pink-600 rounded">
              <p className="text-gray-700">
                <strong>Your Privacy Matters:</strong> We are committed to protecting your privacy and 
                handling your data responsibly. If you have any concerns about how we handle your 
                information, please don't hesitate to reach out to us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
