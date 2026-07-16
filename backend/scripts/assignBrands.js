const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const assignBrands = async () => {
  try {
    console.log('🔧 Assigning brands to products...\n');
    
    // Get all brands
    const brands = await Brand.find({});
    const brandMap = {};
    brands.forEach(brand => {
      brandMap[brand.slug] = brand._id;
    });
    
    // Product to brand mapping based on product names
    const productBrands = [
      { nameMatch: 'The Ordinary', brandSlug: 'the-ordinary' },
      { nameMatch: 'Ordinary', brandSlug: 'the-ordinary' },
      { nameMatch: 'Niacinamide', brandSlug: 'the-ordinary' },
      { nameMatch: 'COSRX', brandSlug: 'cosrx' },
      { nameMatch: 'Anua', brandSlug: 'anua' },
      { nameMatch: 'Cetaphil', brandSlug: 'cetaphil' },
      { nameMatch: 'Neutrogena', brandSlug: 'neutrogena' },
      { nameMatch: 'Maybelline', brandSlug: 'maybelline' },
      { nameMatch: 'LOreal', brandSlug: 'loreal' },
      { nameMatch: "L'Oreal", brandSlug: 'loreal' },
      { nameMatch: 'MAC', brandSlug: 'mac' },
      { nameMatch: 'NYX', brandSlug: 'nyx' },
      { nameMatch: 'Dove', brandSlug: 'dove' },
    ];
    
    const products = await Product.find({});
    let updated = 0;
    
    for (const product of products) {
      let assignedBrand = null;
      
      // Check product name for brand keywords
      for (const mapping of productBrands) {
        if (product.name.includes(mapping.nameMatch)) {
          assignedBrand = brandMap[mapping.brandSlug];
          break;
        }
      }
      
      // If no match found, assign a default brand (COSRX for now)
      if (!assignedBrand) {
        assignedBrand = brandMap['cosrx'];
      }
      
      if (assignedBrand) {
        await Product.findByIdAndUpdate(product._id, { brand: assignedBrand });
        const brand = brands.find(b => b._id.toString() === assignedBrand.toString());
        console.log(`✅ ${product.name} → ${brand.name}`);
        updated++;
      }
    }
    
    console.log(`\n🎉 Updated ${updated} out of ${products.length} products\n`);
    
    // Show summary by brand
    console.log('📊 Products by Brand:\n');
    for (const brand of brands) {
      const count = await Product.countDocuments({ brand: brand._id });
      console.log(`  ${brand.name}: ${count} products`);
    }
    
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

assignBrands();
