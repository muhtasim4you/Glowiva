// paymentController.js

const axios = require('axios');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const SSL_STORE_ID = process.env.SSLCOMMERZ_STORE_ID;
const SSL_STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD;

const SSL_INIT_URL =
  'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

const SSL_VALIDATION_URL =
  'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php';


// ======================================================
// INITIATE SSLCOMMERZ PAYMENT
// POST /api/payment/sslcommerz/initiate
// ======================================================
exports.initiatePayment = async (req, res) => {
  try {
    console.log('\n==========================================');
    console.log('SSLCommerz Payment Initiation');
    console.log('==========================================');
    console.log('Request body:', req.body);

    const { orderId } = req.body;

    // ------------------------------------------
    // 1. Validate order ID
    // ------------------------------------------
    if (!orderId) {
      console.log('❌ Missing orderId');

      return res.status(400).json({
        success: false,
        error: 'Order ID is required'
      });
    }

    // ------------------------------------------
    // 2. Find the already-created order
    // ------------------------------------------
    const order = await Order.findById(orderId);

    if (!order) {
      console.log('❌ Order not found:', orderId);

      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    console.log('✅ Order found:', order._id);
    console.log('Order total:', order.totalPrice);
    console.log('Payment method:', order.paymentMethod);

    // ------------------------------------------
    // 3. Make sure this order belongs to user
    // ------------------------------------------
    if (
      req.user &&
      order.user &&
      order.user.toString() !== req.user._id.toString()
    ) {
      console.log('❌ Unauthorized order access');

      return res.status(403).json({
        success: false,
        error: 'You are not authorized to pay for this order'
      });
    }

    // ------------------------------------------
    // 4. Validate payment method
    // ------------------------------------------
    if (order.paymentMethod !== 'SSLCOMMERZ') {
      console.log(
        '❌ Invalid payment method:',
        order.paymentMethod
      );

      return res.status(400).json({
        success: false,
        error: 'This order is not an SSLCOMMERZ order'
      });
    }

    // ------------------------------------------
    // 5. Check order status
    // ------------------------------------------
    if (order.paymentStatus === 'Paid') {
      return res.status(400).json({
        success: false,
        error: 'This order has already been paid'
      });
    }

    // ------------------------------------------
    // 6. Check stock before starting payment
    // IMPORTANT:
    // Do NOT deduct stock here.
    // Stock is deducted after successful payment.
    // ------------------------------------------
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        console.log(
          '❌ Product not found:',
          item.product
        );

        return res.status(404).json({
          success: false,
          error: `Product not found: ${item.name || item.product}`
        });
      }

      if (product.stock < item.quantity) {
        console.log(
          `❌ Insufficient stock for ${product.name}`
        );

        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }
    }

    // ------------------------------------------
    // 7. Make sure total is valid
    // ------------------------------------------
    const finalTotal = Number(order.totalPrice);

    if (!finalTotal || finalTotal <= 0) {
      console.log(
        '❌ Invalid order total:',
        order.totalPrice
      );

      return res.status(400).json({
        success: false,
        error: 'Invalid order total'
      });
    }

    // ------------------------------------------
    // 8. Generate unique transaction ID
    // ------------------------------------------
    const tranId =
      `GLOWIVA_${order._id}_${Date.now()}`;

    console.log('Transaction ID:', tranId);

    // ------------------------------------------
    // 9. Check SSLCommerz credentials
    // ------------------------------------------
    if (!SSL_STORE_ID || !SSL_STORE_PASSWORD) {
      console.error(
        '❌ SSLCommerz credentials are missing'
      );

      return res.status(500).json({
        success: false,
        error:
          'SSLCommerz configuration is missing on the server'
      });
    }

    // ------------------------------------------
    // 10. Prepare SSLCommerz payment data
    // ------------------------------------------
    const shippingAddress =
      order.shippingAddress || {};

    const paymentData = {
      store_id: SSL_STORE_ID,

      store_passwd: SSL_STORE_PASSWORD,

      total_amount: finalTotal.toFixed(2),

      currency: 'BDT',

      tran_id: tranId,

      success_url:
        `${process.env.BACKEND_URL}/api/payment/sslcommerz/success`,

      fail_url:
        `${process.env.BACKEND_URL}/api/payment/sslcommerz/fail`,

      cancel_url:
        `${process.env.BACKEND_URL}/api/payment/sslcommerz/cancel`,

      ipn_url:
        `${process.env.BACKEND_URL}/api/payment/sslcommerz/ipn`,

      product_name: 'Glowiva Order',

      product_category: 'Skincare',

      product_profile: 'general',

      cus_name:
        shippingAddress.fullName || 'Glowiva Customer',

      cus_email:
        shippingAddress.email ||
        req.user?.email ||
        'customer@glowiva.com',

      cus_phone:
        shippingAddress.phone || '01700000000',

      cus_add1:
        shippingAddress.address ||
        shippingAddress.street ||
        'Dhaka',

      cus_city:
        shippingAddress.city || 'Dhaka',

      cus_postcode:
        shippingAddress.postalCode || '1000',

      cus_country:
        shippingAddress.country || 'Bangladesh',

      shipping_method: 'YES',

      ship_name:
        shippingAddress.fullName ||
        'Glowiva Customer',

      ship_add1:
        shippingAddress.address ||
        shippingAddress.street ||
        'Dhaka',

      ship_city:
        shippingAddress.city || 'Dhaka',

      ship_postcode:
        shippingAddress.postalCode || '1000',

      ship_country:
        shippingAddress.country || 'Bangladesh',

      // Keep our Order ID
      value_a: order._id.toString()
    };

    console.log(
      'Sending payment request to SSLCommerz...'
    );

    console.log(
      'Payment amount:',
      paymentData.total_amount
    );

    // ------------------------------------------
    // 11. Send request to SSLCommerz
    // ------------------------------------------
    const response = await axios.post(
      SSL_INIT_URL,
      new URLSearchParams(paymentData).toString(),
      {
        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded'
        },

        timeout: 30000
      }
    );

    console.log(
      'SSLCommerz response:',
      response.data
    );

    // ------------------------------------------
    // 12. Check gateway response
    // ------------------------------------------
    if (
      !response.data ||
      !response.data.GatewayPageURL
    ) {
      console.error(
        '❌ SSLCommerz initiation failed:',
        response.data
      );

      return res.status(400).json({
        success: false,
        error:
          response.data?.failedreason ||
          response.data?.status ||
          'Failed to initialize SSLCOMMERZ payment'
      });
    }

    // ------------------------------------------
    // 13. Save transaction ID
    // ------------------------------------------
    order.sslcommerz =
      order.sslcommerz || {};

    order.sslcommerz.transactionId =
      tranId;

    await order.save();

    console.log(
      '✅ SSLCommerz payment initialized successfully'
    );

    console.log(
      'Gateway URL:',
      response.data.GatewayPageURL
    );

    console.log('==========================================\n');

    // ------------------------------------------
    // 14. Send gateway URL to frontend
    // ------------------------------------------
    return res.status(200).json({
      success: true,

      GatewayPageURL:
        response.data.GatewayPageURL,

      orderId:
        order._id
    });

  } catch (error) {
    console.error(
      '\n❌ SSLCOMMERZ INITIATION ERROR'
    );

    console.error(
      'Message:',
      error.message
    );

    console.error(
      'Response:',
      error.response?.data
    );

    return res.status(500).json({
      success: false,
      error:
        error.response?.data?.failedreason ||
        error.response?.data?.error ||
        error.message ||
        'Payment initialization failed'
    });
  }
};


