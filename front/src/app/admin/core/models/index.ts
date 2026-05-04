// ─── BASE ───────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

// ─── USER ───────────────────────────────────────────────────────
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  isVerified: boolean;
  isActive: boolean;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── TEACHER ─────────────────────────────────────────────────────
export interface Teacher {
  _id: string;
  userId: User | any;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  location?: { country: string; state: string };
  phone?: string;
  email?: string;
  linkedinUrl?: string;
  cvUrl?: string;
  educationLevel?: string;
  specialization?: string;
  experienceYears?: number;
  introVideoUrl?: string;
  certifications?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  location?: { country: string; state: string };
  phone?: string;
  linkedinUrl?: string;
  cvUrl?: string;
  educationLevel?: string;
  specialization?: string;
  experienceYears?: number;
  introVideoUrl?: string;
  certifications?: string[];
}

// ─── STUDENT ─────────────────────────────────────────────────────
export interface Student {
  _id: string;
  userId: User | any;
  firstName: string;
  lastName: string;
  phone?: string;
  certificateName?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── COURSE ──────────────────────────────────────────────────────
export interface LocalizedString {
  ar: string;
  en: string;
}

export interface Section {
  _id: string;
  title: LocalizedString;
  order: number;
  exam?: string;
  contents: string[];
  totalDuration: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Course {
  _id: string;
  title: LocalizedString;
  description?: LocalizedString;
  instructorId: User;
  category: string;
  price: number;
  thumbnail?: string;
  sections: Section[];
  status: 'pending' | 'approved' | 'rejected';
  isPublished: boolean;
  isDeleted: boolean;
  finalExam?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── CONTENT ─────────────────────────────────────────────────────
export interface Content {
  _id: string;
  courseId: string;
  sectionId: string;
  title: LocalizedString;
  type: 'video' | 'file' | 'assignment';
  fileUrl: string;
  fileType?: string;
  duration?: number;
  isFreePreview: boolean;
  order: number;
  status: 'pending' | 'approved' | 'rejected';
  isDeleted: boolean;
  createdAt: string;
}

// ─── EXAM ────────────────────────────────────────────────────────
export interface Question {
  _id: string;
  questionText: LocalizedString;
  options: { ar: string[]; en: string[] };
  grade: number;
}

export interface Exam {
  _id: string;
  courseId: Course | string;
  sectionId: string;
  title: LocalizedString;
  isFinal: boolean;
  duration: number;
  minScore: number;
  questions: Question[];
  maxAttempts: number;
  status: 'pending' | 'approved' | 'rejected';
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: string;
}

// ─── ENROLLMENT ──────────────────────────────────────────────────
export interface Enrollment {
  _id: string;
  studentId: User | any;
  courseId: Course;
  progressPercentage: number;
  status: 'pending' | 'active' | 'completed';
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── REVIEW ──────────────────────────────────────────────────────
export interface Review {
  _id: string;
  courseId?: string;
  studentId: User | any;
  rating: number;
  comment?: string;
  isFeatured: boolean;
  isApproved: boolean;
  createdAt: string;
}

// ─── PROGRESS ────────────────────────────────────────────────────
export interface Progress {
  _id: string;
  userId: User | any;
  courseId: Course;
  completedContents: string[];
  completedSections: string[];
  completionPercentage: number;
  isCourseCompleted: boolean;
  totalTimeSpent: number;
  createdAt: string;
  updatedAt: string;
}

// ─── DASHBOARD ───────────────────────────────────────────────────
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalEnrollments: number;
  pendingCourses: number;
  pendingSections: number;
  pendingExams: number;
  pendingContent: number;
}

// ─── PAYMENT ─────────────────────────────────────────────────────
export interface Payment {
  _id: string;
  studentId: User;
  courseId: Course;
  enrollmentId?: string;
  amount: number;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'stripe';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  notes?: string;
  createdAt: string;
}
