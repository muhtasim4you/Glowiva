const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  approveReview
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, admin, getAllReviews)
  .post(protect, createReview);

router.get('/product/:productId', getProductReviews);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

router.put('/:id/approve', protect, admin, approveReview);

module.exports = router;
