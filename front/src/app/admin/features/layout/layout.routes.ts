import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
      },
      {
        path: 'teachers',
        loadChildren: () =>
          import('../teachers/teachers.routes').then(m => m.TEACHERS_ROUTES),
      },
      {
        path: 'students',
        loadChildren: () =>
          import('../students/students.routes').then(m => m.STUDENTS_ROUTES),
      },
      {
        path: 'courses',
        loadChildren: () =>
          import('../courses/courses.routes').then(m => m.COURSES_ROUTES),
      },
      {
        path: 'exams',
        loadChildren: () =>
          import('../exams/exams.routes').then(m => m.EXAMS_ROUTES),
      },
      {
        path: 'enrollments',
        loadChildren: () =>
          import('../enrollments/enrollments.routes').then(m => m.ENROLLMENTS_ROUTES),
      },
      {
        path: 'reviews',
        loadChildren: () =>
          import('../reviews/reviews.routes').then(m => m.REVIEWS_ROUTES),
      },
      {
        path: 'progress',
        loadChildren: () =>
          import('../progress/progress.routes').then(m => m.PROGRESS_ROUTES),
      },
    ],
  },
];
