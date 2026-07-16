const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

// Main categories
const mainCategories = [
  { name: 'Skincare', description: 'Complete skincare products for radiant skin', type: 'regular' },
  { name: 'Makeup', description: 'Makeup and cosmetic products', type: 'regular' },
  { name: 'Haircare', description: 'Hair care and styling products', type: 'regular' },
  { name: 'Bodycare', description: 'Body care and wellness products', type: 'regular' },
  { name: 'Combo', description: 'Special combo offers and sets', type: 'combo' },
];

// Subcategories mapped to parent
const subcategories = {
  'Skincare': [
    'Serum', 'Moisturiser', 'Cleanser', 'Toner', 'Sunscreen',
  ],
  'Makeup': [
    // Eyes Makeup
    'Eyeliner', 'Kajal', 'Mascara', 'Eye Brows', 'Eye Shadow',
    // Face Makeup
    'Concealers', 'Face Foundation', 'Blush', 'Contour', 'Face Primer', 'Highlighters', 'Setting Spray', 'BB & CC Cream', 'Compact Powder',
    // Lips
    'Lip Liner', 'Lipstick', 'Lip Tints', 'Lip Gloss',
    // Tools & Brushes
    'Brush Sets', 'Eye Brush', 'Face Brush', 'Mirrors', 'Makeup Pouches', 'Sponges & Applicators',
    // Makeup Kits
    'Makeup Palette',
  ],
  'Haircare': [
    // Hair Treatment
    'Hair Shampoo', 'Hair Oil', 'Hair Mask & Cream', 'Hair Serum - Treatment',
    // Hair Style
    'Hair Spray & Gel', 'Hair Straightening Cream', 'Hair Color',
    // Hair Tools & Accessories
    'Hair Brush Comb', 'Hair Straightener', 'Hair Dryer',
  ],
  'Bodycare': [
    // Bath & Shower
    'Body Scrub & Exfoliants', 'Shower Gels & Body Wash', 'Body Soaps',
    // Body Care
    'Body Lotion', 'Body Butter', 'Body Oil', 'Body Massage Oil', 'Talcum Powder', 'Body Sunscreen', 'Bath Salt',
    // Hand & Foot
    'Hand Cream', 'Hand Wash', 'Foot Cream', 'Foot Scrub',
    // Feminine Hygiene & Care
    'Body Razors', 'Face & Eyebrow Razors', 'Hair Removal Cream', 'Wax & Wax Strips', 'Breast Cream',
    // Fragrance
    "Men's Fragrance - Body Mist & Body Sprays", "Men's Fragrance - Deo & Roll Ons", 'Men Perfume',
    "Women's Fragrances - Deo & Roll-ons", 'Women Perfume', "Women's Fragrance - Body Mist & Body Sprays",
  ],
};

// All brands with products
const brands = [
  { name: 'Anua', description: 'Korean skincare brand focused on natural ingredients' },
  { name: 'AXIS-Y', description: 'Korean skincare with multi-textured approach' },
  { name: 'BIOAQUA', description: 'Affordable skincare and beauty brand with diverse product range' },
  { name: 'CeraVe', description: 'Dermatologist-developed skincare with essential ceramides' },
  { name: 'COSRX', description: 'Affordable Korean skincare solutions' },
  { name: 'DABO', description: 'Korean beauty and skincare' },
  { name: 'Dr.Althea', description: 'Dermatologist-developed skincare' },
  { name: 'Glutathione', description: 'Brightening and antioxidant skincare brand' },
  { name: 'Glowivaa Essentials', description: 'Curated beauty essentials by Glowivaa' },
  { name: "I'M FROM", description: 'Natural ingredient-focused Korean skincare' },
  { name: 'Innsaei', description: 'Low pH balanced skincare for gentle and effective cleansing' },
  { name: 'IUNIK', description: 'Minimal ingredient Korean skincare' },
  { name: 'LAIKOU', description: 'Japanese-inspired skincare with cherry blossom and natural extracts' },
  { name: 'Laneige', description: 'Korean luxury skincare and makeup brand by Amore Pacific' },
  { name: 'Mamaearth', description: 'Natural and toxin-free personal care brand from India' },
  { name: 'Missha', description: 'Korean beauty innovation' },
  { name: 'Mistine', description: "Thailand's leading beauty brand with affordable quality products" },
  { name: "Pond's", description: 'Iconic skincare brand known for moisturizers and anti-aging solutions' },
  { name: 'Rajkonna', description: 'Bangladeshi beauty brand with natural and herbal formulations' },
  { name: 'Simple', description: 'Kind to skin, simple skincare' },
  { name: 'SKIN 1004', description: 'Centella Asiatica skincare specialists' },
  { name: 'skinO', description: 'Premium skincare solutions' },
  { name: 'Skinfood', description: 'Korean beauty brand using food-derived ingredients for skin nourishment' },
  { name: 'The Face Shop', description: 'Korean beauty brand with nature-inspired skincare' },
  { name: 'The Ordinary', description: 'Clinical skincare with integrity — effective formulations at honest prices' },
  { name: 'Vaseline', description: 'Trusted skincare brand specializing in moisturizing and healing dry skin' },
];

const seedData = async () => {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing categories and brands...');
    await Category.deleteMany();
    await Brand.deleteMany();

    // Create main categories
    console.log('\n📁 Creating main categories...');
    const parentMap = {};
    for (const cat of mainCategories) {
      const created = await Category.create(cat);
      parentMap[cat.name] = created._id;
      console.log(`  ✅ ${cat.name} (${created.slug})`);
    }

    // Create subcategories
    console.log('\n📂 Creating subcategories...');
    let subCount = 0;
    for (const [parentName, subs] of Object.entries(subcategories)) {
      console.log(`\n  Under ${parentName}:`);
      for (const subName of subs) {
        try {
          const created = await Category.create({
            name: subName,
            parentCategory: parentMap[parentName],
            type: 'regular',
          });
          console.log(`    ✅ ${subName} (${created.slug})`);
          subCount++;
        } catch (err) {
          // Skip duplicates
          if (err.code === 11000) {
            console.log(`    ⚠️  ${subName} (already exists, skipped)`);
          } else {
            console.log(`    ❌ ${subName}: ${err.message}`);
          }
        }
      }
    }

    // Create brands
    console.log('\n🏷️  Creating brands...');
    let brandCount = 0;
    for (const brand of brands) {
      try {
        await Brand.create(brand);
        console.log(`  ✅ ${brand.name}`);
        brandCount++;
      } catch (err) {
        if (err.code === 11000) {
          console.log(`  ⚠️  ${brand.name} (already exists, skipped)`);
        } else {
          console.log(`  ❌ ${brand.name}: ${err.message}`);
        }
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log(`✅ ${mainCategories.length} main categories created`);
    console.log(`✅ ${subCount} subcategories created`);
    console.log(`✅ ${brandCount} brands created`);
    console.log('🎉 Database seeded successfully!');
    console.log('═══════════════════════════════════════\n');

    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
