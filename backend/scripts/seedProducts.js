const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

// Helper to find or create a brand
async function getOrCreateBrand(name, description = '') {
  let brand = await Brand.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  if (!brand) {
    brand = await Brand.create({ name, description });
    console.log(`  🏷️  Created new brand: ${name}`);
  }
  return brand._id;
}

// Helper to find category by name
async function getCategoryId(name) {
  const cat = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  if (!cat) {
    console.warn(`  ⚠️  Category "${name}" not found!`);
    return null;
  }
  return cat._id;
}

const seedProducts = async () => {
  try {
    console.log('\n🔗 Connected to database. Starting product seed...\n');

    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 1000));

    // ── Get / create all brands ──────────────────────────────────
    console.log('🏷️  Resolving brands...');
    const brandIds = {
      cosrx: await getOrCreateBrand('COSRX', 'Affordable Korean skincare solutions targeting specific skin concerns'),
      skinfood: await getOrCreateBrand('Skinfood', 'Korean beauty brand using food-derived ingredients for skin nourishment'),
      anua: await getOrCreateBrand('Anua', 'Korean skincare brand focused on natural heartleaf ingredients'),
      missha: await getOrCreateBrand('Missha', 'Korean beauty innovation with premium skincare and makeup'),
      laikou: await getOrCreateBrand('LAIKOU', 'Japanese-inspired skincare with cherry blossom and natural extracts'),
      rajkonna: await getOrCreateBrand('Rajkonna', 'Bangladeshi beauty brand with natural and herbal formulations'),
      cerave: await getOrCreateBrand('CeraVe', 'Dermatologist-developed skincare with essential ceramides'),
      innsaei: await getOrCreateBrand('Innsaei', 'Low pH balanced skincare for gentle and effective cleansing'),
      skino: await getOrCreateBrand('skinO', 'Premium skincare solutions'),
      bioaqua: await getOrCreateBrand('BIOAQUA', 'Affordable skincare and beauty brand with diverse product range'),
      dabo: await getOrCreateBrand('DABO', 'Korean beauty and skincare'),
      iunik: await getOrCreateBrand('IUNIK', 'Minimal ingredient Korean skincare'),
      simple: await getOrCreateBrand('Simple', 'Kind to skin, simple skincare'),
      glutathione: await getOrCreateBrand('Glutathione', 'Brightening and antioxidant skincare brand'),
      axisy: await getOrCreateBrand('AXIS-Y', 'Korean skincare with multi-textured approach'),
      drAlthea: await getOrCreateBrand('Dr.Althea', 'Dermatologist-developed skincare'),
      vaseline: await getOrCreateBrand('Vaseline', 'Trusted skincare brand specializing in moisturizing and healing dry skin'),
      mamaearth: await getOrCreateBrand('Mamaearth', 'Natural and toxin-free personal care brand from India'),
      ponds: await getOrCreateBrand("Pond's", 'Iconic skincare brand known for moisturizers and anti-aging solutions'),
      laneige: await getOrCreateBrand('Laneige', 'Korean luxury skincare and makeup brand by Amore Pacific'),
      theOrdinary: await getOrCreateBrand('The Ordinary', 'Clinical skincare with integrity — effective formulations at honest prices'),
      mistine: await getOrCreateBrand('Mistine', 'Thailand\'s leading beauty brand with affordable quality products'),
      skin1004: await getOrCreateBrand('SKIN 1004', 'Centella Asiatica skincare specialists'),
      generic: await getOrCreateBrand('Glowivaa Essentials', 'Curated beauty essentials by Glowivaa'),
    };

    // ── Get all categories ───────────────────────────────────────
    console.log('\n📁 Resolving categories...');
    const catIds = {
      skincare: await getCategoryId('Skincare'),
      cleanser: await getCategoryId('Cleanser'),
      moisturiser: await getCategoryId('Moisturiser'),
      sunscreen: await getCategoryId('Sunscreen'),
      serum: await getCategoryId('Serum'),
      toner: await getCategoryId('Toner'),
      bodyLotion: await getCategoryId('Body Lotion'),
      hairSerum: await getCategoryId('Hair Serum - Treatment'),
      hairShampoo: await getCategoryId('Hair Shampoo'),
      bathSalt: await getCategoryId('Bath Salt'),
      bodycare: await getCategoryId('Bodycare'),
      haircare: await getCategoryId('Haircare'),
      combo: await getCategoryId('Combo'),
    };

    // ── Product definitions ──────────────────────────────────────
    const products = [
      // ═══ CLEANSERS ═══
      {
        name: 'COSRX Salicylic Acid Daily Gentle Cleanser',
        brand: brandIds.cosrx,
        category: catIds.cleanser || catIds.skincare,
        price: 850,
        description: 'A daily gentle cleanser formulated with natural BHA (Betaine Salicylate) derived from willow bark water. This low-pH cleanser effectively removes impurities, excess sebum, and dead skin cells without stripping the skin\'s natural moisture barrier. Ideal for acne-prone and oily skin types.\n\nHow to Use: Wet your face with lukewarm water. Apply a small amount of cleanser and gently massage in circular motions for 30-60 seconds. Rinse thoroughly. Use morning and evening.',
        shortDescription: 'Gentle BHA cleanser for acne-prone and oily skin',
        ingredients: ['Saponaria Officinalis Leaf Extract', 'Betaine Salicylate', 'Melaleuca Alternifolia (Tea Tree) Leaf Oil', 'Cocamidopropyl Betaine', 'Sodium Lauroyl Methyl Isethionate'],
        skinTypes: ['oily', 'combination', 'sensitive'],
        stock: 6,
        images: [],
      },
      {
        name: 'Skinfood Pomegranate Peeling Gel',
        brand: brandIds.skinfood,
        category: catIds.cleanser || catIds.skincare,
        price: 750,
        description: 'A gentle exfoliating peeling gel enriched with pomegranate extract that removes dead skin cells and reveals brighter, smoother skin. The cellulose-based formula rolls away impurities without harsh scrubbing, making it suitable for sensitive skin. Packed with antioxidants from pomegranate to fight free radicals and improve skin texture.\n\nHow to Use: After cleansing, apply a generous amount on dry face. Gently massage in circular motions until dead skin rolls off. Rinse with lukewarm water. Use 2-3 times per week.',
        shortDescription: 'Gentle pomegranate exfoliating gel for brighter skin',
        ingredients: ['Pomegranate Extract', 'Cellulose', 'Glycerin', 'Carbomer', 'Allantoin', 'Vitamin E'],
        skinTypes: ['all'],
        stock: 1,
        images: [],
      },
      {
        name: 'Anua Heartleaf Quercetinol Pore Deep Cleansing Foam',
        brand: brandIds.anua,
        category: catIds.cleanser || catIds.skincare,
        price: 1100,
        description: 'A deep pore cleansing foam powered by Heartleaf (Houttuynia Cordata) extract and Quercetinol complex. This cleanser effectively removes makeup residue, excess oil, and impurities from deep within pores while maintaining the skin\'s moisture balance. The low-pH formula soothes irritated skin and reduces redness.\n\nHow to Use: Pump 1-2 times and lather with water. Apply to damp face, massaging gently for 30-60 seconds focusing on T-zone. Rinse thoroughly. Suitable for morning and evening use.',
        shortDescription: 'Heartleaf-powered deep pore cleansing foam',
        ingredients: ['Houttuynia Cordata Extract', 'Quercetinol', 'Salicylic Acid', 'Tea Tree Oil', 'Centella Asiatica Extract', 'Panthenol'],
        skinTypes: ['oily', 'combination', 'sensitive'],
        stock: 1,
        images: [],
      },
      {
        name: 'CeraVe Foaming Facial Cleanser',
        brand: brandIds.cerave,
        category: catIds.cleanser || catIds.skincare,
        price: 1400,
        description: 'A dermatologist-recommended foaming cleanser with three essential ceramides (1, 3, 6-II) and hyaluronic acid. This gel-to-foam formula effectively removes excess oil, dirt, and makeup while maintaining the skin\'s natural protective barrier. Features MVE technology for 24-hour hydration. Non-comedogenic and fragrance-free.\n\nHow to Use: Wet skin with lukewarm water. Massage cleanser into skin in a gentle circular motion. Rinse thoroughly. Use morning and evening as part of your skincare routine.',
        shortDescription: 'Ceramide-enriched foaming cleanser for normal to oily skin',
        ingredients: ['Ceramide NP', 'Ceramide AP', 'Ceramide EOP', 'Hyaluronic Acid', 'Niacinamide', 'Cholesterol', 'Phytosphingosine'],
        skinTypes: ['normal', 'oily', 'combination'],
        stock: 1,
        images: [],
      },
      {
        name: 'Mistine Acne Clear Facial Foam',
        brand: brandIds.mistine,
        category: catIds.cleanser || catIds.skincare,
        price: 450,
        description: 'A Thai beauty favorite — this acne-clearing facial foam contains salicylic acid and tea tree oil to combat breakouts effectively. The gentle yet powerful formula helps unclog pores, reduce excess oil, and prevent future acne without over-drying. Leaves skin feeling fresh and clean.\n\nHow to Use: Squeeze a small amount onto palm, lather with water. Apply to damp face and massage gently. Rinse thoroughly. Use twice daily for best results.',
        shortDescription: 'Acne-fighting facial foam with salicylic acid and tea tree',
        ingredients: ['Salicylic Acid', 'Tea Tree Oil', 'Witch Hazel Extract', 'Aloe Vera Extract', 'Glycerin', 'Zinc PCA'],
        skinTypes: ['oily', 'combination'],
        stock: 4,
        images: [],
      },
      {
        name: 'Simple Kind to Skin Refreshing Facial Wash',
        brand: brandIds.simple,
        category: catIds.cleanser || catIds.skincare,
        price: 650,
        description: 'A soap-free, pH-balanced facial wash that gently yet thoroughly cleanses skin. Made with no artificial perfumes, no harsh chemicals, and no dyes. Contains skin-loving ingredients like pro-vitamin B5 and vitamin E to keep skin feeling soft and replenished after every wash.\n\nHow to Use: Wet face with warm water. Squeeze a small amount into hands and work into a lather. Massage over face, then rinse with water. Pat dry. Use morning and night.',
        shortDescription: 'Gentle soap-free facial wash for sensitive skin',
        ingredients: ['Pro-Vitamin B5 (Panthenol)', 'Vitamin E', 'Bisabolol', 'Glycerin', 'Pantolactone'],
        skinTypes: ['sensitive', 'dry', 'normal', 'all'],
        stock: 1,
        images: [],
      },
      {
        name: 'Rice Water Brightening Facial Cleanser',
        brand: brandIds.laikou,
        category: catIds.cleanser || catIds.skincare,
        price: 450,
        description: 'Inspired by traditional Asian beauty rituals, this rice water cleanser gently removes impurities while brightening and evening out skin tone. Enriched with fermented rice water, known for its skin-brightening properties, vitamins B and E, and amino acids that nourish the skin.\n\nHow to Use: Apply a small amount to damp face. Massage in circular motions for 1 minute. Rinse off with lukewarm water. Use twice daily for visible brightening results within 2-4 weeks.',
        shortDescription: 'Traditional rice water cleanser for bright, even skin tone',
        ingredients: ['Rice Ferment Filtrate', 'Rice Bran Extract', 'Vitamin B3 (Niacinamide)', 'Vitamin E', 'Amino Acids', 'Glycerin'],
        skinTypes: ['all'],
        stock: 6,
        images: [],
      },
      {
        name: 'COSRX Low pH Good Morning Gel Cleanser',
        brand: brandIds.cosrx,
        category: catIds.cleanser || catIds.skincare,
        price: 850,
        description: 'A mildly acidic (pH 5.0-6.0) daily gel cleanser formulated with BHA and tea tree oil. This low-pH cleanser gently washes away impurities without disrupting the skin\'s acid mantle. The tea tree oil provides natural antibacterial benefits while BHA helps to mildly exfoliate for smoother, clearer skin.\n\nHow to Use: Squeeze a small amount onto wet hands. Foam up and apply to damp face. Massage gently for 30 seconds. Rinse thoroughly with lukewarm water. Best used as a morning cleanser.',
        shortDescription: 'Low-pH morning gel cleanser with BHA and tea tree',
        ingredients: ['Betaine Salicylate (BHA)', 'Melaleuca Alternifolia (Tea Tree) Leaf Oil', 'Saccharomyces Ferment', 'Styrax Japonicus Branch/Fruit/Leaf Extract'],
        skinTypes: ['oily', 'combination', 'sensitive'],
        stock: 2,
        images: [],
      },
      {
        name: 'Innsaei Low pH Gentle Facial Cleanser',
        brand: brandIds.innsaei,
        category: catIds.cleanser || catIds.skincare,
        price: 550,
        description: 'A pH-balanced (5.5) gentle cleanser that respects your skin\'s natural acid mantle. Formulated with mild surfactants and soothing botanical extracts, this cleanser effectively removes dirt and oil without causing irritation or dryness. Perfect for those with compromised skin barriers or sensitive skin.\n\nHow to Use: Apply a coin-sized amount to wet hands. Lather and gently massage onto damp face. Rinse with lukewarm water. Use morning and evening.',
        shortDescription: 'pH 5.5 balanced gentle cleanser for sensitive skin',
        ingredients: ['Centella Asiatica Extract', 'Green Tea Extract', 'Aloe Vera', 'Panthenol', 'Hyaluronic Acid', 'Allantoin'],
        skinTypes: ['sensitive', 'dry', 'all'],
        stock: 2,
        images: [],
      },
      {
        name: 'COSRX Salicylic Acid Daily Gentle Cleanser Mini',
        brand: brandIds.cosrx,
        category: catIds.cleanser || catIds.skincare,
        price: 450,
        description: 'The travel-friendly mini version of the beloved COSRX Salicylic Acid Daily Gentle Cleanser. Same powerful BHA formula that gently exfoliates and removes impurities. Perfect size for travel, gym bags, or trying before committing to the full size.\n\nHow to Use: Wet face with lukewarm water. Apply a small amount and gently massage in circular motions for 30-60 seconds. Rinse thoroughly. Use morning and evening.',
        shortDescription: 'Travel-size BHA cleanser for acne-prone skin',
        ingredients: ['Saponaria Officinalis Leaf Extract', 'Betaine Salicylate', 'Tea Tree Leaf Oil', 'Cocamidopropyl Betaine'],
        skinTypes: ['oily', 'combination', 'sensitive'],
        stock: 3,
        images: [],
      },

      // ═══ MOISTURISERS ═══
      {
        name: 'COSRX Advanced Snail 92 All In One Cream',
        brand: brandIds.cosrx,
        category: catIds.moisturiser || catIds.skincare,
        price: 1200,
        description: 'A lightweight yet deeply nourishing cream formulated with 92% Snail Secretion Filtrate. This all-in-one cream provides intense hydration, aids in skin repair, and helps reduce the appearance of fine lines, acne scars, and hyperpigmentation. The snail mucin creates a protective moisture barrier while promoting cell regeneration.\n\nHow to Use: After cleansing and toning, apply an appropriate amount to face and neck. Gently pat until absorbed. Use morning and night. Can be layered under sunscreen during the day.',
        shortDescription: '92% snail mucin all-in-one repair and hydrating cream',
        ingredients: ['Snail Secretion Filtrate (92%)', 'Betaine', 'Sodium Hyaluronate', 'Panthenol', 'Arginine', 'Allantoin', 'Adenosine'],
        skinTypes: ['all'],
        stock: 2,
        images: [],
      },
      {
        name: 'CeraVe Skin Renewing Night Cream',
        brand: brandIds.cerave,
        category: catIds.moisturiser || catIds.skincare,
        price: 1800,
        description: 'A rich, restorative night cream developed with dermatologists. Contains peptide complex and three essential ceramides to help restore the skin\'s protective barrier overnight. The MVE technology provides controlled release of ceramides throughout the night for lasting hydration. Helps reduce the appearance of fine lines and wrinkles.\n\nHow to Use: Apply evenly to face and neck after cleansing and applying serums. Use nightly as the last step in your PM skincare routine. Avoid eye area.',
        shortDescription: 'Peptide-enriched night cream with ceramides for skin renewal',
        ingredients: ['Ceramide NP', 'Ceramide AP', 'Ceramide EOP', 'Peptide Complex', 'Hyaluronic Acid', 'Niacinamide', 'MVE Technology'],
        skinTypes: ['normal', 'dry', 'combination'],
        stock: 1,
        images: [],
      },
      {
        name: 'DABO Multi Function Moisturiser',
        brand: brandIds.dabo,
        category: catIds.moisturiser || catIds.skincare,
        price: 650,
        description: 'A Korean multi-function moisturiser that hydrates, brightens, and protects skin in one step. The lightweight gel-cream texture absorbs quickly without leaving a greasy residue. Packed with nourishing botanical extracts, this moisturiser helps maintain skin elasticity and provides a smooth, dewy finish all day.\n\nHow to Use: After cleansing and toning, apply an appropriate amount to face and neck. Massage gently in upward motions until fully absorbed. Use morning and evening.',
        shortDescription: 'Multi-function Korean moisturiser for all-day hydration',
        ingredients: ['Aloe Vera Extract', 'Hyaluronic Acid', 'Collagen', 'Green Tea Extract', 'Vitamin E', 'Snail Secretion Filtrate', 'Niacinamide'],
        skinTypes: ['all'],
        stock: 1,
        images: [],
      },
      {
        name: 'IUNIK Centella Calming Gel Cream',
        brand: brandIds.iunik,
        category: catIds.moisturiser || catIds.skincare,
        price: 1300,
        description: 'A soothing gel cream with 70% Centella Asiatica extract and tea tree leaf water. This lightweight moisturiser calms irritated and sensitive skin, reduces redness, and strengthens the skin barrier. The gel texture provides cooling hydration without clogging pores, making it perfect for oily and acne-prone skin types.\n\nHow to Use: Apply a suitable amount to clean face after toner/serum. Gently pat and press into skin for better absorption. Use morning and night.',
        shortDescription: '70% Centella calming gel cream for sensitive skin',
        ingredients: ['Centella Asiatica Extract (70%)', 'Tea Tree Leaf Water', 'Asiaticoside', 'Madecassic Acid', 'Asiatic Acid', 'Panthenol', 'Sodium Hyaluronate'],
        skinTypes: ['sensitive', 'oily', 'combination'],
        stock: 1,
        images: [],
      },
      {
        name: 'Simple Kind to Skin Light Moisturiser',
        brand: brandIds.simple,
        category: catIds.moisturiser || catIds.skincare,
        price: 600,
        description: 'A lightweight, non-greasy moisturiser with a blend of skin-loving vitamins and no harsh chemicals. This fast-absorbing formula provides instant hydration while being gentle enough for even the most sensitive skin. Free from artificial perfumes, dyes, and irritants.\n\nHow to Use: Apply to clean face and neck every morning and evening. Massage gently in upward circular motions. Can be used under makeup as a hydrating primer.',
        shortDescription: 'Lightweight moisturiser for sensitive skin',
        ingredients: ['Glycerin', 'Pro-Vitamin B5', 'Vitamin E', 'Borage Seed Oil', 'Bisabolol'],
        skinTypes: ['sensitive', 'normal', 'dry', 'all'],
        stock: 2,
        images: [],
      },
      {
        name: 'BIOAQUA Hyaluronic Acid Moisturising Cream',
        brand: brandIds.bioaqua,
        category: catIds.moisturiser || catIds.skincare,
        price: 400,
        description: 'An affordable yet effective moisturising cream infused with hyaluronic acid for deep hydration. This cream locks in moisture for up to 12 hours, plumps fine lines, and leaves skin feeling soft and supple. The non-sticky formula is suitable for daily use under sunscreen and makeup.\n\nHow to Use: After cleansing and toning, take an appropriate amount and dot on forehead, cheeks, nose, and chin. Massage gently until absorbed. Use twice daily.',
        shortDescription: 'Affordable hyaluronic acid moisturiser for daily hydration',
        ingredients: ['Hyaluronic Acid', 'Glycerin', 'Squalane', 'Vitamin E', 'Jojoba Oil', 'Shea Butter'],
        skinTypes: ['dry', 'normal', 'combination', 'all'],
        stock: 4,
        images: [],
      },
      {
        name: "Pond's Super Light Gel Moisturiser",
        brand: brandIds.ponds,
        category: catIds.moisturiser || catIds.skincare,
        price: 350,
        description: "A super lightweight gel moisturiser enriched with hyaluronic acid and Vitamin E. This oil-free formula provides 24-hour hydration with a non-sticky, matte finish. The fast-absorbing gel texture makes it perfect for oily and combination skin types. Clinically tested to provide intense hydration without clogging pores.\n\nHow to Use: Apply evenly on face and neck after cleansing. Massage in gentle upward strokes. Use morning and night. Works well as a makeup base.",
        shortDescription: 'Oil-free gel moisturiser for lightweight hydration',
        ingredients: ['Hyaluronic Acid', 'Vitamin E', 'Glycerin', 'Niacinamide', 'Dimethicone'],
        skinTypes: ['oily', 'combination', 'normal'],
        stock: 6,
        images: [],
      },
      {
        name: 'Mamaearth Vitamin C Face Moisturiser',
        brand: brandIds.mamaearth,
        category: catIds.moisturiser || catIds.skincare,
        price: 500,
        description: 'A natural, toxin-free face moisturiser enriched with Vitamin C and SPF 20. Helps brighten skin, reduce dark spots, and protect against UV damage. Made with natural ingredients and free from parabens, sulfates, and mineral oil. Dermatologically tested and suitable for daily use.\n\nHow to Use: Take a pea-sized amount and apply evenly on face and neck. Massage gently until absorbed. Use every morning after cleansing and toning for best results.',
        shortDescription: 'Natural Vitamin C moisturiser with SPF 20',
        ingredients: ['Vitamin C', 'Turmeric Extract', 'SPF 20', 'Aloe Vera', 'Shea Butter', 'Squalane'],
        skinTypes: ['normal', 'dry', 'combination'],
        stock: 1,
        images: [],
      },

      // ═══ SUNSCREENS ═══
      {
        name: 'Missha All Around Safe Block Cotton Sun SPF50+',
        brand: brandIds.missha,
        category: catIds.sunscreen || catIds.skincare,
        price: 950,
        description: 'A lightweight, cotton-like finish sunscreen with SPF50+ PA++++ broad-spectrum protection. This sunscreen applies smoothly with zero white cast, leaving a soft matte cotton finish. Enriched with calming botanical extracts to soothe skin while providing powerful UV protection.\n\nHow to Use: Apply generously as the last step of skincare, 15 minutes before sun exposure. Reapply every 2-3 hours when outdoors. Use daily, even on cloudy days.',
        shortDescription: 'SPF50+ PA++++ cotton-finish sunscreen with no white cast',
        ingredients: ['Zinc Oxide', 'Titanium Dioxide', 'Centella Asiatica Extract', 'Chamomile Extract', 'Aloe Vera', 'Hyaluronic Acid'],
        skinTypes: ['all'],
        stock: 6,
        images: [],
      },
      {
        name: 'Missha All Around Safe Block Aqua Sun Gel SPF50+',
        brand: brandIds.missha,
        category: catIds.sunscreen || catIds.skincare,
        price: 950,
        description: 'A refreshing aqua gel sunscreen with SPF50+ PA++++ protection. This water-gel formula provides a cooling, hydrating sensation while protecting against both UVA and UVB rays. The lightweight, non-greasy texture is perfect for hot and humid climates. Absorbs quickly without any sticky or heavy feeling.\n\nHow to Use: Apply a sufficient amount to face and exposed areas 15 minutes before sun exposure. Reapply every 2-3 hours. Can be worn under makeup.',
        shortDescription: 'SPF50+ PA++++ refreshing aqua gel sunscreen',
        ingredients: ['Homosalate', 'Ethylhexyl Methoxycinnamate', 'Hyaluronic Acid', 'Aloe Vera Extract', 'Trehalose', 'Witch Hazel'],
        skinTypes: ['oily', 'combination', 'normal'],
        stock: 5,
        images: [],
      },
      {
        name: 'LAIKOU Japan Sakura Sunscreen SPF50+',
        brand: brandIds.laikou,
        category: catIds.sunscreen || catIds.skincare,
        price: 500,
        description: 'A Japanese-inspired cherry blossom sunscreen with SPF50+ PA+++ broad-spectrum UV protection. Infused with sakura extract and collagen to brighten skin while shielding it from harmful UV rays. The lightweight, non-greasy formula doubles as a makeup primer with a subtle pink tone-up effect.\n\nHow to Use: Apply as the last step of your morning skincare routine. Spread evenly across face, neck, and ears. Reapply every 2-3 hours during sun exposure.',
        shortDescription: 'Cherry blossom sunscreen SPF50+ with brightening effect',
        ingredients: ['Sakura (Cherry Blossom) Extract', 'Collagen', 'Hyaluronic Acid', 'Vitamin E', 'Titanium Dioxide', 'Zinc Oxide'],
        skinTypes: ['all'],
        stock: 3,
        images: [],
      },
      {
        name: 'Missha Soft Finish Sun Milk SPF50+',
        brand: brandIds.missha,
        category: catIds.sunscreen || catIds.skincare,
        price: 950,
        description: 'A milky-textured sun protector with SPF50+ PA+++ that delivers a soft, velvety finish. This sunscreen milk provides broad-spectrum protection while maintaining a lightweight, comfortable feel throughout the day. Contains sebum-controlling properties to prevent midday shine, making it ideal for oily skin types.\n\nHow to Use: Shake well before use. Apply evenly on face and neck as the last step in your skincare routine. Reapply every 2-3 hours when exposed to sun.',
        shortDescription: 'SPF50+ milky sunscreen with soft, velvety finish',
        ingredients: ['Titanium Dioxide', 'Zinc Oxide', 'Tocopheryl Acetate', 'Rose Water', 'Hyaluronic Acid', 'Ciclopentasiloxane'],
        skinTypes: ['oily', 'combination', 'normal'],
        stock: 4,
        images: [],
      },
      {
        name: 'SKIN 1004 Madagascar Centella Air-Fit Suncream SPF50+',
        brand: brandIds.skin1004,
        category: catIds.sunscreen || catIds.skincare,
        price: 1200,
        description: 'A lightweight, chemical sunscreen enriched with Madagascar Centella Asiatica. This air-fit formula provides SPF50+ PA++++ protection with a weightless, transparent finish. Centella Asiatica soothes sensitive skin while protecting against UV damage. No white cast, no greasy feel — just clean, comfortable sun protection.\n\nHow to Use: Apply a generous amount to face and neck as the last step of your morning routine. Reapply every 2-3 hours during prolonged sun exposure.',
        shortDescription: 'Centella-infused air-fit suncream SPF50+ PA++++',
        ingredients: ['Centella Asiatica Extract', 'Madecassoside', 'Asiaticoside', 'Niacinamide', 'Hyaluronic Acid', 'Adenosine'],
        skinTypes: ['sensitive', 'all'],
        stock: 5,
        images: [],
      },
      {
        name: 'Missha Tone Up Sun Cream SPF50+',
        brand: brandIds.missha,
        category: catIds.sunscreen || catIds.skincare,
        price: 900,
        description: 'A tone-up sun cream that brightens your complexion while providing SPF50+ PA++++ sun protection. This multi-functional sunscreen evens out skin tone with a natural, radiant finish. Contains lavender extract and rose water for a calming skincare experience. Perfect as a makeup base for a naturally luminous look.\n\nHow to Use: Apply an appropriate amount on face and neck after moisturiser. Blend evenly for instant tone-up effect. Reapply every 2-3 hours. Can be used as a makeup primer.',
        shortDescription: 'SPF50+ tone-up sun cream for brightened complexion',
        ingredients: ['Titanium Dioxide', 'Lavender Extract', 'Rose Water', 'Niacinamide', 'Hyaluronic Acid', 'Adenosine'],
        skinTypes: ['all'],
        stock: 12,
        images: [],
      },

      // ═══ BODY CARE ═══
      {
        name: 'Rajkonna Body Lotion',
        brand: brandIds.rajkonna,
        category: catIds.bodyLotion || catIds.bodycare,
        price: 350,
        description: 'A nourishing body lotion formulated with natural herbal extracts for soft, supple skin all day. This lightweight lotion absorbs quickly without leaving a sticky residue. Enriched with turmeric and milk proteins to brighten and moisturise body skin. Ideal for the Bangladeshi climate.\n\nHow to Use: Apply generously all over body after shower on slightly damp skin for best absorption. Massage until fully absorbed. Reapply to dry areas as needed throughout the day.',
        shortDescription: 'Herbal body lotion for soft, supple skin',
        ingredients: ['Turmeric Extract', 'Milk Protein', 'Glycerin', 'Shea Butter', 'Vitamin E', 'Aloe Vera'],
        skinTypes: ['all'],
        stock: 2,
        images: [],
      },
      {
        name: 'Vaseline Intensive Care Body Lotion',
        brand: brandIds.vaseline,
        category: catIds.bodyLotion || catIds.bodycare,
        price: 400,
        description: 'A clinically proven body lotion with healing micro-droplets of Vaseline jelly and pure oat extract. This intensive care formula provides deep moisture that absorbs fast and heals very dry skin from within. Non-greasy and long-lasting, keeping skin moisturised for up to 48 hours.\n\nHow to Use: Apply liberally to body after bathing or showering. Massage into skin, paying extra attention to rough and dry areas like elbows, knees, and heels. Use daily.',
        shortDescription: 'Deep moisture body lotion for very dry skin',
        ingredients: ['Petroleum Jelly (Vaseline)', 'Oat Extract', 'Glycerin', 'Stearic Acid', 'Dimethicone', 'Isopropyl Palmitate'],
        skinTypes: ['dry', 'normal', 'all'],
        stock: 2,
        images: [],
      },

      // ═══ MICELLAR WATER / TONER ═══
      {
        name: 'Innsaei Low pH Micellar Water',
        brand: brandIds.innsaei,
        category: catIds.toner || catIds.skincare,
        price: 500,
        description: 'A gentle, low-pH micellar water that effectively removes makeup, dirt, and impurities without the need for rinsing. The pH-balanced formula (5.5) respects the skin\'s acid mantle while micelles act like magnets to attract and lift away oil and makeup. Leaves skin feeling clean, refreshed, and hydrated.\n\nHow to Use: Saturate a cotton pad with micellar water. Gently press against face and swipe away makeup and impurities. Repeat until the pad comes clean. No rinsing required, but you can follow with your cleanser if preferred.',
        shortDescription: 'pH-balanced micellar water for gentle makeup removal',
        ingredients: ['Micelle Technology', 'Centella Asiatica Extract', 'Panthenol', 'Hyaluronic Acid', 'Allantoin', 'Green Tea Extract'],
        skinTypes: ['sensitive', 'all'],
        stock: 4,
        images: [],
      },
      {
        name: 'skinO Brightening Micellar Water',
        brand: brandIds.skino,
        category: catIds.toner || catIds.skincare,
        price: 450,
        description: 'A brightening micellar water infused with niacinamide and vitamin C. Gently removes makeup, sunscreen, and impurities while brightening skin tone with each use. The no-rinse formula is perfect for quick cleansing on the go. Alcohol-free and gentle enough for the eye area.\n\nHow to Use: Soak a cotton pad generously. Gently wipe face, eyes, and lips to remove makeup and impurities. No rinsing needed. Use as the first step of your cleansing routine or for quick touch-ups.',
        shortDescription: 'Brightening micellar water with niacinamide and vitamin C',
        ingredients: ['Niacinamide', 'Vitamin C', 'Micelle Complex', 'Rose Water', 'Witch Hazel', 'Glycerin'],
        skinTypes: ['all'],
        stock: 4,
        images: [],
      },

      // ═══ LIP CARE ═══
      {
        name: 'Laneige Lip Sleeping Mask',
        brand: brandIds.laneige,
        category: catIds.skincare,
        price: 950,
        description: 'A cult-favorite overnight lip treatment that delivers intense moisture and nourishment while you sleep. Enriched with Berry Mix Complex (strawberry, raspberry, cranberry, blueberry) and vitamin C, this mask gently melts away dead skin cells and locks in moisture for plumper, smoother lips by morning.\n\nHow to Use: Apply a generous layer on lips before bedtime as the last step of your nighttime skincare routine. Leave overnight. Gently wipe off any remaining product in the morning with a tissue or cotton pad.',
        shortDescription: 'Overnight berry lip mask for soft, plump lips',
        ingredients: ['Berry Mix Complex', 'Vitamin C', 'Hyaluronic Acid', 'Shea Butter', 'Coconut Oil', 'Murumuru Seed Butter', 'Beta-Glucan'],
        skinTypes: ['all'],
        stock: 9,
        images: [],
      },
      {
        name: 'Sexy Pink Lip Tint',
        brand: brandIds.generic,
        category: catIds.skincare,
        price: 250,
        description: 'A long-lasting lip tint that delivers a natural, rosy pink flush to your lips. The lightweight formula provides buildable color that stays put for hours without smudging. Enriched with moisturising ingredients to prevent lips from drying out. Perfect for a no-makeup makeup look.\n\nHow to Use: Apply a thin layer to clean, dry lips. Build up color intensity by layering. For a gradient lip look, apply only to the center of lips and blend outward with your finger.',
        shortDescription: 'Long-lasting rosy pink lip tint',
        ingredients: ['Jojoba Oil', 'Vitamin E', 'Rose Extract', 'Shea Butter', 'Natural Colorants'],
        skinTypes: ['all'],
        stock: 5,
        images: [],
      },

      // ═══ MASKS & TREATMENTS ═══
      {
        name: 'Blackhead Peel-Off Mask',
        brand: brandIds.bioaqua,
        category: catIds.skincare,
        price: 300,
        description: 'A deep-cleansing charcoal peel-off mask designed to remove blackheads, whiteheads, and excess sebum. The activated charcoal formula draws out impurities from pores while bamboo extract helps tighten and minimize pore appearance. Reveals smoother, cleaner skin after each use.\n\nHow to Use: Cleanse face and open pores with warm water or steam. Apply a thick, even layer to T-zone or affected areas, avoiding eyebrows and hairline. Wait 15-20 minutes until completely dry. Peel off from edges gently. Use 1-2 times per week.',
        shortDescription: 'Charcoal peel-off mask for blackhead removal',
        ingredients: ['Activated Charcoal', 'Bamboo Extract', 'Glycerin', 'PVA', 'Witch Hazel', 'Tea Tree Oil'],
        skinTypes: ['oily', 'combination'],
        stock: 2,
        images: [],
      },
      {
        name: 'BIOAQUA Facial Sheet Mask',
        brand: brandIds.bioaqua,
        category: catIds.skincare,
        price: 100,
        description: 'A hydrating sheet mask drenched in nutrient-rich essence to deliver intensive moisture and nourishment in just 15-20 minutes. The soft, breathable sheet conforms to facial contours for maximum absorption. Available in various formulas to address different skin concerns.\n\nHow to Use: After cleansing and toning, unfold the mask and place it on your face, adjusting around eyes, nose, and mouth. Leave on for 15-20 minutes. Remove mask and gently pat remaining essence into skin. Do not rinse. Use 2-3 times per week.',
        shortDescription: 'Hydrating sheet mask for instant skin nourishment',
        ingredients: ['Hyaluronic Acid', 'Aloe Vera Extract', 'Glycerin', 'Collagen', 'Vitamin E', 'Centella Asiatica'],
        skinTypes: ['all'],
        stock: 1,
        images: [],
      },
      {
        name: 'Hydrating Face Mask Pack (3pcs)',
        brand: brandIds.generic,
        category: catIds.skincare,
        price: 350,
        description: 'A pack of 3 premium hydrating face masks for weekly skincare pampering. Each mask is soaked in concentrated serum with hyaluronic acid and botanical extracts. Provides deep hydration, brightening, and soothing benefits. The breathable fabric ensures maximum essence absorption for plump, glowing skin.\n\nHow to Use: Cleanse face thoroughly. Apply mask and smooth out any air bubbles. Relax for 15-20 minutes. Remove and pat remaining serum into skin. No rinsing needed. Use 2-3 times per week for best results.',
        shortDescription: 'Pack of 3 hydrating masks for weekly pampering',
        ingredients: ['Hyaluronic Acid', 'Niacinamide', 'Aloe Vera', 'Green Tea Extract', 'Collagen', 'Vitamin C'],
        skinTypes: ['all'],
        stock: 3,
        images: [],
      },

      // ═══ SERUMS ═══
      {
        name: 'Glutathione Brightening Serum',
        brand: brandIds.glutathione,
        category: catIds.serum || catIds.skincare,
        price: 600,
        description: 'A powerful brightening serum formulated with Glutathione, the master antioxidant. This potent formula helps reduce melanin production, fade dark spots and hyperpigmentation, and even out skin tone for a radiant, luminous complexion. Also helps protect skin from environmental damage and premature aging.\n\nHow to Use: After cleansing and toning, apply 2-3 drops to face and neck. Gently pat and press into skin until absorbed. Follow with moisturiser. Use morning and evening for best results. Always use sunscreen during the day.',
        shortDescription: 'Powerful glutathione serum for skin brightening',
        ingredients: ['Glutathione', 'Vitamin C', 'Niacinamide', 'Alpha Arbutin', 'Hyaluronic Acid', 'Licorice Root Extract'],
        skinTypes: ['all'],
        stock: 3,
        images: [],
      },
      {
        name: 'AXIS-Y Dark Spot Correcting Glow Serum',
        brand: brandIds.axisy,
        category: catIds.serum || catIds.skincare,
        price: 1400,
        description: 'A brightening serum with 5 types of vitamins and niacinamide to correct dark spots and uneven skin tone. This multi-vitamin complex works synergistically to inhibit melanin production, brighten existing dark spots, and boost overall skin radiance. Lightweight and fast-absorbing for easy layering.\n\nHow to Use: After cleansing and toning, dispense 2-3 drops onto fingertips. Apply to face, focusing on areas with dark spots or hyperpigmentation. Gently pat until absorbed. Follow with moisturiser. Use morning and evening.',
        shortDescription: 'Multi-vitamin dark spot correcting serum',
        ingredients: ['Niacinamide (5%)', 'Vitamin C', 'Vitamin E', 'Rice Bran Extract', 'Hippophae Rhamnoides (Sea Buckthorn)', 'Centella Asiatica'],
        skinTypes: ['all'],
        stock: 1,
        images: [],
      },
      {
        name: 'Dr.Althea 345 Relief Cream',
        brand: brandIds.drAlthea,
        category: catIds.moisturiser || catIds.skincare,
        price: 1100,
        description: 'A dermatologist-developed relief cream with a powerful blend of Panthenol (3%), Madecassoside (4%), and Ceramide (5%) — the "345" formula. This intensive cream repairs damaged skin barriers, calms irritation and redness, and provides deep hydration. Clinically tested and suitable for post-procedure skin recovery.\n\nHow to Use: Apply a generous amount to clean face and neck. Gently press and pat into skin. Use morning and night. Can be applied as a thick layer for overnight mask treatment 2-3 times per week.',
        shortDescription: '345 formula relief cream for barrier repair',
        ingredients: ['Panthenol (3%)', 'Madecassoside (4%)', 'Ceramide NP (5%)', 'Centella Asiatica Extract', 'Squalane', 'Beta-Glucan', 'Allantoin'],
        skinTypes: ['sensitive', 'dry', 'all'],
        stock: 4,
        images: [],
      },
      {
        name: 'skinO Advanced Brightening Serum',
        brand: brandIds.skino,
        category: catIds.serum || catIds.skincare,
        price: 800,
        description: 'An advanced brightening serum that targets dark spots, dullness, and uneven skin tone. Formulated with a potent blend of Alpha Arbutin, Vitamin C, and Niacinamide for maximum brightening efficacy. This lightweight serum absorbs quickly, leaving skin visibly brighter and more radiant with consistent use.\n\nHow to Use: After cleansing and toning, apply 3-4 drops to face and neck. Gently massage in upward motions. Follow with moisturiser. Use in your AM and PM routine. Pair with sunscreen during the day.',
        shortDescription: 'Advanced brightening serum with Alpha Arbutin',
        ingredients: ['Alpha Arbutin', 'Vitamin C (Ascorbic Acid)', 'Niacinamide', 'Hyaluronic Acid', 'Licorice Root Extract', 'Mulberry Extract'],
        skinTypes: ['all'],
        stock: 4,
        images: [],
      },
      {
        name: 'SKIN 1004 Madagascar Centella Brightening Ampoule',
        brand: brandIds.skin1004,
        category: catIds.serum || catIds.skincare,
        price: 1400,
        description: 'A brightening ampoule combining the soothing power of Madagascar Centella Asiatica with brightening agents. This concentrated formula helps reduce hyperpigmentation while calming sensitive skin. The lightweight, watery texture layers beautifully under other products. Sourced from pure Centella Asiatica grown in Madagascar.\n\nHow to Use: After cleansing and toning, drop 2-3 drops onto palm. Gently press into face and neck. Can be mixed with moisturiser for extra hydration. Use morning and evening.',
        shortDescription: 'Centella brightening ampoule from Madagascar',
        ingredients: ['Centella Asiatica Extract', 'Niacinamide', 'Glutathione', 'Asiaticoside', 'Madecassic Acid', 'Panthenol', 'Hyaluronic Acid'],
        skinTypes: ['sensitive', 'all'],
        stock: 5,
        images: [],
      },

      // ═══ THE ORDINARY RANGE ═══
      {
        name: 'The Ordinary Caffeine Solution 5% + EGCG Eye Serum',
        brand: brandIds.theOrdinary,
        category: catIds.serum || catIds.skincare,
        price: 900,
        description: 'A concentrated eye serum with 5% caffeine and EGCG (Epigallocatechin Gallatyl Glucoside) from green tea leaves. Targets dark circles, puffiness, and under-eye bags by reducing fluid buildup and strengthening blood vessel walls. The lightweight formula absorbs quickly without irritation.\n\nHow to Use: Apply a small amount (1-2 drops) to the under-eye area using your ring finger. Gently pat — do not rub. Use morning and evening before moisturiser. Can also be applied to the eyelid area.',
        shortDescription: '5% caffeine eye serum for dark circles and puffiness',
        ingredients: ['Caffeine (5%)', 'EGCG', 'Glycerin', 'Hyaluronic Acid Crosspolymer', 'Maltodextrin'],
        skinTypes: ['all'],
        stock: 1,
        images: [],
      },
      {
        name: 'The Ordinary Argireline Solution 10%',
        brand: brandIds.theOrdinary,
        category: catIds.serum || catIds.skincare,
        price: 1000,
        description: 'A lightweight peptide serum with 10% Argireline peptide complex that targets dynamic expression lines and wrinkles. Works by relaxing facial muscle contractions to visibly reduce the appearance of crow\'s feet, forehead lines, and frown lines. A non-invasive alternative approach to expression lines.\n\nHow to Use: Apply a few drops to areas prone to expression lines (forehead, around eyes, between brows). Gently pat into skin. Use morning and evening before heavier treatments. Avoid combining with direct acids.',
        shortDescription: '10% Argireline peptide serum for expression lines',
        ingredients: ['Acetyl Hexapeptide-8 (Argireline) 10%', 'Sodium Hyaluronate Crosspolymer', 'Glycerin', 'Triethanolamine'],
        skinTypes: ['all'],
        stock: 2,
        images: [],
      },
      {
        name: 'The Ordinary Ascorbyl Glucoside Solution 12%',
        brand: brandIds.theOrdinary,
        category: catIds.serum || catIds.skincare,
        price: 1100,
        description: 'A stable, water-soluble Vitamin C derivative serum at 12% concentration. Ascorbyl Glucoside brightens skin tone, reduces signs of aging, and helps protect against environmental damage. Unlike pure Vitamin C, this derivative is stable and gentle, making it suitable for sensitive skin types.\n\nHow to Use: Apply a few drops to face in the morning and/or evening after cleansing and toning. Follow with moisturiser. Pairs well with sunscreen for maximum anti-oxidant protection during the day.',
        shortDescription: '12% stable Vitamin C derivative for brightening',
        ingredients: ['Ascorbyl Glucoside (12%)', 'Propanediol', 'Triethanolamine', 'Isoceteth-20', 'Glycerin'],
        skinTypes: ['all'],
        stock: 1,
        images: [],
      },
      {
        name: 'The Ordinary AHA 30% + BHA 2% Peeling Solution',
        brand: brandIds.theOrdinary,
        category: catIds.serum || catIds.skincare,
        price: 1100,
        description: 'A powerful 10-minute exfoliating treatment with 30% Alpha Hydroxy Acids (glycolic, lactic, tartaric, citric) and 2% Beta Hydroxy Acid (salicylic). This blood-red solution dramatically improves skin texture, unclogs pores, reduces hyperpigmentation, and reveals brighter, smoother skin. NOT for sensitive or damaged skin.\n\nHow to Use: Apply evenly to clean, dry face in the evening. Avoid eye area, lips, and broken skin. Leave on for NO MORE than 10 minutes. Rinse thoroughly with lukewarm water. Use only 1-2 times per week. ALWAYS use sunscreen the next day.',
        shortDescription: 'Intense AHA/BHA 10-minute exfoliating treatment',
        ingredients: ['Glycolic Acid', 'Lactic Acid', 'Salicylic Acid (2%)', 'Tartaric Acid', 'Citric Acid', 'Tasmanian Pepperberry', 'Hyaluronic Acid Crosspolymer'],
        skinTypes: ['oily', 'combination', 'normal'],
        stock: 2,
        images: [],
      },
      {
        name: 'The Ordinary Hyaluronic Acid 2% + B5',
        brand: brandIds.theOrdinary,
        category: catIds.serum || catIds.skincare,
        price: 950,
        description: 'A hydrating serum with 2% Hyaluronic Acid in low, medium, and high molecular weights, combined with pro-vitamin B5. This multi-depth hydration formula draws moisture into all layers of the skin for plumper, smoother, more hydrated skin. The lightweight, water-based formula layers easily in any routine.\n\nHow to Use: Apply a few drops to face and neck after cleansing on damp skin for best results. Follow with heavier products (oils, moisturisers). Use morning and evening. Works with all other skincare products.',
        shortDescription: 'Multi-weight hyaluronic acid serum for deep hydration',
        ingredients: ['Hyaluronic Acid (2%)', 'Sodium Hyaluronate', 'Sodium Hyaluronate Crosspolymer', 'Panthenol (Pro-Vitamin B5)', 'Ahnfeltia Concinna Extract'],
        skinTypes: ['all'],
        stock: 1,
        images: [],
      },
      {
        name: 'The Ordinary Multi-Peptide Serum for Hair Density 30ml',
        brand: brandIds.theOrdinary,
        category: catIds.hairSerum || catIds.haircare,
        price: 1200,
        description: 'A concentrated peptide serum for hair and scalp that targets hair density and thickness. This multi-peptide complex improves the appearance of hair density by supporting the hair follicle environment. Contains caffeine, biotin, and multiple peptides to nourish the scalp and support healthy hair growth.\n\nHow to Use: Apply a few drops directly to clean, towel-dried scalp. Massage gently into areas of concern. Use daily — do not rinse out. Can be used in the morning or evening. Part hair into sections for better scalp coverage.',
        shortDescription: 'Multi-peptide scalp serum for hair density and thickness',
        ingredients: ['Multi-Peptide Complex', 'Caffeine', 'Biotin', 'Castor Oil', 'Redensyl', 'Procapil', 'CAPIXYL', 'AnaGain'],
        skinTypes: ['all'],
        stock: 26,
        images: [],
      },
      {
        name: 'The Ordinary Alpha Arbutin 2% + HA',
        brand: brandIds.theOrdinary,
        category: catIds.serum || catIds.skincare,
        price: 1050,
        description: 'A concentrated serum with 2% Alpha Arbutin — a potent brightening agent that works by inhibiting tyrosinase activity to reduce melanin production. Combined with Hyaluronic Acid for added hydration. Targets dark spots, post-inflammatory hyperpigmentation, age spots, and uneven skin tone for a brighter, more even complexion.\n\nHow to Use: Apply a few drops to face and neck in the morning and evening after cleansing. Follow with heavier serums and moisturiser. Pair with Vitamin C for enhanced brightening. Use sunscreen during the day.',
        shortDescription: '2% Alpha Arbutin brightening serum with HA',
        ingredients: ['Alpha Arbutin (2%)', 'Hyaluronic Acid', 'Sodium Hyaluronate', 'Lactic Acid/Glycolic Acid Copolymer'],
        skinTypes: ['all'],
        stock: 8,
        images: [],
      },
      {
        name: 'The Ordinary Salicylic Acid 2% Solution',
        brand: brandIds.theOrdinary,
        category: catIds.serum || catIds.skincare,
        price: 950,
        description: 'A targeted treatment serum with 2% Salicylic Acid (BHA) for acne-prone and congested skin. Salicylic acid is oil-soluble, allowing it to penetrate deep into pores to dissolve sebum buildup and dead skin cells. Helps reduce breakouts, blackheads, whiteheads, and excess oiliness.\n\nHow to Use: Apply a thin layer to affected areas in the evening after cleansing. Avoid the eye area. Start with every other day and gradually increase to daily use. Always use sunscreen during the day. Do not combine with other strong acids.',
        shortDescription: '2% BHA serum for acne and congested pores',
        ingredients: ['Salicylic Acid (2%)', 'Witch Hazel Water', 'Cocamidopropyl Dimethylamine', 'Polysorbate 20', 'Hydroxyethylcellulose'],
        skinTypes: ['oily', 'combination'],
        stock: 8,
        images: [],
      },
      {
        name: 'The Ordinary Retinol 0.5% in Squalane',
        brand: brandIds.theOrdinary,
        category: catIds.serum || catIds.skincare,
        price: 1100,
        description: 'A medium-strength retinol serum in a base of pure plant-derived Squalane. Retinol (Vitamin A) helps reduce fine lines, wrinkles, and signs of aging by increasing cell turnover. The squalane base provides hydration and reduces potential irritation. This 0.5% concentration is ideal for those who have already used retinol.\n\nHow to Use: Apply 2-3 drops to face in the PM only, after water-based serums. Follow with moisturiser. Start 2-3 times per week and gradually increase frequency. ALWAYS use sunscreen the next morning. Do NOT combine with other retinoids, AHA/BHA, or Vitamin C.',
        shortDescription: '0.5% retinol anti-aging serum in squalane',
        ingredients: ['Retinol (0.5%)', 'Squalane', 'Jojoba Seed Oil', 'Caprylic/Capric Triglyceride', 'Rosehip Oil'],
        skinTypes: ['normal', 'combination', 'dry'],
        stock: 5,
        images: [],
      },
      {
        name: 'The Ordinary Retinol 1% in Squalane',
        brand: brandIds.theOrdinary,
        category: catIds.serum || catIds.skincare,
        price: 1200,
        description: 'A high-strength retinol serum with 1% pure retinol in nourishing Squalane. This potent formula delivers maximum anti-aging benefits — reducing wrinkles, fine lines, age spots, and improving skin texture. Recommended only for experienced retinol users who have built up tolerance. Squalane prevents excessive drying and irritation.\n\nHow to Use: Apply 2-3 drops to face in the PM only after water-based serums. Start once a week and slowly increase. ALWAYS follow with moisturiser and use SPF50+ sunscreen the next day. NOT for retinol beginners — start with 0.2% or 0.5% first.',
        shortDescription: 'High-strength 1% retinol serum for experienced users',
        ingredients: ['Retinol (1%)', 'Squalane', 'Jojoba Seed Oil', 'Caprylic/Capric Triglyceride', 'Tocopherol (Vitamin E)'],
        skinTypes: ['normal', 'combination'],
        stock: 4,
        images: [],
      },
      {
        name: 'The Ordinary Glycolic Acid 7% Toning Solution 100ml',
        brand: brandIds.theOrdinary,
        category: catIds.toner || catIds.skincare,
        price: 1200,
        description: 'A 7% toning solution with Glycolic Acid (AHA) that exfoliates the skin\'s surface to improve clarity, visible texture, and radiance with continued use. Enhanced with Aloe Vera, Ginseng, and Tasmanian Pepperberry to reduce irritation. An at-home chemical exfoliant for brighter, smoother skin.\n\nHow to Use: Use once daily in the evening. Apply to face and neck using a cotton pad after cleansing. Avoid the eye area. Do not rinse. Follow with moisturiser. ALWAYS use sunscreen the next day. Do not use with other direct acids, retinoids, or Vitamin C.',
        shortDescription: '7% glycolic acid toner for texture and brightness',
        ingredients: ['Glycolic Acid (7%)', 'Aloe Barbadensis Leaf Water', 'Panax Ginseng Root Water', 'Tasmannia Lanceolata Fruit Extract', 'Glycerin'],
        skinTypes: ['oily', 'combination', 'normal'],
        stock: 1,
        images: [],
      },

      // ═══ TOOLS & ACCESSORIES ═══
      {
        name: 'Derma Roller 0.5mm',
        brand: brandIds.generic,
        category: catIds.skincare,
        price: 350,
        description: 'A professional micro-needling derma roller with 540 titanium needles at 0.5mm depth. This at-home micro-needling device creates tiny micro-channels in the skin to enhance absorption of serums and skincare products by up to 300%. Helps stimulate collagen production, reduce acne scars, minimize pores, and improve overall skin texture.\n\nHow to Use: Sanitize the roller with 70% isopropyl alcohol before use. Apply serum on clean face. Roll 4-5 times in each direction (horizontal, vertical, diagonal) with light pressure. Apply serums immediately after. Clean and store roller properly. Use once a week. Replace roller every 3 months.',
        shortDescription: '0.5mm titanium derma roller for enhanced product absorption',
        ingredients: [],
        skinTypes: ['all'],
        stock: 2,
        images: [],
      },

      // ═══ HAIR & OIL ═══
      {
        name: 'Argan Oil for Hair & Skin',
        brand: brandIds.generic,
        category: catIds.haircare,
        price: 500,
        description: 'Pure, cold-pressed Moroccan Argan Oil — the "liquid gold" for hair and skin. Rich in vitamin E, fatty acids, and antioxidants. This multi-purpose oil deeply nourishes dry hair, tames frizz, adds shine, and strengthens hair strands. Also works as a face and body moisturiser for dry skin.\n\nHow to Use: For hair — apply 2-3 drops to damp hair ends after washing or to dry hair as a finishing oil. For face — pat 1-2 drops onto clean face before moisturiser. For body — massage a few drops into dry areas. Can also be used as a cuticle oil.',
        shortDescription: 'Pure Moroccan argan oil for hair nourishment and skin',
        ingredients: ['100% Pure Argania Spinosa (Argan) Kernel Oil', 'Vitamin E', 'Oleic Acid', 'Linoleic Acid', 'Omega-6 Fatty Acids'],
        skinTypes: ['dry', 'normal', 'all'],
        stock: 1,
        images: [],
      },
      {
        name: 'skinO Clarifying Shampoo',
        brand: brandIds.skino,
        category: catIds.hairShampoo || catIds.haircare,
        price: 550,
        description: 'A clarifying shampoo that deep cleanses the scalp to remove product buildup, excess oil, and impurities. Formulated with tea tree oil and salicylic acid to maintain a healthy, balanced scalp environment. Gently exfoliates the scalp without stripping natural oils, leaving hair feeling clean, fresh, and volumized.\n\nHow to Use: Wet hair thoroughly. Apply a generous amount to scalp and lather well, massaging with fingertips for 2-3 minutes. Rinse thoroughly. Repeat if needed. Follow with conditioner on lengths and ends. Use 2-3 times per week.',
        shortDescription: 'Deep-cleansing scalp clarifying shampoo',
        ingredients: ['Tea Tree Oil', 'Salicylic Acid', 'Biotin', 'Zinc Pyrithione', 'Peppermint Oil', 'Ketoconazole'],
        skinTypes: ['all'],
        stock: 3,
        images: [],
      },

      // ═══ JAPAN SAKURA RANGE ═══
      {
        name: 'LAIKOU Japan Sakura Skincare Travel Kit',
        brand: brandIds.laikou,
        category: catIds.combo,
        price: 800,
        description: 'A complete sakura skincare travel kit featuring miniature versions of the beloved Japan Sakura range. This set includes cleanser, toner, serum, and moisturiser — all infused with cherry blossom extract for brightening, hydrating, and anti-aging benefits. Perfect for travel or trying the full sakura routine.\n\nHow to Use: Use in order — cleanser, toner, serum, then moisturiser. Morning and evening. Follow up with sakura sunscreen during the day for complete protection.',
        shortDescription: 'Complete cherry blossom skincare travel set',
        ingredients: ['Sakura (Cherry Blossom) Extract', 'Hyaluronic Acid', 'Collagen', 'Vitamin C', 'Glycerin', 'Niacinamide'],
        skinTypes: ['all'],
        stock: 1,
        images: [],
      },
      {
        name: 'LAIKOU Japan Sakura Moisturising Cream 25g',
        brand: brandIds.laikou,
        category: catIds.moisturiser || catIds.skincare,
        price: 350,
        description: 'A compact moisturising cream enriched with Japanese cherry blossom extract and collagen. This lightweight cream deeply hydrates, brightens skin tone, and reduces the appearance of fine lines. The sakura extract provides antioxidant protection while leaving skin feeling silky smooth with a subtle floral scent.\n\nHow to Use: After cleansing and toning, apply a small amount to face and neck. Gently massage in upward circular motions until absorbed. Use morning and evening. Perfect size for on-the-go skincare.',
        shortDescription: 'Compact sakura moisturiser for brightening and hydration',
        ingredients: ['Sakura Extract', 'Collagen', 'Hyaluronic Acid', 'Glycerin', 'Shea Butter', 'Vitamin E'],
        skinTypes: ['all'],
        stock: 11,
        images: [],
      },
      {
        name: 'LAIKOU Japan Sakura Brightening Cream 60g',
        brand: brandIds.laikou,
        category: catIds.moisturiser || catIds.skincare,
        price: 650,
        description: 'The full-size version of the popular Japan Sakura cream. A luxurious brightening cream with concentrated cherry blossom extract, collagen, and hyaluronic acid. Provides intensive hydration, brightens dull skin, and helps reduce dark spots and uneven skin tone. The rich yet non-greasy formula absorbs beautifully for a dewy, youthful glow.\n\nHow to Use: After cleansing, toning, and applying serum, take an appropriate amount and apply to face and neck. Massage gently until fully absorbed. Use morning and night for best brightening results.',
        shortDescription: 'Full-size sakura brightening cream with collagen',
        ingredients: ['Sakura Extract', 'Collagen', 'Hyaluronic Acid', 'Niacinamide', 'Vitamin C', 'Glycerin', 'Shea Butter'],
        skinTypes: ['all'],
        stock: 3,
        images: [],
      },

      // ═══ BATH SALTS ═══
      {
        name: 'Relaxing Bath Salt Blend',
        brand: brandIds.generic,
        category: catIds.bathSalt || catIds.bodycare,
        price: 400,
        description: 'A therapeutic blend of mineral-rich bath salts infused with essential oils for ultimate relaxation. Contains Himalayan pink salt, Dead Sea salt, and Epsom salt to detoxify the body, relieve muscle tension, improve circulation, and soften skin. The aromatic essential oils provide a spa-like aromatherapy experience.\n\nHow to Use: Add 2-3 tablespoons of bath salt to warm running bath water. Stir to dissolve. Soak for 15-20 minutes. Rinse with clean water after bathing. For foot soak, use 1-2 tablespoons in a basin of warm water. Use 2-3 times per week.',
        shortDescription: 'Mineral-rich bath salt blend for relaxation and detox',
        ingredients: ['Himalayan Pink Salt', 'Dead Sea Salt', 'Epsom Salt (Magnesium Sulfate)', 'Lavender Essential Oil', 'Eucalyptus Oil', 'Vitamin E'],
        skinTypes: ['all'],
        stock: 3,
        images: [],
      },
    ];

    // ── Seed products ────────────────────────────────────────────
    console.log(`\n📦 Seeding ${products.length} products...\n`);

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const product of products) {
      try {
        // Check if product already exists
        const exists = await Product.findOne({ name: product.name });
        if (exists) {
          console.log(`  ⚠️  SKIPPED (exists): ${product.name}`);
          skipped++;
          continue;
        }

        await Product.create(product);
        console.log(`  ✅ ${product.name} (stock: ${product.stock})`);
        created++;
      } catch (err) {
        console.error(`  ❌ ${product.name}: ${err.message}`);
        errors++;
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log(`✅ ${created} products created`);
    console.log(`⚠️  ${skipped} products skipped (already exist)`);
    if (errors > 0) console.log(`❌ ${errors} errors`);
    console.log('🎉 Product seeding complete!');
    console.log('═══════════════════════════════════════\n');

    process.exit();
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
