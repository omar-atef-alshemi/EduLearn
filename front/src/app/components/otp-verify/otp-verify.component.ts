import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-otp-verify',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="supreme-auth-wrapper mesh-bg">
      <div class="auth-container">
        <div class="form-container-supreme slide-up glass-card-supreme">
          <div class="form-header-supreme text-center">
            <div class="logo-supreme">Edu<span>Learn</span></div>
            <h1>Verify Your Email</h1>
            <p>We've sent a 6-digit code to <br><strong>{{ email }}</strong></p>
          </div>

          <form (ngSubmit)="onSubmit()" class="supreme-form">
            <div class="otp-supreme-container">
              <input type="text" maxlength="6" [(ngModel)]="otpCode" name="otp" 
                     placeholder="000000" class="otp-supreme-input" required autocomplete="one-time-code">
            </div>

            <button type="submit" class="btn-supreme" [disabled]="loading || otpCode.length < 6">
              <span *ngIf="!loading">Verify Account</span>
              <div *ngIf="loading" class="spinner-white"></div>
            </button>

            <div class="resend-supreme">
              Didn't receive the code? 
              <button type="button" class="btn-resend-supreme" (click)="resendOtp()" [disabled]="resendLoading">
                {{ resendLoading ? 'Sending...' : 'Resend Code' }}
              </button>
            </div>

            <div *ngIf="error" class="supreme-error fade-in">
              <span>⚠️</span> {{ error }}
            </div>
            <div *ngIf="success" class="supreme-success fade-in">
              <span>✅</span> Email verified! Redirecting...
            </div>
          </form>

          <div class="supreme-footer">
            <a routerLink="/auth/login" class="back-link">← Back to Login</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .supreme-auth-wrapper {
      min-height: 100vh;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .glass-card-supreme {
      background: var(--glass);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--border);
      padding: 60px;
      border-radius: 40px;
      box-shadow: var(--shadow-lg);
      width: 100%;
      max-width: 460px;
    }

    .logo-supreme { font-size: 36px; font-weight: 900; margin-bottom: 24px; text-align: center; font-family: 'Outfit', sans-serif; letter-spacing: -1.5px; }
    .logo-supreme span { color: var(--primary); }

    .form-header-supreme { text-align: center; margin-bottom: 40px; }
    .form-header-supreme h1 { font-size: 32px; font-weight: 900; color: var(--text); margin-bottom: 12px; font-family: 'Outfit', sans-serif; }
    .form-header-supreme p { color: var(--text-sec); font-size: 16px; line-height: 1.6; }

    .supreme-form { display: flex; flex-direction: column; gap: 30px; }

    .otp-supreme-input {
      width: 100%;
      font-size: 48px;
      letter-spacing: 20px;
      text-align: center;
      font-weight: 900;
      color: var(--primary);
      background: var(--input-bg);
      border: 2px dashed var(--border);
      border-radius: 24px;
      padding: 24px;
      margin-bottom: 8px;
      outline: none;
      transition: 0.4s;
      font-family: 'Outfit', sans-serif;
    }
    .otp-supreme-input:focus { border-style: solid; border-color: var(--primary); background: var(--bg-elevated); box-shadow: 0 0 0 5px var(--accent); }

    .resend-supreme { text-align: center; font-size: 15px; color: var(--text-sec); font-weight: 600; }
    .btn-resend-supreme { background: none; border: none; color: var(--primary); font-weight: 800; cursor: pointer; padding: 0 4px; transition: 0.3s; }
    .btn-resend-supreme:hover { opacity: 0.8; }
    .btn-resend-supreme:disabled { opacity: 0.5; }

    .supreme-error, .supreme-success { padding: 18px; border-radius: 18px; font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 12px; justify-content: center; }
    .supreme-error { background: rgba(255, 95, 71, 0.1); border: 1px solid rgba(255, 95, 71, 0.2); color: var(--alert); }
    .supreme-success { background: rgba(5, 210, 70, 0.1); border: 1px solid rgba(5, 210, 70, 0.2); color: var(--success); }

    .supreme-footer { margin-top: 40px; text-align: center; }
    .back-link { color: var(--text-sec); text-decoration: none; font-weight: 700; font-size: 16px; transition: 0.3s; }
    .back-link:hover { color: var(--primary); }

    .spinner-white {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class OtpVerifyComponent implements OnInit {
  email: string = '';
  otpCode: string = '';
  loading = false;
  resendLoading = false;
  error = '';
  success = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // نحاول نجيب الإيميل من الـ query params
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.authService.verifyOtp({ email: this.email, otp: this.otpCode }).subscribe({
      next: (res: any) => {
        this.success = true;
        
        // Save token
        if (res.accessToken) {
          localStorage.setItem('accessToken', res.accessToken);
        }

        setTimeout(() => {
          if (res.role === 'teacher' || res.role === 'instructor') {
            this.router.navigate(['/instructor/dashboard']);
          } else {
            this.router.navigate(['/student/dashboard']);
          }
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Invalid OTP code';
        this.loading = false;
      }
    });
  }

  resendOtp() {
    // هتحتاج تضيف دالة resendOtp في الـ AuthService لو عايز تفعل الزرار ده
    console.log('Resending OTP to', this.email);
  }
}
