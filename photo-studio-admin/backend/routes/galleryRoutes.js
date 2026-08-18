const express = require('express');
const { getGalleryImages, createGalleryImage, deleteGalleryImage } = require('../controllers/galleryController');

const router = express.Router();

router.get('/', getGalleryImages); // Public website portfolio
router.post('/', createGalleryImage); // Admin dashboard upload
router.delete('/:id', deleteGalleryImage); // Admin dashboard removal

module.exports = router;
