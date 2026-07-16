import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaTiktok } from 'react-icons/fa';
import api from '../../utils/api';

const Footer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      const categoriesArray = Array.isArray(data) ? data : (data.data || data.categories || []);
      // Filter to get only parent categories (no parentCategory) and regular type
      const parentCategories = categoriesArray.filter(cat => !cat.parentCategory && cat.type === 'regular');
      setCategories(parentCategories.slice(0, 5)); // Limit to 5 categories
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  return (
    <footer className="bg-gray-50 mt-16 mb-16 md:mb-0">
      {/* Main Footer Content */}
      <div className="bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* About Section */}
            <div>
              <div className="flex items-center mb-3 md:mb-4">
                <img src="/logo-glowiva.png" alt="Glowiva" className="h-12 md:h-14 w-auto object-contain" />
                <span className="ml-1 text-xl md:text-2xl font-bold tracking-wide" style={{ color: '#4a5e3b' }}>GLOWIVA</span>
              </div>
              <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
                Glowiva is a refined destination for premium beauty and skincare, curating authentic, high-quality products from trusted global brands. We are committed to elegance, excellence, and delivering a seamless luxury shopping experience with care and sophistication.
              </p>
              <div className="mb-3 md:mb-4">
                <p className="flex items-center text-gray-700 mb-2 text-sm">
                  <span className="mr-2">📞</span>
                  <span>Phone: +8801314893055</span>
                </p>
                <p className="flex items-center text-gray-700 text-sm">
                  <span className="mr-2">✉️</span>
                  <span>Email: studycrip@gmail.com</span>
                </p>
              </div>
            </div>

            {/* Useful Links */}
            <div>
              <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">Quick Links</h3>
              <ul className="space-y-1.5 md:space-y-2 text-sm md:text-base">
                <li><Link to="/about" className="text-gray-600 hover:text-primary-500">About Us</Link></li>
                <li><Link to="/refund-policy" className="text-gray-600 hover:text-primary-500">Refund and Return Policy</Link></li>
                <li><Link to="/terms" className="text-gray-600 hover:text-primary-500">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="text-gray-600 hover:text-primary-500">Privacy Policy</Link></li>
                <li><Link to="/track-order" className="text-gray-600 hover:text-primary-500">Track Order</Link></li>
              </ul>
            </div>

            {/* Footer Menu */}
            <div>
              <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">Categories</h3>
              <ul className="space-y-1.5 md:space-y-2 text-sm md:text-base">
                {categories.length > 0 ? (
                  <>
                    {categories.map((category) => (
                      <li key={category._id}>
                        <Link 
                          to={`/category/${category.slug}`} 
                          className="text-gray-600 hover:text-primary-500"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                    <li><Link to="/products" className="text-gray-600 hover:text-primary-500">All Products</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/products" className="text-gray-600 hover:text-primary-500">Shop All</Link></li>
                    <li><Link to="/offers" className="text-gray-600 hover:text-primary-500">Offers</Link></li>
                    <li><Link to="/combo" className="text-gray-600 hover:text-primary-500">Combo Deals</Link></li>
                  </>
                )}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">Social Links:</h3>
              <div className="flex space-x-2 md:space-x-3">
                <a
                  href="https://www.facebook.com/glowiva"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon social-icon-facebook"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://www.instagram.com/glowiva.1?igsh=dWl5Yzc0YmJ0bjk5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon social-icon-instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon social-icon-youtube"
                >
                  <FaYoutube />
                </a>
                <a
                  href="https://wa.me/01601266599"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon social-icon-whatsapp"
                >
                  <FaWhatsapp />
                </a>
                <a
                  href="https://www.tiktok.com/@glowiva.1?_r=1&_t=ZS-93YY1ezY0Kw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon social-icon-tiktok"
                >
                  <FaTiktok />
                </a>
              </div>

              {/* Payment Methods */}
              <div className="mt-4 md:mt-6">
                <h4 className="text-xs md:text-sm font-semibold mb-2 md:mb-3">We Accept:</h4>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {/* Add payment method logos */}
                  <div className="text-[10px] md:text-xs bg-white px-1.5 py-1 md:px-2 md:py-1 rounded border">Cash on Delivery</div>
                  <div className="text-[10px] md:text-xs bg-white px-1.5 py-1 md:px-2 md:py-1 rounded border">bKash</div>
                  <div className="text-[10px] md:text-xs bg-white px-1.5 py-1 md:px-2 md:py-1 rounded border">Nagad</div>
                  <div className="text-[10px] md:text-xs bg-white px-1.5 py-1 md:px-2 md:py-1 rounded border">Bank</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-100 py-3 md:py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-gray-600 gap-2 md:gap-0">
            <p>Copyright © 2025 Glowiva - All Rights Reserved.</p>
            <p>
              Developed by <a href="#" className="text-primary-500 hover:underline">MH45</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
