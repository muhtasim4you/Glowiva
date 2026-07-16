const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('../models/Product');
const Category = require('../models/Category');
const connectDB = require('../config/db');

// Load env from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });
connectDB();

const fixProductCategories = async () => {
  try {
    console.log('🔧 Fixing product category assignments...\n');
    
    // Get all categories
    const skincare = await Category.findOne({ name: 'Skincare' });
    const serum = await Category.findOne({ name: 'Serum' });
    const sunscreen = await Category.findOne({ name: 'Sunscreen' });
    const cleanser = await Category.findOne({ name: 'Cleanser' });
    const moisturizer = await Category.findOne({ name: 'Moisturizer' });
    const toner = await Category.findOne({ name: 'Toner' });
    
    // Define product-to-category mapping
    const productMappings = [
      { 
        namePattern: /Niacinamide/i, 
        correctCategory: serum,
        correctCategoryName: 'Serum'
      },
      { 
        namePattern: /SPF.*Sunscreen|Sunscreen.*SPF/i, 
        correctCategory: sunscreen,
        correctCategoryName: 'Sunscreen'
      },
      {
        namePattern: /Vitamin C.*Serum|Serum.*Vitamin C/i,
        correctCategory: serum,
        correctCategoryName: 'Serum'
      },
      {
        namePattern: /Hyaluronic.*Serum|Serum.*Hyaluronic/i,
        correctCategory: serum,
        correctCategoryName: 'Serum'
      },
      {
        namePattern: /Face Wash|Cleanser|Foaming.*Wash/i,
        correctCategory: cleanser,
        correctCategoryName: 'Cleanser'
      },
      {
        namePattern: /Moisturizer|Cream/i,
        correctCategory: moisturizer,
        correctCategoryName: 'Moisturizer'
      },
      {
        namePattern: /Toner/i,
        correctCategory: toner,
        correctCategoryName: 'Toner'
      },
      {
        namePattern: /Primer.*SPF|SPF.*Primer/i,
        correctCategory: sunscreen,
        correctCategoryName: 'Sunscreen'
      }
    ];
    
    const products = await Product.find({}).populate('category');
    let updated = 0;
    
    for (const product of products) {
      let shouldUpdate = false;
      let newCategory = null;
      let newCategoryName = '';
      
      // Check if product is assigned to parent Skincare category
      if (product.category?._id.toString() === skincare._id.toString()) {
        // Find correct subcategory based on product name
        for (const mapping of productMappings) {
          if (mapping.namePattern.test(product.name)) {
            newCategory = mapping.correctCategory;
            newCategoryName = mapping.correctCategoryName;
            shouldUpdate = true;
            break;
          }
        }
      }
      
      if (shouldUpdate && newCategory) {
        await Product.updateOne(
          { _id: product._id },
          { $set: { category: newCategory._id } }
        );
        console.log(`✅ ${product.name}`);
        console.log(`   ${product.category.name} → ${newCategoryName}\n`);
        updated++;
      }
    }
    
    if (updated === 0) {
      console.log('✓ All products are correctly categorized!');
    } else {
      console.log(`\n✅ Updated ${updated} product(s)`);
    }
    
    // Show summary
    console.log('\n📊 Current distribution:');
    const categories = await Category.find({ parentCategory: { $ne: null } });
    for (const cat of categories) {
      const count = await Product.countDocuments({ category: cat._id });
      console.log(`   ${cat.name}: ${count} products`);
    }
    
    const skincareCount = await Product.countDocuments({ category: skincare._id });
    console.log(`   Skincare (parent): ${skincareCount} products`);
    
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixProductCategories();
