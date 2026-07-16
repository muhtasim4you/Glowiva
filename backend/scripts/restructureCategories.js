const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const restructureCategories = async () => {
  try {
    console.log('🔧 Restructuring categories...\n');
    
    // First, create or get the Skincare parent category
    let skincare = await Category.findOne({ slug: 'skincare' });
    
    if (!skincare) {
      skincare = await Category.create({
        name: 'Skincare',
        description: 'Complete range of skincare products',
        icon: '✨',
        parentCategory: null,
        isActive: true
      });
      console.log('✅ Created Skincare parent category');
    } else {
      // Make sure it has no parent
      await Category.findByIdAndUpdate(skincare._id, { parentCategory: null });
      console.log('✅ Updated Skincare as main category');
    }
    
    // List of subcategories that should be under Skincare
    const subcategoryNames = ['Cleanser', 'Moisturizer', 'Serum', 'Sunscreen', 'Toner'];
    
    // Update each subcategory to have Skincare as parent
    for (const name of subcategoryNames) {
      const result = await Category.findOneAndUpdate(
        { name: name },
        { parentCategory: skincare._id },
        { new: true }
      );
      
      if (result) {
        console.log(`✅ ${name} → now under Skincare`);
      }
    }
    
    console.log('\n📋 Category Structure:\n');
    
    // Show all parent categories
    const parents = await Category.find({ parentCategory: null });
    for (const parent of parents) {
      console.log(`📁 ${parent.name} (${parent.slug})`);
      
      // Show subcategories
      const subs = await Category.find({ parentCategory: parent._id });
      for (const sub of subs) {
        console.log(`   └─ ${sub.name} (${sub.slug})`);
      }
      console.log('');
    }
    
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

restructureCategories();
