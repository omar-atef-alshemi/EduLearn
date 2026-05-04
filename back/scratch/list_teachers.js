const mongoose = require('mongoose');
require('dotenv').config();
const Teacher = require('../models/Teacher');
const User = require('../models/User');

async function listTeachers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const teachers = await Teacher.find().populate('userId');
    console.log('--- TEACHERS LIST ---');
    teachers.forEach(t => {
      console.log(`TeacherID: ${t._id}, UserID: ${t.userId?._id}, Email: ${t.userId?.email}, Name: ${t.userId?.firstName}`);
    });
    console.log('----------------------');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listTeachers();
