const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Category = require('../models/Category');
const connectDB = require('../config/db');

// Load env from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });
connectDB();

const addSubcategories = async () => {
  try {
    console.log('🔧 Adding subcategories for Haircare, Makeup, and Bodycare...\n');
    
    // Get parent categories
    const haircare = await Category.findOne({ name: 'Haircare' });
    const makeup = await Category.findOne({ name: 'Makeup' });
    const bodycare = await Category.findOne({ name: 'Bodycare' });
    
    if (!haircare || !makeup || !bodycare) {
      console.error('❌ One or more parent categories not found!');
      process.exit(1);
    }
    
    // Define subcategories
    const subcategories = [
      // Haircare subcategories
      { name: 'Shampoo', parentCategory: haircare._id, description: 'Hair cleansing shampoos' },
      { name: 'Conditioner', parentCategory: haircare._id, description: 'Hair conditioning products' },
      { name: 'Hair Mask', parentCategory: haircare._id, description: 'Deep conditioning hair masks' },
      { name: 'Hair Oil', parentCategory: haircare._id, description: 'Nourishing hair oils' },
      { name: 'Hair Serum', parentCategory: haircare._id, description: 'Hair treatment serums' },
      { name: 'Hair Spray', parentCategory: haircare._id, description: 'Hair styling sprays' },
      
      // Makeup subcategories
      { name: 'Foundation', parentCategory: makeup._id, description: 'Face foundation and base' },
      { name: 'Concealer', parentCategory: makeup._id, description: 'Concealer products' },
      { name: 'Lipstick', parentCategory: makeup._id, description: 'Lip color products' },
      { name: 'Eyeshadow', parentCategory: makeup._id, description: 'Eye shadow palettes' },
      { name: 'Mascara', parentCategory: makeup._id, description: 'Eyelash mascara' },
      { name: 'Blush', parentCategory: makeup._id, description: 'Face blush and rouge' },
      { name: 'Eyeliner', parentCategory: makeup._id, description: 'Eye liner products' },
      { name: 'Lip Gloss', parentCategory: makeup._id, description: 'Lip gloss products' },
      
      // Bodycare subcategories
      { name: 'Body Lotion', parentCategory: bodycare._id, description: 'Body moisturizing lotions' },
      { name: 'Body Wash', parentCategory: bodycare._id, description: 'Body cleansing wash' },
      { name: 'Body Scrub', parentCategory: bodycare._id, description: 'Exfoliating body scrubs' },
      { name: 'Hand Cream', parentCategory: bodycare._id, description: 'Hand moisturizing cream' },
      { name: 'Foot Cream', parentCategory: bodycare._id, description: 'Foot care cream' },
      { name: 'Deodorant', parentCategory: bodycare._id, description: 'Body deodorants' },
      { name: 'Body Oil', parentCategory: bodycare._id, description: 'Body nourishing oils' }
    ];
    
    let created = 0;
    let skipped = 0;
    
    for (const subcatData of subcategories) {
      // Check if subcategory already exists
      const existing = await Category.findOne({ name: subcatData.name });
      
      if (existing) {
        console.log(`⏭️  ${subcatData.name} already exists`);
        skipped++;
      } else {
        await Category.create(subcatData);
        const parentName = subcatData.parentCategory.equals(haircare._id) ? 'Haircare' :
                          subcatData.parentCategory.equals(makeup._id) ? 'Makeup' : 'Bodycare';
        console.log(`✅ Created: ${subcatData.name} under ${parentName}`);
        created++;
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${created} subcategories`);
    console.log(`   Skipped: ${skipped} (already existed)`);
    
    // Show final structure
    console.log('\n📋 Updated Category Structure:\n');
    const parents = await Category.find({ parentCategory: null });
    for (const parent of parents) {
      const children = await Category.find({ parentCategory: parent._id });
      console.log(`📁 ${parent.name} (${children.length} subcategories)`);
      children.forEach(child => console.log(`   └─ ${child.name}`));
      if (children.length === 0) console.log('   └─ (No subcategories)');
      console.log('');
    }
    
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addSubcategories();
