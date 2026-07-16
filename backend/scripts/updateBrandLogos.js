const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Brand = require('../models/Brand');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const updateBrandLogos = async () => {
  try {
    console.log('🎨 Updating brand logos...\n');
    
    // Set all logos to null for consistent text display
    // You can upload actual logos through the admin panel later
    const result = await Brand.updateMany(
      {},
      { $set: { logo: null } }
    );
    
    console.log(`✅ Set ${result.modifiedCount} brand logos to null for text display\n`);
    
    // Show all brands with their logos
    const brands = await Brand.find({});
    console.log('📋 All Brands:\n');
    brands.forEach(brand => {
      console.log(`  ${brand.name}: ${brand.logo ? '✓ Has logo' : '✗ No logo'}`);
    });
    
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateBrandLogos();
