const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const listCategories = async () => {
  try {
    const categories = await Category.find({});
    console.log('\n📋 All Categories:\n');
    categories.forEach(cat => {
      console.log(`  ✓ Name: ${cat.name}`);
      console.log(`    Slug: ${cat.slug}`);
      console.log(`    Description: ${cat.description}`);
      console.log(`    Icon: ${cat.icon}\n`);
    });
    console.log(`Total: ${categories.length} categories`);
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

listCategories();
