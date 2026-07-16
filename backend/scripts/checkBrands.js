const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Brand = require('../models/Brand');
const Product = require('../models/Product');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const checkBrands = async () => {
  try {
    console.log('📋 Brands in database:\n');
    const brands = await Brand.find({});
    
    for (const brand of brands) {
      const productCount = await Product.countDocuments({ brand: brand._id });
      console.log(`  ${brand.name}`);
      console.log(`    Slug: ${brand.slug}`);
      console.log(`    Products: ${productCount}`);
      console.log('');
    }
    
    console.log(`\nTotal: ${brands.length} brands\n`);
    
    // Check products with brands
    console.log('📦 Products with brand assignments:\n');
    const products = await Product.find({ brand: { $ne: null } })
      .populate('brand', 'name slug')
      .limit(20);
    
    products.forEach(product => {
      console.log(`  ${product.name} → ${product.brand ? product.brand.name : 'No brand'}`);
    });
    
    console.log(`\nTotal products with brands: ${products.length}\n`);
    
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkBrands();
