const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const fixSlugs = async () => {
  try {
    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();

    console.log(`Found ${products.length} products to fix\n`);

    const slugCounts = {};

    for (const product of products) {
      let baseSlug = slugify(product.name, { lower: true, strict: true });

      // Handle duplicates by appending a counter
      if (slugCounts[baseSlug] !== undefined) {
        slugCounts[baseSlug]++;
        baseSlug = `${baseSlug}-${slugCounts[baseSlug]}`;
      } else {
        slugCounts[baseSlug] = 0;
      }

      await db.collection('products').updateOne(
        { _id: product._id },
        { $set: { slug: baseSlug } }
      );
      console.log(`${product.name} -> ${baseSlug}`);
    }

    console.log(`\nFixed ${products.length} product slugs!`);
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixSlugs();
