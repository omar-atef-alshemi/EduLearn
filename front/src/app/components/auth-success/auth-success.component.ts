import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-auth-success',
  standalone: true,
  imports: [CommonModule],
  // شاشة تحميل بسيطة تظهر ثانية واحدة
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p class="text-lg font-medium">Finalizing Google Login...</p>
    </div>
  `
})
export class AuthSuccessComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('accessToken', token);

        this.api.getMe().subscribe({
          next: (res: any) => {
            const role = res.role || res.data?.role || 'student';
            const targetRoute = (role === 'instructor' || role === 'teacher') ? '/instructor/dashboard' : '/student/dashboard';
            this.router.navigate([targetRoute]);
          },
          error: () => {
            this.router.navigate(['/signin']);
          }
        });
      } else {
        this.router.navigate(['/signin']);
      }
    });
  }
}