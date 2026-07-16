const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const removeCategories = async () => {
  try {
    const categoriesToRemove = ['Mens Grooming', 'Mom & Baby', 'Accessories', 'GLOW RESET 2026'];
    
    const result = await Category.deleteMany({ 
      name: { $in: categoriesToRemove } 
    });
    
    console.log(`✅ Deleted ${result.deletedCount} categories`);
    console.log('🎉 Categories removed successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error removing categories:', error);
    process.exit(1);
  }
};

removeCategories();
