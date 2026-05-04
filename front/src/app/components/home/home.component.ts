import { Component, OnInit } from '@angular/core'; // ضفنا OnInit
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router'; // ضيف RouterOutlet هنا
import { ApiService } from '../../services/api.service'; // تأكد إن المسار ده صح حسب صورتك

// استيراد السكاشن
import { HeroComponent } from '../hero/hero.component';
import { LearningStepsComponent } from '../learning-steps/learning-steps.component';
import { AcademySectionsComponent } from '../academy-sections/academy-sections.component';
import { FaqComponent } from '../faq/faq.component';
import { LatestCoursesComponent } from '../latest-courses/latest-courses.component';

import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    RouterOutlet,
    HeroComponent,
    LearningStepsComponent, 
    AcademySectionsComponent, 
    FaqComponent,
    LatestCoursesComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;
  dashboardLink: string = '/student/dashboard';
  userPhoto: string = 'assets/default-course.png'; 
  isDarkMode = true;

  constructor(private api: ApiService, private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.isDarkMode$.subscribe(isDark => this.isDarkMode = isDark);
    
    this.isLoggedIn = !!this.api.getAccessToken(); 
    
    if (this.isLoggedIn) {
    // في الـ ngOnInit بعد ما تتأكد إن الـ User مسجل دخول
this.api.getMe().subscribe({
  next: (res) => {
    const role = res.role || res.data?.role || 'student';
    this.dashboardLink = (role === 'instructor' || role === 'teacher') ? '/instructor/dashboard' : '/student/dashboard';
    
    // الطريقة الآمنة لتغيير الصورة
    const rawPhoto = res.data?.profileImage || res.profileImage;
    if (rawPhoto) {
      this.userPhoto = rawPhoto;
    }
  },
  error: () => {
    this.isLoggedIn = false;
    // لو حصل مشكلة في الـ Auth ارجع للصور الافتراضية الثابتة
  }
});
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}