import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const BrandSlider = () => {
  const [brands, setBrands] = useState([]);

  // Helper function to get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return baseUrl.replace(/\/api\/?$/, '') + imageUrl;
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data } = await api.get('/brands');
        setBrands(data.data || []);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    fetchBrands();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  // Default brands if API doesn't return any
  const defaultBrands = [
    { name: 'WishCare', slug: 'wishcare' },
    { name: 'Derma Co', slug: 'derma-co' },
    { name: 'Skin1004', slug: 'skin1004' },
    { name: 'Simple', slug: 'simple' },
    { name: 'MISSHA', slug: 'missha' }
  ];

  const displayBrands = brands.length > 0 ? brands : defaultBrands;

  const handleImageError = (e, brandName) => {
    e.target.style.display = 'none';
    const fallback = e.target.parentElement.querySelector('.brand-name-fallback');
    if (fallback) {
      fallback.style.display = 'flex';
    }
  };

  return (
    <div className="brand-slider">
      <Slider {...settings}>
        {displayBrands.map((brand, index) => (
          <div key={brand._id || index} className="px-3">
            <Link
              to={`/brand/${brand.slug}`}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="relative h-20">
                {brand.logo && (
                  <img
                    src={getImageUrl(brand.logo)}
                    alt={brand.name}
                    className="w-full h-full object-contain"
                    onError={(e) => handleImageError(e, brand.name)}
                    loading="lazy"
                  />
                )}
                <div 
                  className="brand-name-fallback h-20 flex items-center justify-center absolute top-0 left-0 right-0"
                  style={{ display: brand.logo ? 'none' : 'flex' }}
                >
                  <span className="text-xl font-bold text-gray-700">{brand.name}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BrandSlider;
