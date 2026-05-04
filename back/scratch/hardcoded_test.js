const cloudinary = require('cloudinary').v2;

// Hardcoding for absolute certainty in this test
cloudinary.config({
  cloud_name: 'dkdiarly1',
  api_key: '939143792785991',
  api_secret: 'NbMgZ2efsOIUtm1OEZBa7Nh2iZM',
  secure: true
});

async function testHardcodedUpload() {
  try {
    console.log("Testing with HARDCODED credentials...");
    const res = await cloudinary.uploader.upload("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", {
      folder: "debug"
    });
    console.log("✅ SUCCESS:", res.secure_url);
  } catch (err) {
    console.error("❌ FAILED:", JSON.stringify(err, null, 2));
  }
}

testHardcodedUpload();
