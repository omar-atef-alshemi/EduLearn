// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { ApiService } from '../services/api.service';

// @Component({
//   selector: 'app-sginin',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterLink],
//   templateUrl: './sginin.component.html',
//   styleUrls: ['./sginin.component.css']
// })
// export class SgininComponent {
//   // بيانات الفورم
//   loginData = {
//     email: '',
//     password: ''
//   };

//   isLoading = false;
//   errorMessage = '';

//   constructor(private api: ApiService, private router: Router) { }

//   onSubmit() {
//     if (!this.loginData.email || !this.loginData.password) {
//       this.errorMessage = 'Please fill in all fields.';
//       return;
//     }

//     this.isLoading = true;
//     this.errorMessage = '';

//     this.api.loginStudent(this.loginData).subscribe({
//       next: (res: any) => {
//         this.isLoading = false;
//         // حفظ التوكن في المتصفح
//         localStorage.setItem('accessToken', res.token);
//         // التوجه لصفحة الـ Dashboard (أو أي صفحة تختارها)
//         this.router.navigate(['/register']);
//       },
//       error: (err) => {
//         this.isLoading = false;
//         this.errorMessage = err.error?.message || 'Invalid email or password. Please try again.';
//       }
//     });
//   }

//   loginWithGoogle() {
//     // توجيه اليوزر لرابط جوجل في الباك إند
//     window.location.href = 'http://localhost:5000/auth/google';
//   }
// }
import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  loginData = { email: '', password: '' };
  isLoading = false;
  errorMessage = '';

  @ViewChildren('inputRef') inputElements!: QueryList<ElementRef>;

  constructor(private api: ApiService, private router: Router) { }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach(key => form.controls[key].markAsTouched());
      this.focusFirstInvalidInput();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    // مسح البيانات القديمة عشان ميبقاش فيه تداخل
    localStorage.clear();

    this.api.loginStudent(this.loginData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        
        // 1. استخراج الـ role (تأكد من شكل الـ response من الـ Network tab)
        const userRole = res.user?.role || res.role; 

        // 2. التوجيه بناءً على ملف الـ routes الخاص بك
        if (userRole === 'admin') {
          // حفظ بيانات اليوزر للأدمن عشان الـ AuthGuard بتاع الداشبورد الجديد يشوفها
          const adminUser = {
            _id: res.userId,
            email: res.email,
            role: res.role,
            firstName: res.firstName,
            lastName: res.lastName || ''
          };
          localStorage.setItem('user', JSON.stringify(adminUser));
          
          this.router.navigate(['/admin/dashboard']);
        } else if (userRole === 'instructor' || userRole === 'teacher') {
          // المسار اللي بيبدأ بـ /instructor وجواه الـ dashboard
          this.router.navigate(['/instructor/dashboard']); 
        } else {
          // التوجه لداشبورد الطالب
          this.router.navigate(['/student/dashboard']); 
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  }

  focusFirstInvalidInput() {
    const firstInvalid = this.inputElements.find(el => el.nativeElement.classList.contains('ng-invalid'));
    if (firstInvalid) firstInvalid.nativeElement.focus();
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:5000/auth/google';
  }
}