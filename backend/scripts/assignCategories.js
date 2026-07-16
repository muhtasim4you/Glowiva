const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const assignCategories = async () => {
  try {
    console.log('🔧 Assigning categories to products...\n');
    
    // Get all categories
    const categories = await Category.find({});
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });
    
    // Product to category mapping
    const productCategories = [
      { name: 'Niacinamide', category: 'serum' },
      { name: 'Vitamin C', category: 'serum' },
      { name: 'Hyaluronic Acid', category: 'serum' },
      { name: 'Serum', category: 'serum' },
      { name: 'Hair Shampoo', category: 'haircare' },
      { name: 'Night Cream', category: 'moisturizer' },
      { name: 'Cream', category: 'moisturizer' },
      { name: 'Sunscreen', category: 'sunscreen' },
      { name: 'SPF', category: 'sunscreen' },
      { name: 'Face Wash', category: 'cleanser' },
      { name: 'Cleanser', category: 'cleanser' },
      { name: 'Toner', category: 'toner' },
      { name: 'Primer', category: 'makeup' },
      { name: 'Foundation', category: 'makeup' },
      { name: 'Lipstick', category: 'makeup' },
    ];
    
    const products = await Product.find({});
    let updated = 0;
    
    for (const product of products) {
      let assignedCategory = null;
      
      // Check product name for category keywords
      for (const mapping of productCategories) {
        if (product.name.toLowerCase().includes(mapping.name.toLowerCase())) {
          assignedCategory = categoryMap[mapping.category];
          break;
        }
      }
      
      if (assignedCategory) {
        await Product.findByIdAndUpdate(product._id, { category: assignedCategory });
        const cat = categories.find(c => c._id.toString() === assignedCategory.toString());
        console.log(`✅ ${product.name} → ${cat.name}`);
        updated++;
      } else {
        console.log(`⚠️  ${product.name} → No matching category found`);
      }
    }
    
    console.log(`\n🎉 Updated ${updated} out of ${products.length} products\n`);
    
    // Show summary by category
    console.log('📊 Products by Category:\n');
    for (const cat of categories) {
      const count = await Product.countDocuments({ category: cat._id });
      console.log(`  ${cat.name}: ${count} products`);
    }
    
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

assignCategories();
