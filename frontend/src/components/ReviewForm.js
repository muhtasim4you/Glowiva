import React, { useState } from 'react';
import { FaStar, FaTimes, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    images: ['']
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    if (formData.images.length < 5) {
      setFormData({ ...formData, images: [...formData.images, ''] });
    } else {
      toast.warning('Maximum 5 images allowed');
    }
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length ? newImages : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const reviewData = {
        ...formData,
        product: productId,
        images: formData.images.filter(img => img.trim() !== '')
      };

      await api.post('/reviews', reviewData);
      toast.success('Review submitted successfully!');
      
      // Reset form
      setFormData({
        rating: 5,
        title: '',
        comment: '',
        images: ['']
      });

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex gap-2 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData({ ...formData, rating: star })}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="text-3xl transition-colors"
          >
            <FaStar
              className={
                star <= (hoveredRating || formData.rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }
            />
          </button>
        ))}
        <span className="ml-2 text-gray-600">
          {formData.rating} {formData.rating === 1 ? 'star' : 'stars'}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold mb-6">Write a Review</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Your Rating *</label>
          {renderStarRating()}
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Review Title (Optional)
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="What's most important to know?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Your Review *
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            required
            rows="5"
            placeholder="Share your experience with this product..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Images */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Add Photos (Optional - Max 5)
          </label>
          <div className="space-y-2">
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1 relative">
                  <FaImage className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
            {formData.images.length < 5 && (
              <button
                type="button"
                onClick={addImageField}
                className="text-primary-500 hover:text-primary-600 text-sm flex items-center gap-2"
              >
                <FaImage /> Add another photo
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Paste image URLs from services like Imgur, Cloudinary, or your own hosting
          </p>
        </div>

        {/* Preview Images */}
        {formData.images.some(img => img.trim() !== '') && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Image Preview</label>
            <div className="flex flex-wrap gap-2">
              {formData.images
                .filter(img => img.trim() !== '')
                .map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="12"%3EInvalid URL%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
