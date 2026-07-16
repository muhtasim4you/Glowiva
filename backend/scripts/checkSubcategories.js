const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const checkSubcategories = async () => {
  try {
    const products = await Product.find().select('name subcategory').limit(20);
    
    console.log('Products with subcategories:');
    products.forEach(p => {
      console.log(`- ${p.name}: subcategory='${p.subcategory || 'NOT SET'}'`);
    });
    
    const withSubcat = products.filter(p => p.subcategory);
    console.log(`\n${withSubcat.length} out of ${products.length} products have subcategory set`);
    
    // Check specifically for "Serum"
    const serumProducts = await Product.find({ subcategory: 'Serum' });
    console.log(`\nProducts with subcategory='Serum': ${serumProducts.length}`);
    serumProducts.forEach(p => console.log(`  - ${p.name}`));
    
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkSubcategories();
