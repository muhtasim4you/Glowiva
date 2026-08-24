// ======================================================
// LOAD ENVIRONMENT VARIABLES FIRST
// ======================================================
const dotenv = require('dotenv');

dotenv.config();

// ======================================================
// IMPORT DEPENDENCIES
// ======================================================
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// ======================================================
// CONNECT TO DATABASE
// ======================================================
connectDB();

// ======================================================
// EXPRESS APP
// ======================================================
const app = express();

// ======================================================
// MIDDLEWARE
// ======================================================

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  })
);

// Parse JSON requests
app.use(express.json());

// Parse URL-encoded requests
// Required for SSLCommerz callbacks/IPN
app.use(
  express.urlencoded({
    extended: true
  })
);

// ======================================================
// STATIC FILES
// ======================================================
app.use(
  '/uploads',
  express.static('uploads')
);

// ======================================================
// API ROUTES
// ======================================================

app.use(
  '/api/auth',
  require('./routes/authRoutes')
);

app.use(
  '/api/products',
  require('./routes/productRoutes')
);

app.use(
  '/api/categories',
  require('./routes/categoryRoutes')
);

app.use(
  '/api/brands',
  require('./routes/brandRoutes')
);

app.use(
  '/api/banners',
  require('./routes/bannerRoutes')
);

app.use(
  '/api/orders',
  require('./routes/orderRoutes')
);

app.use(
  '/api/users',
  require('./routes/userRoutes')
);

app.use(
  '/api/coupons',
  require('./routes/couponRoutes')
);

app.use(
  '/api/reviews',
  require('./routes/reviewRoutes')
);

app.use(
  '/api/testimonials',
  require('./routes/testimonialRoutes')
);

app.use(
  '/api/upload',
  require('./routes/uploadRoutes')
);

// SSLCommerz payment routes
app.use(
  '/api/payment',
  require('./routes/paymentRoutes')
);

// ======================================================
// HEALTH CHECK
// ======================================================
app.get(
  '/api/health',
  (req, res) => {
    res.status(200).json({
      status: 'OK',
      message: 'Glowiva API is running'
    });
  }
);

// ======================================================
// ERROR HANDLER
// MUST BE LAST
// ======================================================
app.use(errorHandler);

// ======================================================
// START SERVER
// ======================================================
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(
      `🚀 Server running in ${
        process.env.NODE_ENV || 'development'
      } mode on port ${PORT}`
    );

    console.log(
      `📡 Server URL: http://localhost:${PORT}`
    );
  }
);