import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaThumbsUp } from 'react-icons/fa';

const ReviewCard = ({ review, onHelpful }) => {
  const [showAllImages, setShowAllImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }
    return stars;
  };

  const displayImages = showAllImages ? review.images : review.images?.slice(0, 3);

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {review.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-3">
              <h4 className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</h4>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
          {!review.isApproved && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
              Pending Approval
            </span>
          )}
        </div>

        {review.title && (
          <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
        )}

        <p className="text-gray-700 mb-4">{review.comment}</p>

        {review.images && review.images.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {displayImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review ${index + 1}`}
                  onClick={() => setSelectedImage(image)}
                  className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
              {review.images.length > 3 && !showAllImages && (
                <button
                  onClick={() => setShowAllImages(true)}
                  className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors"
                >
                  +{review.images.length - 3} more
                </button>
              )}
            </div>
            {showAllImages && review.images.length > 3 && (
              <button
                onClick={() => setShowAllImages(false)}
                className="text-sm text-primary-500 hover:text-primary-600 mt-2"
              >
                Show less
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={() => onHelpful && onHelpful(review._id)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors"
          >
            <FaThumbsUp />
            <span>Helpful ({review.helpfulCount || 0})</span>
          </button>
        </div>
      </div>

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Review"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewCard;
