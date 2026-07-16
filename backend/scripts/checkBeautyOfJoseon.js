require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Brand = require('../models/Brand');

const checkProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find products that might reference "Beauty of Joseon"
    const products = await Product.find({}).populate('brand');
    
    console.log(`\nTotal products: ${products.length}\n`);
    
    // Check for products with Beauty of Joseon in name
    const bojProducts = products.filter(p => 
      p.name?.toLowerCase().includes('beauty') || 
      p.name?.toLowerCase().includes('joseon')
    );
    
    if (bojProducts.length > 0) {
      console.log('Products with "Beauty" or "Joseon" in name:');
      bojProducts.forEach(p => {
        console.log(`- ${p.name}`);
        console.log(`  Brand: ${p.brand?.name || 'No brand'}`);
        console.log(`  Brand ID: ${p.brand?._id || 'No brand ID'}`);
      });
    }

    // Check all unique brand references
    const brandIds = new Set();
    products.forEach(p => {
      if (p.brand?._id) brandIds.add(p.brand._id.toString());
    });
    
    console.log(`\n\nUnique brands referenced in products: ${brandIds.size}`);
    
    // Check if there are brands in products that don't exist
    const allBrands = await Brand.find({});
    const existingBrandIds = new Set(allBrands.map(b => b._id.toString()));
    
    const productsWithoutValidBrand = products.filter(p => 
      !p.brand || !existingBrandIds.has(p.brand._id?.toString())
    );
    
    console.log(`Products without valid brand: ${productsWithoutValidBrand.length}`);
    
    if (productsWithoutValidBrand.length > 0) {
      console.log('\nProducts without valid brands:');
      productsWithoutValidBrand.slice(0, 10).forEach(p => {
        console.log(`- ${p.name} (brand: ${p.brand?.name || 'None'})`);
      });
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkProducts();
