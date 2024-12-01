const cloudinary = require('cloudinary').v2;

// Cloudinary config (assumed set up in .env)
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} catch (error) {
  console.error('Error configuring Cloudinary:', error.message);
}

async function uploadToCloudinary(filePath) {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(filePath, { resource_type: "raw" }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
    return result.secure_url; // Return Cloudinary URL
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error.message);
    return `Error uploading to Cloudinary: ${error.message}`;
  }
}

module.exports = uploadToCloudinary;
