const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Please add an image']
  },
  mobileImage: {
    type: String,
    default: ''
  },
  buttonText: {
    type: String,
    default: 'SHOP NOW'
  },
  buttonLink: {
    type: String,
    default: '/products'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Banner', BannerSchema);
