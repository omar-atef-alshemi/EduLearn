require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// 1. استدعاء ملف الـ Socket من الفولدر الجديد
const setupChatSocket = require('./socket/chatSocket');

// 2. استدعاء الـ Controllers والـ Routes
const paymentController = require('./controllers/paymentController');
const { getAllCourses } = require('./controllers/adminController');
const authRoutes = require('./routes/authRoute');
const adminRoutes = require('./routes/adminRoutes');
const courseRoutes = require('./routes/teacherRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const studentRoutes = require('./routes/studentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const chatRoutes = require('./routes/chatRoutes'); // تأكد إن المسار لملف الروتس صح
const reviewRoutes = require('./routes/reviewRoutes');
const examRoutes = require('./routes/examRoutes');
const app = express();
app.use(cors({
  origin: "http://localhost:4200",
  credentials: true
}));

// 3. الـ Webhook (يجب أن يكون قبل express.json)
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

app.use(express.json());
app.use(cookieParser());

// 4. الاتصال بقاعدة البيانات
connectDB();

// 5. إعداد الـ Server و Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: { 
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        credentials: true
    }
});
// 6. تشغيل منطق الشات من الملف الخارجي
setupChatSocket(io);

// 7. تعريف المسارات (Routes)
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/courses', courseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/student', studentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/v1/chats', chatRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/exams', examRoutes);
app.get('/api/public/all-courses', getAllCourses);
// 8. تشغيل السيرفر
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server & Socket running on port ${PORT}`));