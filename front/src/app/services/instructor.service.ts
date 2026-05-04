import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private apiUrl = 'http://localhost:5000/courses';

  constructor(private http: HttpClient) { }

  getMyCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-courses`);
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getStudentInquiries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/inquiries`);
  }

  getStudentList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/students`);
  }

  getProfile(): Observable<any> {
    return this.http.get(`http://localhost:5000/auth/me`); 
  }

  getEarningsDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/earnings`);
  }

  getTeacherReviews(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reviews`);
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, courseData);
  }

  getCourseById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  uploadVideo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('video', file);
    return this.http.post(`${this.apiUrl}/upload-video`, formData);
  }

  // الرفع المباشر لـ Cloudinary (صور أو فيديوهات)
  directToCloudinary(file: File, type: 'video' | 'image' = 'video'): Observable<any> {
    const cloudName = 'dkdiarly1';
    const uploadPreset = 'ml_default'; 
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    return this.http.post(url, formData);
  }

  updateCourse(id: string, courseData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, courseData);
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  createExam(examData: any): Observable<any> {
    return this.http.post(`http://localhost:5000/exams`, examData);
  }
}
