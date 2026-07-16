const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const connectDB = require('../config/db');
const slugify = require('slugify');

dotenv.config();
connectDB();

const addSlugs = async () => {
  try {
    const products = await Product.find();
    console.log(`Found ${products.length} products`);

    for (const product of products) {
      if (!product.slug) {
        const slug = slugify(product.name, { lower: true, strict: true });
        // Update using updateOne to bypass validation
        await Product.updateOne({ _id: product._id }, { $set: { slug } });
        console.log(`✅ Added slug "${slug}" to product: ${product.name}`);
      } else {
        console.log(`⏭️  Product "${product.name}" already has slug: ${product.slug}`);
      }
    }

    console.log('🎉 All products updated with slugs!');
    process.exit();
  } catch (error) {
    console.error('❌ Error adding slugs:', error);
    process.exit(1);
  }
};

addSlugs();
