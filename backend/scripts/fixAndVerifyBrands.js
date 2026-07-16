require('dotenv').config();
const mongoose = require('mongoose');
const Brand = require('../models/Brand');

const fixAndVerify = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Find the Skin'O brand with wrong slug
    const skinO = await Brand.findOne({ name: "Skin'O" });
    if (skinO && skinO.slug === 'dove') {
      skinO.slug = 'skino';
      await skinO.save();
      console.log('✅ Fixed Skin\'O slug from "dove" to "skino"\n');
    }

    // Now add Dove
    const doveExists = await Brand.findOne({ name: 'Dove' });
    if (!doveExists) {
      const dove = await Brand.create({
        name: 'Dove',
        description: 'Personal care brand',
        isActive: true
      });
      console.log(`✅ Added "Dove" (slug: ${dove.slug})\n`);
    }

    // List all brands
    const allBrands = await Brand.find({}).sort({ name: 1 });
    console.log('=== ALL BRANDS IN DATABASE ===\n');
    allBrands.forEach((brand, index) => {
      console.log(`${index + 1}. ${brand.name} (slug: ${brand.slug})`);
    });
    console.log(`\n📊 Total: ${allBrands.length} brands`);

    await mongoose.connection.close();
    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixAndVerify();
