const express = require('express');

const router = express.Router();

const {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN
} = require('../controllers/paymentController');

const { protect } = require('../middleware/auth');

router.post(
  '/sslcommerz/initiate',
  protect,
  initiatePayment
);

router.post(
  '/sslcommerz/success',
  paymentSuccess
);

router.post(
  '/sslcommerz/fail',
  paymentFail
);

router.post(
  '/sslcommerz/cancel',
  paymentCancel
);

router.post(
  '/sslcommerz/ipn',
  paymentIPN
);

module.exports = router;