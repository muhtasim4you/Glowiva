import React from 'react';
import Slider from 'react-slick';
import { FaStar } from 'react-icons/fa';

const TestimonialsSlider = ({ testimonials }) => {
  // Helper function to get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return baseUrl.replace(/\/api\/?$/, '') + imageUrl;
  };

  const settings = {
    dots: true,
    infinite: testimonials.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, testimonials.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, testimonials.length),
          slidesToScroll: 1,
          infinite: testimonials.length > 2,
          dots: true
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: testimonials.length > 1,
          dots: true
        }
      }
    ]
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-3">CUSTOMER FEEDBACK</h2>
          <div className="flex items-center justify-center gap-2">
            <div className="bg-yellow-400 text-white px-4 py-2 rounded-full font-bold text-xl">
              5.0
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400" size={20} />
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Slider */}
        <div className="testimonials-slider">
          <Slider {...settings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className="px-3">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl">
                  {/* Image Container */}
                  <div className="relative">
                    {getImageUrl(testimonial.image) ? (
                    <img
                      src={getImageUrl(testimonial.image)}
                      alt={testimonial.customerName}
                      width={400}
                      height={300}
                      loading="lazy"
                      className="w-full h-auto object-contain"
                    />
                    ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                    )}
                    
                    {/* Overlay with rating */}
                    <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}
                            size={14}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-gray-900">{testimonial.rating}.0</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Custom Styles for Slick Slider */}
      <style>{`
        .testimonials-slider .slick-dots {
          bottom: -40px;
        }
        
        .testimonials-slider .slick-dots li button:before {
          font-size: 12px;
          color: #ec4899;
        }
        
        .testimonials-slider .slick-dots li.slick-active button:before {
          color: #ec4899;
        }

        .testimonials-slider .slick-prev,
        .testimonials-slider .slick-next {
          z-index: 10;
        }

        .testimonials-slider .slick-prev {
          left: -15px;
        }

        .testimonials-slider .slick-next {
          right: -15px;
        }

        .testimonials-slider .slick-prev:before,
        .testimonials-slider .slick-next:before {
          color: #ec4899;
          font-size: 30px;
        }

        @media (max-width: 640px) {
          .testimonials-slider .slick-prev {
            left: -10px;
          }

          .testimonials-slider .slick-next {
            right: -10px;
          }

          .testimonials-slider .slick-prev:before,
          .testimonials-slider .slick-next:before {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default TestimonialsSlider;