// ======================================================
// PROCESS SUCCESSFUL PAYMENT
// ======================================================
const processSuccessfulPayment = async (
  tran_id,
  val_id
) => {

  // ------------------------------------------
  // Find order
  // ------------------------------------------
  const order = await Order.findOne({
    'sslcommerz.transactionId': tran_id
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // ------------------------------------------
  // Already paid
  // ------------------------------------------
  if (order.paymentStatus === 'Paid') {
    return order;
  }

  // ------------------------------------------
  // Validate payment with SSLCommerz
  // ------------------------------------------
  const validationResponse =
    await axios.get(
      SSL_VALIDATION_URL,
      {
        params: {
          val_id,

          store_id:
            SSL_STORE_ID,

          store_passwd:
            SSL_STORE_PASSWORD,

          format: 'json'
        }
      }
    );

  const validation =
    validationResponse.data;

  console.log(
    'SSLCommerz validation:',
    validation
  );

  // ------------------------------------------
  // Validate status
  // ------------------------------------------
  if (
    validation.status !== 'VALID' &&
    validation.status !== 'VALIDATED'
  ) {
    throw new Error(
      'Payment validation failed'
    );
  }

  // ------------------------------------------
  // Verify transaction
  // ------------------------------------------
  if (
    validation.tran_id !== tran_id
  ) {
    throw new Error(
      'Transaction ID mismatch'
    );
  }

  // ------------------------------------------
  // Verify amount
  // ------------------------------------------
  const paidAmount =
    Number(validation.amount);

  const orderAmount =
    Number(order.totalPrice);

  if (
    Number.isNaN(paidAmount) ||
    Math.abs(paidAmount - orderAmount) > 0.01
  ) {
    console.error(
      'Amount mismatch:',
      {
        paidAmount,
        orderAmount
      }
    );

    throw new Error(
      'Payment amount mismatch'
    );
  }

  // ------------------------------------------
  // Deduct stock
  // ------------------------------------------
  const updatedItems = [];

  for (const item of order.orderItems) {

    const updated =
      await Product.findOneAndUpdate(
        {
          _id: item.product,

          stock: {
            $gte: item.quantity
          }
        },

        {
          $inc: {
            stock: -item.quantity,

            sold: item.quantity
          }
        },

        {
          new: true
        }
      );

    if (!updated) {

      // Rollback previous products
      for (
        const previousItem
        of updatedItems
      ) {

        await Product.findByIdAndUpdate(
          previousItem.product,

          {
            $inc: {
              stock:
                previousItem.quantity,

              sold:
                -previousItem.quantity
            }
          }
        );
      }

      throw new Error(
        `Insufficient stock for ${item.name}`
      );
    }

    updatedItems.push(item);
  }

  // ------------------------------------------
  // Save SSLCommerz information
  // ------------------------------------------
  order.sslcommerz.validationId =
    validation.val_id;

  order.sslcommerz.bankTransactionId =
    validation.bank_tran_id;

  order.sslcommerz.cardType =
    validation.card_type;

  // ------------------------------------------
  // Mark payment as paid
  // ------------------------------------------
  order.paymentStatus = 'Paid';

  order.orderStatus = 'Processing';

  // ------------------------------------------
  // Coupon
  // ------------------------------------------
  if (order.couponCode) {

    await Coupon.findOneAndUpdate(
      {
        code:
          order.couponCode.toUpperCase()
      },

      {
        $inc: {
          usedCount: 1
        }
      }
    );
  }

  await order.save();

  console.log(
    `✅ Payment successful for order ${order._id}`
  );

  return order;
};


// ======================================================
// PAYMENT SUCCESS
// POST /api/payment/sslcommerz/success
// ======================================================
exports.paymentSuccess = async (req, res) => {
  try {

    console.log(
      '\n=========================================='
    );

    console.log(
      'SSLCommerz SUCCESS:'
    );

    console.log(
      req.body
    );

    const {
      val_id,
      tran_id
    } = req.body;

    if (!val_id || !tran_id) {
      return res.status(400).send(
        'Invalid payment response'
      );
    }

    const order =
      await processSuccessfulPayment(
        tran_id,
        val_id
      );

    return res.redirect(
      `${process.env.FRONTEND_URL}/order/${order._id}`
    );

  } catch (error) {

    console.error(
      '❌ SSLCommerz success error:',
      error.response?.data ||
      error.message
    );

    return res.status(500).send(
      'Payment processing failed'
    );
  }
};


// ======================================================
// PAYMENT FAILED
// POST /api/payment/sslcommerz/fail
// ======================================================
exports.paymentFail = async (req, res) => {
  try {

    console.log(
      '\n=========================================='
    );

    console.log(
      'SSLCommerz FAILED:'
    );

    console.log(
      req.body
    );

    const {
      tran_id
    } = req.body;

    if (tran_id) {

      const order =
        await Order.findOne({
          'sslcommerz.transactionId':
            tran_id
        });

      if (order) {

        order.paymentStatus =
          'Failed';

        await order.save();

        console.log(
          `Payment failed for order ${order._id}`
        );
      }
    }

    return res.redirect(
      `${process.env.FRONTEND_URL}/checkout?payment=failed`
    );

  } catch (error) {

    console.error(
      'SSLCommerz fail error:',
      error.message
    );

    return res.redirect(
      `${process.env.FRONTEND_URL}/checkout?payment=failed`
    );
  }
};


// ======================================================
// PAYMENT CANCELLED
// POST /api/payment/sslcommerz/cancel
// ======================================================
exports.paymentCancel = async (req, res) => {
  try {

    console.log(
      '\n=========================================='
    );

    console.log(
      'SSLCommerz CANCELLED:'
    );

    console.log(
      req.body
    );

    const {
      tran_id
    } = req.body;

    if (tran_id) {

      const order =
        await Order.findOne({
          'sslcommerz.transactionId':
            tran_id
        });

      if (order) {

        console.log(
          `Payment cancelled for order ${order._id}`
        );

        // Keep Pending
        // because OrderSchema does not use
        // Cancelled as a payment status.
      }
    }

    return res.redirect(
      `${process.env.FRONTEND_URL}/checkout?payment=cancelled`
    );

  } catch (error) {

    console.error(
      'SSLCommerz cancel error:',
      error.message
    );

    return res.redirect(
      `${process.env.FRONTEND_URL}/checkout?payment=cancelled`
    );
  }
};


// ======================================================
// IPN
// POST /api/payment/sslcommerz/ipn
// ======================================================
exports.paymentIPN = async (req, res) => {
  try {

    console.log(
      '\n=========================================='
    );

    console.log(
      'SSLCommerz IPN received:'
    );

    console.log(
      req.body
    );

    const {
      val_id,
      tran_id
    } = req.body;

    if (!val_id || !tran_id) {
      return res.status(400).json({
        success: false,
        error: 'Invalid IPN data'
      });
    }

    // ------------------------------------------
    // Find order
    // ------------------------------------------
    const order =
      await Order.findOne({
        'sslcommerz.transactionId':
          tran_id
      });

    if (!order) {

      console.log(
        '❌ IPN order not found:',
        tran_id
      );

      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // ------------------------------------------
    // Already paid
    // ------------------------------------------
    if (order.paymentStatus === 'Paid') {

      return res.status(200).json({
        success: true,
        message: 'Order already processed'
      });
    }

    // ------------------------------------------
    // Process payment
    // ------------------------------------------
    await processSuccessfulPayment(
      tran_id,
      val_id
    );

    console.log(
      `✅ IPN successfully processed order ${order._id}`
    );

    return res.status(200).json({
      success: true,
      message:
        'Payment processed successfully'
    });

  } catch (error) {

    console.error(
      '❌ SSLCommerz IPN error:',
      error.response?.data ||
      error.message
    );

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        'IPN processing failed'
    });
  }
};