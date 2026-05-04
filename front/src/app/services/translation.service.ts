import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = new BehaviorSubject<string>(localStorage.getItem('lang') || 'en');
  lang$ = this.currentLang.asObservable();

  private dictionary: any = {
    en: {
      dashboard: 'Instructor Dashboard',
      welcome: 'Welcome back',
      today_msg: 'Here is what is happening today.',
      course_manager: 'Course Manager',
      student_list: 'Student List',
      earnings: 'Earnings',
      logout: 'Logout',
      search: 'Search courses...',
      new_content: 'New Content',
      view_reports: 'View Reports',
      monthly_revenue: 'Monthly Revenue',
      active_students: 'Active Students',
      avg_rating: 'Avg. Course Rating',
      pending_approvals: 'Pending Approvals',
      course_title: 'Course Title',
      students: 'Students',
      status: 'Status',
      earnings_growth: 'Earnings Growth',
      recent_inquiries: 'Recent Student Inquiries',
      view_all: 'View All',
      unread: 'Unread',
      go_to_inbox: 'Go to Inbox',
      total_ytd: 'Total YTD Earnings',
      back_to_dashboard: 'Back to Dashboard',
      create_new_course: 'Create New Course',
      course_setup_msg: 'Define units, lessons, and exams',
      basic_information: 'Basic Information',
      course_title_en: 'Course Title (English)',
      course_title_ar: 'Course Title (Arabic)',
      category: 'Category',
      select_category: 'Select Category',
      price: 'Price',
      thumbnail_url: 'Thumbnail URL',
      curriculum: 'Curriculum',
      add_unit: 'Add New Unit',
      progress: 'Progress',
      search_placeholder: 'Search students...'
    },
    ar: {
      dashboard: 'لوحة تحكم المدرس',
      welcome: 'مرحباً بعودتك',
      today_msg: 'إليك ما يحدث اليوم.',
      course_manager: 'إدارة الكورسات',
      student_list: 'قائمة الطلاب',
      earnings: 'الأرباح',
      logout: 'تسجيل الخروج',
      search: 'بحث عن الكورسات...',
      new_content: 'محتوى جديد',
      view_reports: 'عرض التقارير',
      monthly_revenue: 'الدخل الشهري',
      active_students: 'الطلاب النشطون',
      avg_rating: 'متوسط التقييم',
      pending_approvals: 'طلبات معلقة',
      course_title: 'اسم الكورس',
      students: 'الطلاب',
      status: 'الحالة',
      earnings_growth: 'نمو الأرباح',
      recent_inquiries: 'استفسارات الطلاب الأخيرة',
      view_all: 'عرض الكل',
      unread: 'غير مقروء',
      go_to_inbox: 'الذهاب للبريد',
      total_ytd: 'إجمالي أرباح السنة',
      back_to_dashboard: 'العودة للوحة التحكم',
      create_new_course: 'إنشاء كورس جديد',
      course_setup_msg: 'قم بتعريف الوحدات، الدروس، والامتحانات',
      basic_information: 'المعلومات الأساسية',
      course_title_en: 'عنوان الكورس (بالانجليزية)',
      course_title_ar: 'عنوان الكورس (بالعربية)',
      category: 'التصنيف',
      select_category: 'اختر التصنيف',
      price: 'السعر',
      thumbnail_url: 'رابط صورة الغلاف',
      curriculum: 'المنهج الدراسي',
      add_unit: 'إضافة وحدة جديدة',
      progress: 'التقدم',
      search_placeholder: 'بحث عن الطلاب...'
    }
  };

  setLanguage(lang: string) {
    this.currentLang.next(lang);
    localStorage.setItem('lang', lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  get(key: string): string {
    return this.dictionary[this.currentLang.value][key] || key;
  }

  getCurrentLang() {
    return this.currentLang.value;
  }
}
