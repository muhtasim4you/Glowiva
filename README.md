# Glowiva

Glowivaa is a full-stack beauty and skincare e-commerce platform. Customers can browse authentic products from different brands, search by category or skin type, place orders, make payments, track deliveries, and manage their wishlist and reviews. An admin panel is included for managing products, orders, users, brands, categories, coupons, banners, and testimonials.

## Live Links

- **Website:** [https://glowivaa.cloud](https://glowivaa.cloud)
- **API health check:** [https://glowivaa.cloud/api/health](https://glowivaa.cloud/api/health)

## Technology Stack

- **Frontend:** React 18, React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js, REST API
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT and bcryptjs
- **Payments:** SSLCommerz and Cash on Delivery
- **Other:** Nodemailer, Multer, Sharp, React Slick

## Key Features

- Product catalogue with category, brand, search, offers, combos, and skin-type browsing
- Product details, ratings, reviews, wishlist, cart, and comparison
- User registration, login, profile management, and password updates
- Protected checkout, coupon support, SSLCommerz payment, and Cash on Delivery
- Order history, order details, and public order tracking
- Responsive customer interface with mobile navigation
- Admin dashboard with product, order, user, brand, category, coupon, banner, and testimonial management
- Image upload and processing support

## Main Dependencies

**Frontend:** `react`, `react-router-dom`, `axios`, `react-icons`, `react-slick`, `react-toastify`, `tailwindcss`

**Backend:** `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `dotenv`, `cors`, `express-validator`, `multer`, `sharp`, `nodemailer`, `slugify`, `sslcommerz-lts`

See the `package.json` files for the complete dependency and version list.

## Run Locally

### Requirements

- Node.js 18 or later
- npm
- MongoDB or MongoDB Atlas

### 1. Install dependencies

```bash
git clone <repository-url>
cd Glowivaa

cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/glowiva
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
SSLCOMMERZ_STORE_ID=your_sandbox_store_id
SSLCOMMERZ_STORE_PASSWORD=your_sandbox_store_password
SSLCOMMERZ_IS_LIVE=false
```

Create `frontend/.env.local`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SITE_NAME=Glowiva
```

### 3. Start the applications

Run these commands in two separate terminals:

```bash
# Terminal 1
cd backend
npm run dev
```

```bash
# Terminal 2
cd frontend
npm start
```

Open the frontend at [http://localhost:3000](http://localhost:3000). The API runs at `http://localhost:5000`.

### Optional seed data

From the `backend` directory:

```bash
npm run seed:data
npm run seed:admin
```

## Production Build

```bash
cd frontend
npm run build
```

Production deployment files and scripts are available in the `deploy/` directory.

## License

ISC
