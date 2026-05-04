const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dkdiarly1',
  api_key: '939143792785991',
  api_secret: 'WRONG_SECRET', // تجربة مفتاح خطأ
  secure: true
});

async function testWrongPing() {
  try {
    console.log("Pinging with WRONG secret...");
    const res = await cloudinary.api.ping();
    console.log("✅ PING SUCCESS (Unexpected!):", res);
  } catch (err) {
    console.log("❌ PING FAILED (Expected):", JSON.stringify(err, null, 2));
  }
}

testWrongPing();
