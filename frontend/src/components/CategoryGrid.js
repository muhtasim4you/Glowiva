import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    // If it's a relative path, prepend the backend URL
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return baseUrl.replace(/\/api\/?$/, '') + imageUrl;
  };

  // Fallback icons for categories without images
  const categoryIcons = {
    'cleanser': '🧴',
    'moisturizer': '💧',
    'serum': '✨',
    'sunscreen': '☀️',
    'toner': '💦',
    'facial-washes': '🧼',
    'exfoliator': '🌸',
    'eye-cream': '👁️'
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        const allCategories = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
        
        // Find the SKINCARE parent category
        const skincareParent = allCategories.find(
          cat => cat.name.toLowerCase() === 'skincare' || cat.name.toLowerCase() === 'skin care'
        );
        
        // Filter to get child categories of SKINCARE
        let childCategories = [];
        if (skincareParent) {
          childCategories = allCategories.filter(
            cat => cat.parentCategory && 
            (cat.parentCategory._id === skincareParent._id || cat.parentCategory === skincareParent._id)
          );
        }
        
        // If no skincare parent found, get all categories without parents as fallback
        if (childCategories.length === 0) {
          childCategories = allCategories.filter(cat => !cat.parentCategory);
        }
        
        setCategories(childCategories.slice(0, 5)); // Get top 5 subcategories
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: Horizontal Scroll */}
      <div className="md:hidden overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 pb-2" style={{ scrollSnapType: 'x mandatory' }}>
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/category/${category.slug}`}
              className="text-center flex-shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="relative w-28 h-28 mx-auto mb-2 rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg transition-all duration-300 active:scale-95">
                {category.image ? (
                  <img
                    src={getImageUrl(category.image)}
                    alt={category.name}
                    width={112}
                    height={112}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-4xl ${category.image ? 'hidden' : 'flex'}`}
                >
                  {categoryIcons[category.slug] || '🎯'}
                </div>
              </div>
              <h3 className="font-bold text-xs text-gray-800 uppercase max-w-[112px]">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/category/${category.slug}`}
            className="text-center group"
          >
            <div className="relative w-36 h-36 lg:w-40 lg:h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg transition-all duration-300 hover:border-pink-500 hover:shadow-xl">
              {category.image ? (
                <img
                  src={getImageUrl(category.image)}
                  alt={category.name}
                  width={160}
                  height={160}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-5xl ${category.image ? 'hidden' : 'flex'}`}
              >
                {categoryIcons[category.slug] || '🎯'}
              </div>
            </div>
            <h3 className="font-bold text-sm md:text-base text-gray-800 uppercase group-hover:text-pink-600 transition-colors">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </>
  );
};

export default CategoryGrid;
