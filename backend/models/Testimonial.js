const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Please add customer name'],
    trim: true
  },
  comment: {
    type: String,
    required: [true, 'Please add a testimonial comment'],
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  image: {
    type: String,
    required: [true, 'Please add an image']
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5
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

module.exports = mongoose.model('Testimonial', TestimonialSchema);
