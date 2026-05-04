import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs'; // ضفنا tap هنا

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:5000/auth';
private coursesUrl = 'http://localhost:5000/courses'; // المسار التاني اللي فيه الإحصائيات

  constructor(private http: HttpClient) { }

  // 1. إدارة التوكن
  setAccessToken(token: string) { localStorage.setItem('accessToken', token); }
  getAccessToken() { return localStorage.getItem('accessToken'); }
  clearTokens() { localStorage.removeItem('accessToken'); }

  // 2. دالة الـ Headers السحرية اللي هتصلح الـ 401
  private getOptions() {
    const token = this.getAccessToken();
    return {
      headers: { 'Authorization': `Bearer ${token}` },
      withCredentials: true
    };
  }

  // 3. دوال الـ Dashboard اللي ناقصة عندك (عشان الأرقام تظهر)
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.coursesUrl}/stats`, this.getOptions());
  }

  getMyCourses(): Observable<any> {
    return this.http.get(`${this.coursesUrl}/my-courses`, this.getOptions());
  }

  getInstructorProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`, this.getOptions());

  }
  // في الـ ApiService

// دالة لجلب إحصائيات الكورسات (اللي فيها الـ Revenue والطلاب)
getStats(): Observable<any> {
  return this.http.get(`${this.coursesUrl}/stats`, this.getHeaders());
}

// دالة لجلب الاستفسارات (Inquiries) اللي كانت طالعة في الـ Console
getInquiries(): Observable<any> {
  return this.http.get(`${this.coursesUrl}/inquiries`, this.getHeaders());
}

// دالة لجلب المراجعات (Reviews)
getReviews(): Observable<any> {
  return this.http.get(`${this.coursesUrl}/reviews`, this.getHeaders());
}

  // 4. دوال الـ Auth (تأكد إنها بتخزن accessToken)
  // loginStudent(data: any): Observable<any> {
  //   return this.http.post(`${this.authUrl}/login`, data, { withCredentials: true }).pipe(
  //     tap((res: any) => {
  //       if (res?.accessToken) this.setAccessToken(res.accessToken);
  //     })
  //   );
  // }
  // constructor(private http: HttpClient) { }

  // // ==========================================
  // // 1. دوال إدارة التوكن في المتصفح
  // // ==========================================
  // setAccessToken(token: string) {
  //   localStorage.setItem('accessToken', token);
  // }

  // getAccessToken() {
  //   return localStorage.getItem('accessToken');
  // }

  // clearTokens() {
  //   localStorage.removeItem('accessToken');
  // }

  // ==========================================
  // 2. تعديل دوال تسجيل الدخول والـ OTP
  // ==========================================

  verifyOtp(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-otp`, data, { withCredentials: true }).pipe(
      tap((res: any) => {
        // رجعناها accessToken زي ما الباك إند بيبعتها بالظبط
        if (res && res.accessToken) {
          this.setAccessToken(res.accessToken);
        }
      })
    );
  }

  loginStudent(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data, { withCredentials: true }).pipe(
      tap((res: any) => {
        // رجعناها accessToken
        if (res && res.accessToken) {
          this.setAccessToken(res.accessToken);
        }
      })
    );
  }

  // ضيف الدالة دي مع باقي الدوال
  refreshToken(): Observable<any> {
    // بنبعت withCredentials عشان البراوزر يبعت الـ Refresh Token Cookie
    return this.http.post(`${this.baseUrl}/refresh`, {}, { withCredentials: true }).pipe(
      tap((res: any) => {
        if (res && res.accessToken) {
          this.setAccessToken(res.accessToken);
        }
      })
    );
  }

  logoutUser(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.clearTokens();
      })
    );
  }
  
  // ==========================================
  // 3. باقي دوالك زي ما هي بدون أي مساس
  // ==========================================

  registerStudent(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/student`, data);
  }

  forgetPassword(email: string) {
    return this.http.post(`${this.baseUrl}/forget-password`, { email });
  }

  verifyResetCode(resetCode: string) {
    return this.http.post(`${this.baseUrl}/verify-reset-code`, { resetCode });
  }

  resetPassword(data: any) {
    return this.http.post(`${this.baseUrl}/reset-password`, data);
  }

  resendResetCode(email: string) {
    return this.http.post(`${this.baseUrl}/forget-password`, { email });
  }

  resendOtp(email: string) {
    return this.http.post(`${this.baseUrl}/resend-otp`, { email });
  }

  uploadCV(file: File) {
    const formData = new FormData();
    formData.append('cv', file);
    return this.http.post<any>(`${this.baseUrl}/upload-cv`, formData);
  }

  registerTeacher(data: any) {
    return this.http.post<any>(`${this.baseUrl}/register/teacher`, data);
  }
// دالة مساعدة لعمل الـ Headers
private getHeaders() {
  const token = this.getAccessToken();
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    withCredentials: true
  };
}

// تعديل دالة getMe عشان تبعت التوكن صح
getMe(): Observable<any> {
  return this.http.get(`${this.baseUrl}/me`, this.getHeaders());
}
  // ضيف دي مع باقي الدوال
  // getMe(): Observable<any> {
  //   // افترضت إن مسار الدالة في الباك إند هو /auth/me، لو مختلف عندك عدله
  //   return this.http.get(`${this.baseUrl}/me`);
  // }
}
