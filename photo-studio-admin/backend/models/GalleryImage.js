const mongoose = require('mongoose');

// Images are kept in MongoDB so uploads remain available after the API restarts
// and can be returned directly to the public website without a separate CDN.
const galleryImageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    category: { type: String, required: true, trim: true, maxlength: 50 },
    eventType: { type: String, required: true, trim: true, maxlength: 50 },
    location: { type: String, required: true, trim: true, maxlength: 100 },
    eventDate: { type: Date, required: true },
    photoCount: { type: Number, required: true, min: 1, max: 100000 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    featured: { type: Boolean, default: false },
    imagesData: { type: [String], default: [] }, // all photographs in the album
    imageData: { type: String, required: true }, // validated JPG, PNG, or WebP data URL
  },
  { timestamps: true }
);

galleryImageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
