const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Teacher = require("../models/Teacher");
const Payment = require("../models/Payment");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// التعديل في دالة createCheckoutSession
// success_url: `http://localhost:4200/course/${courseId}?payment=success`,
// cancel_url : `http://localhost:4200/course/${courseId}?payment=cancel`,
/**
 * @desc Create a Stripe Checkout Session
 * @route POST /api/payments/checkout
 */
exports.createCheckoutSession = async (req, res) => {
  try {
    const { courseId } = req.body;
    // تأكدنا إننا بنمسك الـ ID ونحوله لـ String فوراً
    const studentId = (req.user._id || req.user.id).toString();

    if (!courseId) {
      return res.status(400).json({ success: false, message: "Missing courseId." });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              // تأمين الـ title لو كان Object أو String
              name: (typeof course.title === 'object' ? course.title.en : course.title) || "Course Enrollment",
            },
            unit_amount: course.price * 100, // السعر بالسنت
          },
          quantity: 1,
        },
      ],
      mode: "payment",
 success_url: `http://localhost:4200/course-details/${courseId}?payment=success`,
  cancel_url: `http://localhost:4200/course-details/${courseId}?payment=cancel`,
      metadata: {
        // 🔥 التعديل الجوهري هنا: لازم يكونوا Strings
        courseId: courseId.toString(),
        studentId: studentId, 
      },
    });

    // الرد الناجح اللي هيرجع للأنجولار
    res.status(200).json({ success: true, url: session.url });

  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ success: false, message: "Failed to create checkout session." });
  }
};
/**
 * @desc Handle Stripe Webhook
 * @route POST /api/payments/webhook
 */
exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  // 1. التحقق من التوقيع (Webhook Signature)
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("-----------------------------------------");
    console.log("🔔 Webhook Status: Verified ✅");
    console.log("📅 Event Type:", event.type);
  } catch (err) {
    console.error("❌ Webhook Signature Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2. معالجة نجاح عملية الدفع
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    
    // طباعة الـ Metadata للتأكد من وصول الـ IDs صح
    console.log("📦 Received Metadata:", session.metadata);

    const { courseId, studentId } = session.metadata;
    const amountPaid = session.amount_total / 100;

    if (!courseId || !studentId) {
      console.error("❌ CRITICAL: Missing courseId or studentId in metadata!");
      return res.status(400).json({ received: false });
    }

    try {
      console.log("🚀 Starting Database Operations...");

      // أ. تفعيل الاشتراك (Enrollment)
      const enrollment = await Enrollment.findOneAndUpdate(
        { studentId, courseId },
        { status: "active", updatedAt: new Date() },
        { upsert: true, new: true }
      );
      console.log("✅ Enrollment: Status updated to ACTIVE");

      // ب. جلب بيانات الكورس والمدرس
      const course = await Course.findById(courseId);
      if (!course) {
        throw new Error(`Course with ID ${courseId} not found in DB`);
      }

      // ج. حساب الأرباح (60/40)
      const instructorShare = amountPaid * 0.60;
      const adminShare = amountPaid * 0.40;

      // د. إنشاء سجل الدفع (Payment Record)
      // هنا استخدمت الـ New ثم Save عشان نقدر نمسك الـ Validation errors بدقة
      const paymentData = {
        studentId,
        courseId,
        enrollmentId: enrollment._id,
        amount: amountPaid,
        paymentMethod: "stripe",
        status: "completed",
        transactionId: session.id,
        adminShare: adminShare,
        instructorShare: instructorShare, // تأكد إن الاسم مطابق للـ Schema (instructorShare)
        notes: "Success via Stripe Webhook Tunnel"
      };

      const newPayment = new Payment(paymentData);
      await newPayment.save();
      console.log("✅ Payment: Record saved to Atlas successfully");

      // هـ. إضافة الربح لمحفظة المدرس
      const teacherUpdate = await Teacher.findByIdAndUpdate(
        course.teacherId,
        { $inc: { balance: instructorShare } },
        { new: true }
      );

      if (teacherUpdate) {
        console.log(`💵 Balance: +${instructorShare} added to Teacher ID: ${course.teacherId}`);
      } else {
        console.warn("⚠️ Warning: Teacher found but balance was not updated.");
      }

      console.log("🎯 ALL PROCESSES COMPLETED SUCCESSFULLY!");
      console.log("-----------------------------------------");

    } catch (dbError) {
      console.error("-----------------------------------------");
      console.error("❌ DATABASE ERROR DETAILS:");
      
      // لو الخطأ سببه الـ Schema (Validation) هيطبع لك الحقل اللي فيه مشكلة بالظبط
      if (dbError.errors) {
        Object.keys(dbError.errors).forEach(key => {
          console.error(`👉 Field [${key}]: ${dbError.errors[key].message}`);
        });
      } else {
        console.error("Error Message:", dbError.message);
      }
      
      // طباعة الـ Stack لو محتاجين نعرف السطر كام
      // console.error(dbError.stack);
      console.error("-----------------------------------------");
    }
  }

  // الرد على سترايب إننا استلمنا الطلب بنجاح
  res.json({ received: true });
};
exports.confirmEnrollmentManually = async (req, res) => {
    try {
        const { courseId } = req.body;
        const studentId = req.user._id || req.user.id; // التأكد من جلب الـ ID صح

        if (!courseId) {
            return res.status(400).json({ success: false, message: "Missing courseId" });
        }

        // تسجيل الاشتراك في الداتابيز أو تحديثه لـ active
        const enrollment = await Enrollment.findOneAndUpdate(
            { studentId, courseId },
            { 
                status: "active", 
                progressPercentage: 0,
                updatedAt: new Date() 
            },
            { upsert: true, new: true }
        );

        res.status(200).json({ success: true, data: enrollment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};