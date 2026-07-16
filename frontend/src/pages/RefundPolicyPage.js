import React from 'react';
import { Link } from 'react-router-dom';

const RefundPolicyPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-600 hover:text-primary-500">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">Refund and Return Policy</span>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg p-8 md:p-12 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Refund and Return Policy</h1>
          <p className="text-lg md:text-xl opacity-90">
            Last updated: February 21, 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6 leading-relaxed">
              At Glowiva, we are committed to ensuring your complete satisfaction with every purchase. 
              This Refund and Return Policy outlines the terms and conditions for returns, exchanges, 
              and refunds.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Return Eligibility</h2>
            <p className="text-gray-600 mb-4">
              You may return products within <strong>7 days</strong> of receiving your order if:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-4">
              <li>The product is damaged or defective</li>
              <li>You received the wrong product</li>
              <li>The product is significantly different from its description</li>
              <li>The packaging is unsealed or tampered with during transit</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Non-Returnable Items</h2>
            <p className="text-gray-600 mb-4">
              For hygiene and safety reasons, the following items cannot be returned:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-4">
              <li>Opened or used beauty and skincare products</li>
              <li>Products with broken seals or damaged packaging (unless damaged during shipping)</li>
              <li>Items marked as final sale or clearance</li>
              <li>Products purchased during special promotional events (unless defective)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Return Process</h2>
            <div className="bg-pink-50 border-l-4 border-pink-600 p-4 mb-6">
              <p className="text-gray-700 mb-4"><strong>Step 1: Contact Us</strong></p>
              <p className="text-gray-600 mb-4">
                Contact our customer service team within 7 days of receiving your order:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Phone: +8801314893055</li>
                <li>Email: studycrip@gmail.com</li>
                <li>Provide your order number, product details, and reason for return</li>
              </ul>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mb-6">
              <p className="text-gray-700 mb-4"><strong>Step 2: Approval</strong></p>
              <p className="text-gray-600">
                Our team will review your request and provide return authorization and instructions 
                within 24-48 hours.
              </p>
            </div>

            <div className="bg-pink-50 border-l-4 border-pink-600 p-4 mb-6">
              <p className="text-gray-700 mb-4"><strong>Step 3: Ship the Product</strong></p>
              <p className="text-gray-600 mb-4">
                Once approved, carefully package the product with:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Original packaging (if available)</li>
                <li>All accessories and documentation</li>
                <li>Copy of the invoice or order confirmation</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Refund Options</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Full Refund</h3>
                <p className="text-gray-600">
                  If the product is defective, damaged, or incorrect, you'll receive a full refund 
                  including shipping costs.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Exchange</h3>
                <p className="text-gray-600">
                  We can exchange the product for the same item or provide store credit for a 
                  different product.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Refund Processing</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-4">
              <li>Refunds are processed within <strong>7-10 business days</strong> after receiving the returned item</li>
              <li>Refunds will be issued to the original payment method</li>
              <li>For Cash on Delivery orders, refunds will be issued via bank transfer or mobile banking</li>
              <li>You will receive an email confirmation once your refund has been processed</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping Costs</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-4">
              <li>If the return is due to our error (wrong/defective product), we cover return shipping</li>
              <li>For other returns, the customer is responsible for return shipping costs</li>
              <li>Original shipping charges are non-refundable unless the error was ours</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Damaged or Defective Products</h2>
            <p className="text-gray-600 mb-4">
              If you receive a damaged or defective product:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-4">
              <li>Take photos/videos of the damaged product and packaging</li>
              <li>Contact us immediately within 48 hours of delivery</li>
              <li>We will arrange for a replacement or full refund at no additional cost to you</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Important Notes</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Please inspect your order upon delivery and report any issues immediately</li>
                <li>Keep the original packaging until you're satisfied with your purchase</li>
                <li>Glowiva reserves the right to refuse returns that don't meet our policy criteria</li>
                <li>This policy may be updated periodically; please review it before making a purchase</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              For any questions about our Refund and Return Policy, please contact us:
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
