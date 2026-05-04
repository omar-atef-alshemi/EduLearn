const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// استخدام الرابط المباشر كما هو في .env
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL?.trim()
});

async function testUrlUpload() {
  try {
    console.log("Testing with CLOUDINARY_URL...");
    const res = await cloudinary.uploader.upload("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", {
      folder: "debug_url_test"
    });
    console.log("✅ SUCCESS:", res.secure_url);
  } catch (err) {
    console.error("❌ FAILED:", err);
  }
}

testUrlUpload();
