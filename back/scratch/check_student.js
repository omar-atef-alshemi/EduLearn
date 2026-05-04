const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function checkStudents() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const student = await User.findOne({ role: 'student' });
    if (student) {
      console.log('FOUND_STUDENT:' + JSON.stringify({id: student._id, email: student.email}));
    } else {
      console.log('NO_STUDENT_FOUND');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkStudents();
