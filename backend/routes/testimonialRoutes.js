const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  getAllTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(getTestimonials)
  .post(protect, admin, createTestimonial);

router.route('/admin')
  .get(protect, admin, getAllTestimonials);

router.route('/:id')
  .get(getTestimonial)
  .put(protect, admin, updateTestimonial)
  .delete(protect, admin, deleteTestimonial);

module.exports = router;
