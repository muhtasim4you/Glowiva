const express = require('express');
const router = express.Router();
const {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner
} = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(getBanners)
  .post(protect, admin, createBanner);

router.route('/:id')
  .get(getBanner)
  .put(protect, admin, updateBanner)
  .delete(protect, admin, deleteBanner);

module.exports = router;
