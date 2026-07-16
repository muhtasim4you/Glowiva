const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

// Map product names to their appropriate subcategories
const productSubcategoryMap = {
  'Niacinamide': 'Serum',
  'Vitamin C': 'Serum',
  'Hyaluronic Acid': 'Serum',
  'Serum': 'Serum',
  'Shampoo': 'Hair Shampoo',
  'Night Cream': 'Night Cream',
  'Sunscreen': 'Sunscreen',
  'Face Wash': 'Facial Washes',
  'Toner': 'Toner',
  'Primer': 'Face Primer'
};

const updateProductSubcategories = async () => {
  try {
    const products = await Product.find().populate('category brand');
    
    console.log(`Found ${products.length} products. Updating subcategories...`);
    
    let updated = 0;
    for (const product of products) {
      try {
        // Skip if already has subcategory
        if (product.subcategory) {
          console.log(`✓ ${product.name} already has subcategory: ${product.subcategory}`);
          continue;
        }
        
        // Skip if product doesn't have valid category or brand
        if (!product.category || !product.brand) {
          console.log(`⚠️  ${product.name} - missing category or brand, skipping`);
          continue;
        }
        
        // Try to match product name to subcategory
        let subcategory = null;
        for (const [keyword, subcat] of Object.entries(productSubcategoryMap)) {
          if (product.name.toLowerCase().includes(keyword.toLowerCase())) {
            subcategory = subcat;
            break;
          }
        }
        
        if (subcategory) {
          // Use updateOne to avoid validation issues
          await Product.updateOne(
            { _id: product._id },
            { $set: { subcategory: subcategory } }
          );
          console.log(`✅ Updated ${product.name} -> ${subcategory}`);
          updated++;
        } else {
          console.log(`⚠️  ${product.name} - no subcategory match found`);
        }
      } catch (err) {
        console.log(`❌ Error updating ${product.name}: ${err.message}`);
      }
    }
    
    console.log(`\n✅ Updated ${updated} products with subcategories`);
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateProductSubcategories();
