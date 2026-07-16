const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const connectDB = require('../config/db');

dotenv.config();
connectDB().then(async () => {
  try {
    // Get all products without populate to avoid cast errors
    const products = await Product.find({}).lean();

    console.log(`Total products in database: ${products.length}\n`);

    const issues = [];
    for (const p of products) {
      const problems = [];

      // Check category
      if (!p.category) {
        problems.push('NO CATEGORY');
      } else if (!mongoose.Types.ObjectId.isValid(p.category)) {
        problems.push(`BAD CATEGORY: "${p.category}"`);
      }

      // Check brand
      if (!p.brand) {
        problems.push('NO BRAND');
      } else if (!mongoose.Types.ObjectId.isValid(p.brand)) {
        problems.push(`BAD BRAND: "${p.brand}"`);
      }

      // Check price
      if (!p.price || p.price === 0) {
        problems.push('NO PRICE');
      }

      // Check stock
      if (p.stock === null || p.stock === undefined || p.stock === 0) {
        problems.push('STOCK=0');
      }

      if (problems.length > 0) {
        issues.push({ name: p.name, id: p._id, problems, category: p.category, brand: p.brand, price: p.price, stock: p.stock });
      }
    }

    if (issues.length === 0) {
      console.log('All products have valid category, brand, price, and stock.');
    } else {
      console.log(`Found ${issues.length} products with issues:\n`);
      issues.forEach(p => {
        console.log(`${p.name} (id: ${p.id})`);
        console.log(`  Issues: ${p.problems.join(', ')}`);
        console.log(`  Category: ${p.category || '-'} | Brand: ${p.brand || '-'} | Price: ${p.price || 0} | Stock: ${p.stock || 0}`);
        console.log('');
      });
    }
    process.exit();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
});
