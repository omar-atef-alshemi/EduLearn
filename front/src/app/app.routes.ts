import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RoadmapDetailComponent } from './components/roadmap-detail/roadmap-detail.component';
import { CreateaccountComponent } from './components/createaccount/createaccount.component';
import { SigninComponent } from './components/signin/signin.component'
import { VerifyOtpComponent } from './components/verify-otp/verify-otp.component';
import { AuthSuccessComponent } from './components/auth-success/auth-success.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyResetCodeComponent } from './components/verify-reset-code/verify-reset-code.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { BecomeInstructorComponent } from './components/becomeinstructor/becomeinstructor.component';
import { MainLayoutComponent } from './main-layout.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { EarningsComponent } from './components/earnings/earnings.component';
import { CourseCreateComponent } from './components/course-create/course-create.component';
import { CourseEditComponent } from './components/course-edit/course-edit.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { ExamCreateComponent } from './components/exam-create/exam-create.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { ExamComponent } from './components/exam/exam.component';
export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' }, // دي الصفحة اللي هتظهر أول ما تفتح localhost:4200
  { path: 'roadmap/:id', component: RoadmapDetailComponent } // دي صفحة الروود ماب المنفصلة
,{ 
    path: 'all-courses', 
    loadComponent: () => import('./pages/all-courses/all-courses.component').then(m => m.AllCoursesComponent) 
  }
  ,{ path: 'register', component: CreateaccountComponent },

    { path: 'becomeinstructor', component: BecomeInstructorComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'verify-otp', component: VerifyOtpComponent },
    { path: 'auth/success', component: AuthSuccessComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'verify-reset-code', component: VerifyResetCodeComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    // { path: '', redirectTo: '/register', pathMatch: 'full' }
{
    path: 'instructor',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardHomeComponent },
      { path: 'courses', component: CourseListComponent },
      { path: 'exams', component: ExamCreateComponent }, // تعديل: أضفنا المسار الصحيح
      { path: 'create-exam', component: ExamCreateComponent },
      { path: 'students', component: StudentListComponent },
      { path: 'earnings', component: EarningsComponent },
      { path: 'create-course', component: CourseCreateComponent },
      { path: 'edit-course/:id', component: CourseEditComponent },
      { path: 'view-course/:id', loadComponent: () => import('./components/course-view/course-view.component').then(m => m.CourseViewComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
   // app.routes.ts
{
  path: 'admin',
  loadChildren: () => import('./admin/features/layout/layout.routes').then(m => m.LAYOUT_ROUTES)
},
{
  path: 'student',
  children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'my-courses', component: DashboardComponent },
    { path: 'profile', component: DashboardComponent },
    { path: 'certificates', component: DashboardComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]
},

// مسارات التفاصيل والامتحانات (خارج الداشبورد أو داخله حسب تصميمك)
{ path: 'course-details/:id', component: CourseDetailsComponent },
{ path: 'course-viewer/:id', loadComponent: () => import('./components/course-view/course-view.component').then(m => m.CourseViewComponent) },
{ path: 'exam/:id', component: ExamComponent },
];

