const express = require('express');
const router = express.Router();
const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand
} = require('../controllers/brandController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(getBrands)
  .post(protect, admin, createBrand);

router.route('/:slugOrId')
  .get(getBrand)
  .put(protect, admin, updateBrand)
  .delete(protect, admin, deleteBrand);

module.exports = router;
