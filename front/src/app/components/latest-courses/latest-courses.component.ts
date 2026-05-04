import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // ✅ مهم جدًا
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-latest-courses',
  standalone: true,
  imports: [CommonModule, RouterLink], // ✅ أضف دي
  templateUrl: './latest-courses.component.html',
  styleUrls: ['./latest-courses.component.css']
})
export class LatestCoursesComponent implements OnInit {

  courses: any[] = [];
  displayCourses: any[] = [];
  loading: boolean = true;
  showAllButton: boolean = false;

  defaultCourseImage: string = 'assets/images/default-course.png';

  constructor(private courseService: CourseService) {}

 ngOnInit(): void {
  this.courseService.getAllCourses().subscribe({
    next: (courses: any[]) => {
      this.courses = courses.map(course => ({
        ...course,
        id: course._id || course.id,
        thumbnail: course.thumbnail 
      }));

      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });
}

  getCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (response: any) => {
        let rawData: any[] = [];

        if (Array.isArray(response)) {
          rawData = response;
        } else if (response?.data) {
          rawData = response.data;
        } else if (response?.courses) {
          rawData = response.courses;
        }

        this.courses = rawData.map((course: any) => ({
          ...course,
          id: course._id || course.id,
          thumbnail: course.thumbnail || this.defaultCourseImage
        }));

        this.displayCourses = this.courses.slice(0, 6);
        this.showAllButton = this.courses.length > 6;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}