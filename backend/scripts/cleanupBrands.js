const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const connectDB = require('../config/db');

dotenv.config();
connectDB().then(async () => {
  try {
    const brands = await Brand.find({}).lean();
    let deactivated = 0;
    let active = 0;

    console.log('Checking brands for products...\n');

    for (const b of brands) {
      const count = await Product.countDocuments({ brand: b._id });
      if (count === 0) {
        await Brand.updateOne({ _id: b._id }, { isActive: false });
        console.log(`  ❌ Deactivated: ${b.name} (0 products)`);
        deactivated++;
      } else {
        await Brand.updateOne({ _id: b._id }, { isActive: true });
        console.log(`  ✅ Active: ${b.name} (${count} products)`);
        active++;
      }
    }

    console.log(`\n✅ ${active} active brands`);
    console.log(`❌ ${deactivated} deactivated brands (no products)`);
    process.exit();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
});
