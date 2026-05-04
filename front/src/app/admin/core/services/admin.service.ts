import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  ApiResponse, DashboardStats,
  Teacher, CreateTeacherDto,
  Student, Course, Exam, Content,
  Enrollment, Review, Progress
} from '../models';

export interface ListParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  courseId?: string;
  studentId?: string;
}

export interface ListResult<T> {
  [key: string]: any;
  total: number;
  page: number;
  pages: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService extends ApiService {

  // ══════════════════════════════════════════════
  //  DASHBOARD
  // ══════════════════════════════════════════════
  getDashboard(): Observable<ApiResponse<DashboardStats>> {
    return this.get<DashboardStats>('/admin/dashboard');
  }

  // ══════════════════════════════════════════════
  //  TEACHERS
  // ══════════════════════════════════════════════
  getAllTeachers(params?: ListParams): Observable<ApiResponse<ListResult<Teacher>>> {
    return this.get('/admin/teachers', params);
  }

  createTeacher(data: CreateTeacherDto): Observable<ApiResponse<{ user: any; teacher: Teacher }>> {
    return this.post('/admin/teachers', data);
  }

  updateTeacher(id: string, data: Partial<Teacher>): Observable<ApiResponse<Teacher>> {
    return this.put(`/admin/teachers/${id}`, data);
  }

  activateTeacher(id: string): Observable<ApiResponse<any>> {
    return this.patch(`/admin/teachers/${id}/activate`);
  }

  deactivateTeacher(id: string): Observable<ApiResponse<any>> {
    return this.patch(`/admin/teachers/${id}/deactivate`);
  }

  deleteTeacher(id: string): Observable<ApiResponse<null>> {
    return this.delete(`/admin/teachers/${id}`);
  }

  updateTeacherStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Observable<ApiResponse<Teacher>> {
    return this.patch(`/admin/teachers/${id}/status`, { status });
  }

  // ══════════════════════════════════════════════
  //  STUDENTS
  // ══════════════════════════════════════════════
  getAllStudents(params?: ListParams): Observable<ApiResponse<ListResult<Student>>> {
    return this.get('/admin/students', params);
  }

  updateStudent(id: string, data: Partial<Student>): Observable<ApiResponse<Student>> {
    return this.put(`/admin/students/${id}`, data);
  }

  deleteStudent(id: string): Observable<ApiResponse<null>> {
    return this.delete(`/admin/students/${id}`);
  }
  activateStudent(id: string): Observable<ApiResponse<any>> {
  return this.patch(`/admin/users/${id}/activate`, {});
}

deactivateStudent(id: string): Observable<ApiResponse<any>> {
  return this.patch(`/admin/users/${id}/deactivate`, {});
}

  // ══════════════════════════════════════════════
  //  COURSES
  // ══════════════════════════════════════════════
  getAllCourses(params?: ListParams): Observable<ApiResponse<ListResult<Course>>> {
    return this.get('/admin/courses', params);
  }

  getPendingCourses(): Observable<ApiResponse<Course[]>> {
    return this.get('/admin/courses/pending');
  }

  updateCourse(id: string, data: Partial<Course>): Observable<ApiResponse<Course>> {
    return this.put(`/admin/courses/${id}`, data);
  }

  approveCourse(id: string): Observable<ApiResponse<Course>> {
    return this.patch(`/admin/courses/${id}/approve`);
  }

  rejectCourse(id: string): Observable<ApiResponse<Course>> {
    return this.patch(`/admin/courses/${id}/reject`);
  }

  deleteCourse(id: string): Observable<ApiResponse<null>> {
  // تأكد أن المسار يطابق الـ Backend تماماً
  return this.delete(`/admin/courses/${id}`); 
}
updateCourseStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Observable<ApiResponse<Course>> {
  return this.patch(`/admin/courses/${id}/status`, { status });
}
  // ══════════════════════════════════════════════
  //  SECTIONS
  // ══════════════════════════════════════════════
  getPendingSections(): Observable<ApiResponse<any[]>> {
    return this.get('/admin/sections/pending');
  }

  approveSection(courseId: string, sectionId: string): Observable<ApiResponse<any>> {
    return this.patch(`/admin/courses/${courseId}/sections/${sectionId}/approve`);
  }

  approveContent(contentId: string): Observable<ApiResponse<Content>> {
    return this.patch(`/admin/contents/${contentId}/approve`);
  }
getCourseById(id: string): Observable<ApiResponse<Course>> {
  return this.get(`/admin/courses/${id}`);
}

  // ══════════════════════════════════════════════
  //  EXAMS
  // ══════════════════════════════════════════════
  getPendingExams(): Observable<ApiResponse<Exam[]>> {
  return this.get('/admin/exams/pending');
}

  approveExam(examId: string): Observable<ApiResponse<Exam>> {
    return this.patch(`/admin/exams/${examId}/approve`);
  }
getAllExams(): Observable<ApiResponse<any>> {
  return this.get('/admin/exams');
}

rejectExam(examId: string): Observable<ApiResponse<any>> {
  return this.patch(`/admin/exams/${examId}/reject`);
}



  // ══════════════════════════════════════════════
  //  ENROLLMENTS
  // ══════════════════════════════════════════════
  getAllEnrollments(params?: ListParams): Observable<ApiResponse<ListResult<Enrollment>>> {
    return this.get('/admin/enrollments', params);
  }

  createEnrollment(studentId: string, courseId: string): Observable<ApiResponse<Enrollment>> {
    return this.post('/admin/enrollments', { studentId, courseId });
  }

  deleteEnrollment(id: string): Observable<ApiResponse<null>> {
    return this.delete(`/admin/enrollments/${id}`);
  }

  // ══════════════════════════════════════════════
  //  REVIEWS
  // ══════════════════════════════════════════════
  toggleReview(id: string): Observable<ApiResponse<Review>> {
    return this.patch(`/admin/reviews/${id}/toggle`);
  }

  // ══════════════════════════════════════════════
  //  PROGRESS
  // ══════════════════════════════════════════════
  getAllProgress(): Observable<ApiResponse<Progress[]>> {
    return this.get('/admin/progress');
  }

  getUserCourseProgress(userId: string, courseId: string): Observable<ApiResponse<Progress>> {
    return this.get(`/admin/progress/${userId}/${courseId}`);
  }

  updateProgress(userId: string, courseId: string, completionPercentage: number): Observable<ApiResponse<Progress>> {
    return this.put(`/admin/progress/${userId}/${courseId}`, { completionPercentage });
  }
}
