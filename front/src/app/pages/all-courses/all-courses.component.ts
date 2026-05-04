// src/app/pages/all-courses/all-courses.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-all-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.css']
})
export class AllCoursesComponent implements OnInit {
  private courseService = inject(CourseService);

  categories = ['All', 'Fundamentals', 'Frontend Dev', 'Backend Dev', 'Mobile Apps', 'Networking', 'Data Science'];
  selectedCategory = 'All';
  allCourses: any[] = [];
  displayCourses: any[] = [];
  isDarkMode = true;
  comingSoonData: any = null;
  errorMessage = '';

  ngOnInit() {
    this.loadInitialData();
  }

  // دالة لجلب البيانات أول مرة
  loadInitialData() {
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
      this.allCourses = data.map((course: any) => ({
  ...course,
  id: course._id, // 🔥 مهم جدًا تضيف دي
  title: typeof course.title === 'object' ? course.title.en : course.title,
  thumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop'
}));
        this.filterData('All'); // اعرض الكل في البداية
      },
      error: (err) => {
        this.errorMessage = 'Failed to load courses.';
      }
    });
  }

  // ✅ الدالة اللي الـ HTML بينادي عليها (تم تعديل الاسم)
  filterData(category: string) {
    this.selectedCategory = category;
    this.comingSoonData = null;

    if (category === 'All') {
      this.displayCourses = this.allCourses;
    } else {
      this.displayCourses = this.allCourses.filter(c => c.category === category);
    }

    // لو القسم فاضي اظهر رسالة Coming Soon
    if (this.displayCourses.length === 0) {
      this.comingSoonData = {
        title: category,
        icon: '🚀',
        message: 'We are working hard to bring this path to life!'
      };
    }
  }



  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('light-mode', !this.isDarkMode);
    localStorage.setItem('user-theme', this.isDarkMode ? 'dark' : 'light');
  }
}