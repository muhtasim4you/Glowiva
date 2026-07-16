require('dotenv').config();
const mongoose = require('mongoose');
const Brand = require('../models/Brand');

const checkBrandSlugs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all brands
    const brands = await Brand.find({});
    
    console.log(`\nFound ${brands.length} brands:\n`);
    brands.forEach(brand => {
      console.log(`Name: ${brand.name}`);
      console.log(`Slug: ${brand.slug || 'NO SLUG!'}`);
      console.log(`Active: ${brand.isActive}`);
      console.log('---');
    });

    // Check if any brands are missing slugs
    const brandsWithoutSlugs = brands.filter(b => !b.slug);
    if (brandsWithoutSlugs.length > 0) {
      console.log(`\n⚠️  ${brandsWithoutSlugs.length} brands without slugs found!`);
      console.log('Fixing...\n');
      
      for (const brand of brandsWithoutSlugs) {
        brand.slug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        await brand.save();
        console.log(`✅ Fixed slug for: ${brand.name} -> ${brand.slug}`);
      }
    } else {
      console.log('\n✅ All brands have slugs!');
    }

    await mongoose.connection.close();
    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkBrandSlugs();
