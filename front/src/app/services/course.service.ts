import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CourseService {

  private apiUrl = 'http://localhost:5000/api/public/all-courses';

  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response: any) => {
        console.log('API RESPONSE:', response);

        // ✅ المسار الصح
        if (response?.data?.courses && Array.isArray(response.data.courses)) {
          return response.data.courses;
        }

        return [];
      })
    );
  }
}