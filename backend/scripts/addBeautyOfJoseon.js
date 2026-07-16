require('dotenv').config();
const mongoose = require('mongoose');
const Brand = require('../models/Brand');

const addBeautyOfJoseon = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if it already exists
    const existing = await Brand.findOne({ name: 'Beauty of Joseon' });
    
    if (existing) {
      console.log('Beauty of Joseon already exists!');
      console.log('Name:', existing.name);
      console.log('Slug:', existing.slug);
    } else {
      // Create the brand
      const brand = await Brand.create({
        name: 'Beauty of Joseon',
        description: 'Korean skincare brand known for traditional ingredients',
        isActive: true
      });
      
      console.log('✅ Created Beauty of Joseon brand:');
      console.log('Name:', brand.name);
      console.log('Slug:', brand.slug);
      console.log('ID:', brand._id);
    }

    await mongoose.connection.close();
    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addBeautyOfJoseon();
