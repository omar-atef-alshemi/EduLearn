const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dkdiarly1',
  api_key: '939143792785991',
  api_secret: 'NbMgZ2efsOIUtm1OEZBa7Nh2iZM',
  secure: true
});

async function testPing() {
  try {
    console.log("Pinging Cloudinary...");
    const res = await cloudinary.api.ping();
    console.log("✅ PING SUCCESS:", res);
    
    console.log("Checking Account Usage...");
    // This requires the Admin API
    const usage = await cloudinary.api.usage();
    console.log("📊 USAGE INFO:", JSON.stringify(usage, null, 2));
    
  } catch (err) {
    console.error("❌ PING/USAGE FAILED:", err);
  }
}

testPing();
