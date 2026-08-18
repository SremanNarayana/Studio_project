const GalleryImage = require('../models/GalleryImage');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_ALBUM_IMAGES = 10;
const MAX_ALBUM_BYTES = 10 * 1024 * 1024;
const DATA_URL_PATTERN = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/;

function galleryView(image) {
  return {
    id: image._id,
    title: image.title,
    category: image.category,
    eventType: image.eventType,
    location: image.location,
    eventDate: image.eventDate,
    photoCount: image.photoCount,
    description: image.description,
    featured: image.featured,
    imageData: image.imageData,
    imagesData: image.imagesData?.length ? image.imagesData : [image.imageData],
    createdAt: image.createdAt,
  };
}

const getGalleryImages = asyncHandler(async (req, res) => {
  const images = await GalleryImage.find().sort({ createdAt: -1 }).limit(100);
  return sendSuccess(res, { message: 'Gallery images fetched successfully', data: images.map(galleryView) });
});

const createGalleryImage = asyncHandler(async (req, res) => {
  const { title, category, eventType, location, eventDate, photoCount, description, featured, imagesData } = req.body;
  if (!Array.isArray(imagesData) || imagesData.length === 0) throw new ApiError(400, 'Choose at least one album image');
  if (imagesData.length > MAX_ALBUM_IMAGES) throw new ApiError(400, `An album can contain up to ${MAX_ALBUM_IMAGES} images`);
  let totalBytes = 0;
  const validImages = imagesData.map((data) => {
    const match = String(data || '').match(DATA_URL_PATTERN);
    if (!match) throw new ApiError(400, 'Upload valid JPG, PNG, or WebP images');
    const byteLength = Buffer.byteLength(match[2], 'base64');
    if (byteLength > MAX_IMAGE_BYTES) throw new ApiError(400, 'Each image must be 5 MB or smaller');
    totalBytes += byteLength;
    return data;
  });
  if (totalBytes > MAX_ALBUM_BYTES) throw new ApiError(400, 'The combined album images must be 10 MB or smaller');
  if (!String(title || '').trim()) throw new ApiError(400, 'Image title is required');
  if (!String(category || '').trim()) throw new ApiError(400, 'Image category is required');
  if (!String(eventType || '').trim()) throw new ApiError(400, 'Event type is required');
  if (!String(location || '').trim()) throw new ApiError(400, 'Location is required');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(eventDate || '')) || Number.isNaN(new Date(`${eventDate}T00:00:00Z`).getTime())) {
    throw new ApiError(400, 'A valid event date is required');
  }
  if (!Number.isInteger(Number(photoCount)) || Number(photoCount) < 1 || Number(photoCount) > 100000) {
    throw new ApiError(400, 'Photo count must be a whole number between 1 and 100000');
  }
  if (String(description || '').length > 1000) throw new ApiError(400, 'Description must be 1000 characters or fewer');

  const image = await GalleryImage.create({
    title: title.trim(),
    category: category.trim(),
    eventType: eventType.trim(),
    location: location.trim(),
    eventDate,
    photoCount: Number(photoCount),
    description: String(description || '').trim(),
    featured: Boolean(featured),
    imageData: validImages[0], // first selected image is the album cover
    imagesData: validImages,
  });
  return sendSuccess(res, { statusCode: 201, message: 'Gallery image uploaded successfully', data: galleryView(image) });
});

const deleteGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.findByIdAndDelete(req.params.id);
  if (!image) throw new ApiError(404, 'Gallery image not found');
  return sendSuccess(res, { message: 'Gallery image removed successfully', data: { id: req.params.id } });
});

module.exports = { getGalleryImages, createGalleryImage, deleteGalleryImage };
