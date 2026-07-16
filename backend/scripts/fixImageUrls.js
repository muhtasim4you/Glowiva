const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const fixImageUrls = async () => {
  try {
    const products = await Product.find({
      images: { $regex: 'http://localhost' }
    });

    console.log(`Found ${products.length} products with localhost image URLs`);

    for (const product of products) {
      product.images = product.images.map(url =>
        typeof url === 'string' ? url.replace(/^https?:\/\/localhost:\d+/, '') : url
      ).filter(url => url && url !== 'undefined');

      await product.save();
      console.log(`Fixed: ${product.name} -> ${product.images}`);
    }

    // Also fix any 'undefined' string images
    const undefinedProducts = await Product.find({
      images: 'undefined'
    });

    for (const product of undefinedProducts) {
      product.images = product.images.filter(url => url && url !== 'undefined');
      await product.save();
      console.log(`Cleaned undefined images: ${product.name}`);
    }

    console.log('Done fixing image URLs!');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixImageUrls();
