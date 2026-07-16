require('dotenv').config();
const mongoose = require('mongoose');
const Brand = require('../models/Brand');

const brandsToAdd = [
  { name: 'AXIS-Y', description: 'Korean skincare brand focused on sensitive skin' },
  { name: 'Christian dean', description: 'Beauty and skincare brand' },
  { name: 'DABO', description: 'Korean cosmetics brand' },
  { name: 'Dot & Key', description: 'Indian skincare brand' },
  { name: 'Dr.Althea', description: 'Korean dermatology-inspired skincare' },
  { name: 'Glow Industry', description: 'Skincare and beauty brand' },
  { name: "I'M FROM", description: 'Korean natural skincare brand' },
  { name: 'IUNIK', description: 'Korean vegan skincare brand' },
  { name: 'MARS Cosmetics', description: 'Makeup and beauty brand' },
  { name: 'Missha', description: 'Korean beauty brand' },
  { name: 'Simple', description: 'Gentle skincare brand' },
  { name: 'SKIN 1004', description: 'Korean skincare brand' },
  { name: 'skinO', description: 'Skincare brand' },
  { name: 'The Derma Co.', description: 'Dermatologist-backed skincare' },
  { name: 'WishCare', description: 'Natural beauty and skincare brand' },
  { name: 'The Ordinary', description: 'Clinical formulations with integrity' },
  { name: 'Cetaphil', description: 'Dermatologist recommended skincare' },
  { name: 'Neutrogena', description: 'Dermatologist recommended brand' },
  { name: 'Maybelline', description: 'Makeup and beauty brand' },
  { name: 'LOreal', description: 'International beauty brand' },
  { name: 'MAC', description: 'Professional makeup brand' },
  { name: 'NYX', description: 'Professional makeup brand' },
  { name: 'Dove', description: 'Personal care brand' }
];

const addMissingBrands = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Get existing brands
    const existingBrands = await Brand.find({});
    const existingNames = new Set(existingBrands.map(b => b.name.toLowerCase()));
    
    console.log(`Existing brands: ${existingBrands.length}`);
    console.log('Names:', existingBrands.map(b => b.name).join(', '));
    console.log('\n---\n');

    let addedCount = 0;
    let skippedCount = 0;

    for (const brandData of brandsToAdd) {
      const nameLower = brandData.name.toLowerCase();
      
      if (existingNames.has(nameLower)) {
        console.log(`⏭️  Skipping "${brandData.name}" (already exists)`);
        skippedCount++;
      } else {
        const brand = await Brand.create({
          name: brandData.name,
          description: brandData.description,
          isActive: true
        });
        console.log(`✅ Added "${brand.name}" (slug: ${brand.slug})`);
        addedCount++;
      }
    }

    console.log('\n---');
    console.log(`\n✅ Added ${addedCount} brands`);
    console.log(`⏭️  Skipped ${skippedCount} brands (already exist)`);
    
    // Show final count
    const finalBrands = await Brand.find({});
    console.log(`\n📊 Total brands in database: ${finalBrands.length}`);

    await mongoose.connection.close();
    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addMissingBrands();
