const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const categories = [
  { name: 'Cleanser', description: 'Deep cleansing products for clear and fresh skin', icon: '🧴' },
  { name: 'Moisturizer', description: 'Hydrating products to keep your skin soft and supple', icon: '💧' },
  { name: 'Serum', description: 'Concentrated treatments for specific skin concerns', icon: '✨' },
  { name: 'Sunscreen', description: 'UV protection for healthy and protected skin', icon: '☀️' },
  { name: 'Toner', description: 'Balancing and refreshing toners for all skin types', icon: '💦' },
  { name: 'Makeup', description: 'Makeup and cosmetic products', icon: '💄' },
  { name: 'Haircare', description: 'Hair care and styling products', icon: '💇' },
  { name: 'Bodycare', description: 'Body care and wellness products', icon: '🧴' }
];

const brands = [
  { name: 'Anua', description: 'Korean skincare brand focused on natural ingredients', logo: null },
  { name: 'COSRX', description: 'Affordable Korean skincare solutions', logo: null },
  { name: 'The Ordinary', description: 'Clinical formulations with integrity', logo: null },
  { name: 'Cetaphil', description: 'Gentle skincare for sensitive skin', logo: null },
  { name: 'Neutrogena', description: 'Dermatologist recommended skincare', logo: null },
  { name: 'Maybelline', description: 'Leading makeup brand', logo: null },
  { name: 'LOreal', description: 'Because you\'re worth it', logo: null },
  { name: 'MAC', description: 'Professional makeup artistry', logo: null },
  { name: 'NYX', description: 'Affordable professional makeup', logo: null },
  { name: 'Dove', description: 'Real beauty care', logo: null }
];

const seedData = async () => {
  try {
    // Clear existing data
    await Category.deleteMany();
    await Brand.deleteMany();

    // Insert categories one by one to trigger slug generation
    let categoryCount = 0;
    for (const cat of categories) {
      await Category.create(cat);
      categoryCount++;
    }
    console.log(`✅ ${categoryCount} categories created`);

    // Insert brands one by one to trigger slug generation
    let brandCount = 0;
    for (const brand of brands) {
      await Brand.create(brand);
      brandCount++;
    }
    console.log(`✅ ${brandCount} brands created`);

    console.log('🎉 Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
