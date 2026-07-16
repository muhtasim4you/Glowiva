const slugify = require('slugify');

const brands = [
  'Dr.Althea',
  "I'M FROM",
  'Dot & Key',
  'The Derma Co.'
];

console.log('Slug verification:\n');
brands.forEach(brand => {
  const slug = slugify(brand, { lower: true, strict: true });
  console.log(`${brand.padEnd(20)} → ${slug}`);
});
