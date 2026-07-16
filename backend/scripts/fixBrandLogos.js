const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Brand = require('../models/Brand');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const fixBrandLogos = async () => {
  try {
    console.log('🔧 Updating brand logos...');

    // Update all brands that have via.placeholder.com URLs to null
    const result = await Brand.updateMany(
      { logo: { $regex: 'via.placeholder.com' } },
      { $set: { logo: null } }
    );

    console.log(`✅ Updated ${result.modifiedCount} brand logos`);
    
    // Show all brands after update
    const brands = await Brand.find({});
    console.log('\n📋 Current brands:');
    brands.forEach(brand => {
      console.log(`  - ${brand.name}: ${brand.logo || 'No logo'}`);
    });

    console.log('\n🎉 Brand logos fixed successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error fixing brand logos:', error);
    process.exit(1);
  }
};

fixBrandLogos();
