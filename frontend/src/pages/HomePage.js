import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import CategoryGrid from '../components/CategoryGrid';
import BrandSlider from '../components/BrandSlider';
import TestimonialsSlider from '../components/TestimonialsSlider';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [banners, setBanners] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkinType, setSelectedSkinType] = useState('oily');
  const [skinTypeProducts, setSkinTypeProducts] = useState([]);

  // Helper function to get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"%3E%3Crect fill=\"%23f0f0f0\" width=\"100\" height=\"100\"/%3E%3Ctext x=\"50%25\" y=\"50%25\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"sans-serif\" font-size=\"14\" fill=\"%23999\"%3ENo Image%3C/text%3E%3C/svg%3E';
    if (imageUrl.startsWith('http')) return imageUrl;
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return baseUrl.replace(/\/api\/?$/, '') + imageUrl;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch banners
        const { data: bannersData } = await api.get('/banners');
        setBanners(bannersData.data || bannersData || []);

        // Fetch featured products
        const { data: featured } = await api.get('/products?featured=true&limit=8');
        setFeaturedProducts(featured.data);

        // Fetch best sellers
        const { data: sellers } = await api.get('/products?bestSeller=true&limit=8');
        setBestSellers(sellers.data);

        // Fetch new arrivals
        const { data: arrivals } = await api.get('/products?newArrival=true&limit=8');
        setNewArrivals(arrivals.data);

        // Fetch testimonials
        const { data: testimonialsData } = await api.get('/testimonials');
        setTestimonials(testimonialsData.data || testimonialsData || []);

        // Fetch products for initial skin type (oily)
        const { data: skinData } = await api.get(`/products?skinType=oily&limit=8`);
        setSkinTypeProducts(skinData.data || []);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSkinTypeClick = async (skinType) => {
    setSelectedSkinType(skinType);
    try {
      const { data } = await api.get(`/products?skinType=${skinType}&limit=8`);
      setSkinTypeProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching skin type products:', error);
      setSkinTypeProducts([]);
    }
  };

  const bannerSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
  };

  return (
    <div className="home-page pb-20 md:pb-0">
      {/* Hero Banner Slider */}
      <section className="hero-section w-full relative">
        {banners.length > 0 ? (
          <Slider {...bannerSettings}>
            {banners.map((banner) => (
              <div key={banner._id}>
                <Link to="/products" className="block cursor-pointer">
                {banner.image ? (
                  <div className="relative overflow-hidden">
                    <picture>
                      {banner.mobileImage && (
                        <source media="(max-width: 639px)" srcSet={getImageUrl(banner.mobileImage)} />
                      )}
                      <img
                        src={getImageUrl(banner.image)}
                        alt={banner.title || 'Banner'}
                        className="w-full block"
                        style={{ imageRendering: 'auto', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
                        loading="eager"
                      />
                    </picture>
                    {(banner.title || banner.subtitle || banner.description) && (
                      <div className="absolute inset-0 flex items-center">
                        <div className="container mx-auto px-4">
                          <div className="max-w-2xl">
                            {banner.title && (
                              <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-3 md:mb-4 text-white drop-shadow-lg">
                                {banner.title}
                              </h2>
                            )}
                            {banner.subtitle && (
                              <p className="text-lg md:text-xl lg:text-2xl mb-3 md:mb-4 text-white drop-shadow-lg">
                                {banner.subtitle}
                              </p>
                            )}
                            {banner.description && (
                              <p className="text-sm md:text-base lg:text-lg mb-4 md:mb-6 text-white drop-shadow-lg">
                                {banner.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-[200px] sm:h-[280px] md:h-[380px] lg:h-[500px]" style={{ backgroundColor: '#f3e8ff' }}></div>
                )}
                </Link>
              </div>
            ))}
          </Slider>
        ) : (
          <Link to="/products" className="block cursor-pointer bg-gradient-to-r from-pink-100 to-purple-100 h-[240px] md:h-[380px] lg:h-[500px] w-full flex items-center">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-3 md:mb-4">
                Welcome to <span className="text-primary-500">Glowiva</span>
              </h2>
              <p className="text-base md:text-xl mb-4 md:mb-6">Shop authentic Korean and international beauty products</p>
            </div>
          </Link>
        )}
      </section>

      {/* Shop By Category */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Shop By Category</h2>
          <CategoryGrid />
        </div>
      </section>

      {/* Top Selling Products */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">TOP SELLING PRODUCT</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrival Products */}
      {newArrivals.length > 0 && (
        <section className="py-8 md:py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">New Arrival Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shop By Skin Type */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Shop By Skin Type</h2>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8">
            <button 
              onClick={() => handleSkinTypeClick('oily')}
              className={`px-4 md:px-6 py-2 border-2 rounded-full transition-all text-xs md:text-base ${
                selectedSkinType === 'oily' 
                  ? 'border-pink-600 bg-pink-600 text-white' 
                  : 'border-gray-300 hover:border-pink-600 hover:text-pink-600'
              }`}
            >
              OILY
            </button>
            <button 
              onClick={() => handleSkinTypeClick('dry')}
              className={`px-4 md:px-6 py-2 border-2 rounded-full transition-all text-xs md:text-base ${
                selectedSkinType === 'dry' 
                  ? 'border-pink-600 bg-pink-600 text-white' 
                  : 'border-gray-300 hover:border-pink-600 hover:text-pink-600'
              }`}
            >
              DRY
            </button>
            <button 
              onClick={() => handleSkinTypeClick('combination')}
              className={`px-4 md:px-6 py-2 border-2 rounded-full transition-all text-xs md:text-base ${
                selectedSkinType === 'combination' 
                  ? 'border-pink-600 bg-pink-600 text-white' 
                  : 'border-gray-300 hover:border-pink-600 hover:text-pink-600'
              }`}
            >
              COMBINATION
            </button>
            <button 
              onClick={() => handleSkinTypeClick('sensitive')}
              className={`px-4 md:px-6 py-2 border-2 rounded-full transition-all text-xs md:text-base ${
                selectedSkinType === 'sensitive' 
                  ? 'border-pink-600 bg-pink-600 text-white' 
                  : 'border-gray-300 hover:border-pink-600 hover:text-pink-600'
              }`}
            >
              SENSITIVE
            </button>
            <button 
              onClick={() => handleSkinTypeClick('normal')}
              className={`px-4 md:px-6 py-2 border-2 rounded-full transition-all text-xs md:text-base ${
                selectedSkinType === 'normal' 
                  ? 'border-pink-600 bg-pink-600 text-white' 
                  : 'border-gray-300 hover:border-pink-600 hover:text-pink-600'
              }`}
            >
              NORMAL
            </button>
            <button 
              onClick={() => handleSkinTypeClick('all')}
              className={`hidden md:inline-block px-6 py-2 border-2 rounded-full transition-all text-xs md:text-base ${
                selectedSkinType === 'all' 
                  ? 'border-pink-600 bg-pink-600 text-white' 
                  : 'border-gray-300 hover:border-pink-600 hover:text-pink-600'
              }`}
            >
              ALL SKIN TYPE
            </button>
          </div>
          {skinTypeProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {skinTypeProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No products available for this skin type yet.
            </div>
          )}
        </div>
      </section>

      {/* Brands to Know */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">BRANDS TO KNOW</h2>
          <BrandSlider />
        </div>
      </section>

      {/* Customer Feedback / Testimonials */}
      {testimonials.length > 0 && (
        <TestimonialsSlider testimonials={testimonials} />
      )}
    </div>
  );
};

export default HomePage;
