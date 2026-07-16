import React, { useState, useEffect } from 'react';
import { FaStar, FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ReviewsSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterRating, setFilterRating] = useState(0);
  const [sortBy, setSortBy] = useState('recent');
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/product/${productId}`);
      setReviews(data);
      calculateStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setLoading(false);
    }
  };

  const calculateStats = (reviewsData) => {
    const total = reviewsData.length;
    if (total === 0) {
      setStats({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      });
      return;
    }

    const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / total;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsData.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });

    setStats({
      averageRating: average,
      totalReviews: total,
      ratingDistribution: distribution
    });
  };

  const handleHelpful = async (reviewId) => {
    try {
      await api.put(`/reviews/${reviewId}/helpful`);
      toast.success('Thank you for your feedback!');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to mark review as helpful');
    }
  };

  const getFilteredAndSortedReviews = () => {
    let filtered = reviews;

    // Filter by rating
    if (filterRating > 0) {
      filtered = filtered.filter(review => review.rating === filterRating);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return (b.helpfulCount || 0) - (a.helpfulCount || 0);
        default:
          return 0;
      }
    });

    return sorted;
  };

  const renderStars = (rating, size = 'text-xl') => {
    return (
      <div className={`flex gap-1 ${size}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const renderRatingBar = (rating) => {
    const count = stats.ratingDistribution[rating] || 0;
    const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

    return (
      <button
        onClick={() => setFilterRating(filterRating === rating ? 0 : rating)}
        className={`flex items-center gap-3 w-full py-2 px-3 rounded hover:bg-gray-50 transition-colors ${
          filterRating === rating ? 'bg-primary-50' : ''
        }`}
      >
        <span className="text-sm font-medium w-8">{rating} ★</span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
      </button>
    );
  };

  const filteredReviews = getFilteredAndSortedReviews();

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar - Rating Overview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h3 className="text-2xl font-bold mb-4">Customer Reviews</h3>
            
            {/* Average Rating */}
            <div className="text-center mb-6 pb-6 border-b">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {stats.averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(stats.averageRating))}
              <p className="text-gray-600 mt-2">
                Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2 mb-6">
              {[5, 4, 3, 2, 1].map(rating => renderRatingBar(rating))}
            </div>

            {/* Clear Filter Button */}
            {filterRating > 0 && (
              <button
                onClick={() => setFilterRating(0)}
                className="w-full text-sm text-primary-500 hover:text-primary-600 mb-4"
              >
                Clear filter
              </button>
            )}

            {/* Write Review Button */}
            {user ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold"
              >
                {showForm ? 'Cancel' : 'Write a Review'}
              </button>
            ) : (
              <div className="text-center text-sm text-gray-600">
                <Link to="/login" className="text-primary-500 hover:underline">
                  Login
                </Link>{' '}
                to write a review
              </div>
            )}
          </div>
        </div>

        {/* Right Content - Reviews List */}
        <div className="lg:col-span-2">
          {/* Review Form */}
          {showForm && user && (
            <div className="mb-6">
              <ReviewForm
                productId={productId}
                onReviewSubmitted={() => {
                  fetchReviews();
                  setShowForm(false);
                }}
              />
            </div>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">
              {filterRating > 0 ? `${filterRating} Star Reviews` : 'All Reviews'}
              <span className="text-gray-500 font-normal ml-2">
                ({filteredReviews.length})
              </span>
            </h3>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          {loading ? (
            <div className="text-center py-12">Loading reviews...</div>
          ) : filteredReviews.length > 0 ? (
            <div>
              {filteredReviews.map(review => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onHelpful={handleHelpful}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-600 mb-4">
                {filterRating > 0
                  ? `No ${filterRating} star reviews yet`
                  : 'No reviews yet'}
              </p>
              {user && !showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Be the first to review
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
