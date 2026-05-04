import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // التعديل الأساسي هنا: غيرنا المسار ليكون /student بدل /api
  private apiUrl = 'http://localhost:5000/student'; 

  constructor(private http: HttpClient) { }

  // 1. جلب الكورسات (المسار: /student/my-courses)
  getUserEnrollments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-courses`);
  }

  // 2. جلب بيانات الداشبورد (المسار: /student/dashboard)
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`);
  }

  // 3. جلب تفاصيل الكورس (المسار: /student/course/:courseId)
  getCourseContent(courseId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/course/${courseId}`);
  }

  // 4. جلب الامتحان النهائي (المسار: /student/:courseId/final-exam)
  getFinalExam(courseId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}/final-exam`);
  }

  // 5. إكمال الدرس (المسار الجديد اللي كان ناقص عندك)
  completeLesson(courseId: string, sectionId: string, lessonId: string): Observable<any> {
    const url = `${this.apiUrl}/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/complete`;
    return this.http.put<any>(url, {}); // الباك إند بيستخدم PUT هنا
  }

  // 6. الاشتراك في كورس (مجاني أو دفع)
  enrollInCourse(courseId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/enroll/${courseId}`, {});
  }

  // 7. تقديم الامتحان (سواء سيكشن أو فاينل)
  submitExam(courseId: string, examId: string, answers: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/exam/${examId}/submit`, { courseId, answers });
  }

  // 8. جلب بيانات الكورس العامة (بدون تشفير أو حماية)
  getCourseById(courseId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:5000/courses/${courseId}`);
  }
  // 🔥🔥🔥 حطها هنا جوه الكلاس
  createCheckoutSession(courseId: string): Observable<any> {
    return this.http.post(
      'http://localhost:5000/api/payments/checkout',
      { courseId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );
  }
  confirmEnrollment(courseId: string) {
  const token = localStorage.getItem('accessToken');
  const headers = { 'Authorization': `Bearer ${token}` };
  return this.http.post(`${this.apiUrl}/payments/confirm-enrollment`, { courseId }, { headers });
}
}
