const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  deleteUser,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, admin, getUsers);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

router.route('/:id')
  .get(protect, admin, getUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
