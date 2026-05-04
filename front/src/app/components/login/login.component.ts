import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="supreme-auth-wrapper mesh-bg">
      <div class="auth-split">
        <!-- Left Side: Brand & Features -->
        <div class="auth-side-brand hide-mobile">
          <div class="brand-content fade-in">
            <div class="logo-white">Edu<span>Learn</span></div>
            <h2 class="supreme-title">Master Your Skills with <span>EduLearn</span></h2>
            <p class="supreme-subtitle">Join over 10,000 instructors delivering world-class education.</p>
            
            <div class="feature-cards">
              <div class="feature-card floating-1">
                <div class="f-icon">📈</div>
                <div class="f-info">
                  <h4>Advanced Analytics</h4>
                  <p>Track student progress in real-time</p>
                </div>
              </div>
              <div class="feature-card floating-2">
                <div class="f-icon">🎥</div>
                <div class="f-info">
                  <h4>High Quality Video</h4>
                  <p>Cloudinary integrated hosting</p>
                </div>
              </div>
            </div>
          </div>
          <div class="decorative-circles">
            <div class="circle c1"></div>
            <div class="circle c2"></div>
          </div>
        </div>

        <!-- Right Side: Login Form -->
        <div class="auth-side-form">
          <div class="form-container-supreme slide-up">
            <div class="form-header-supreme">
              <div class="show-mobile logo-mobile">Edu<span>Learn</span></div>
              <h1>Welcome Back</h1>
              <p>Please enter your details to sign in.</p>
            </div>

            <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="supreme-form">
              <div class="supreme-input-group">
                <label>Email Address</label>
                <div class="input-focus-wrapper">
                  <span class="icon">📧</span>
                  <input type="email" name="email" [(ngModel)]="credentials.email" 
                         placeholder="e.g. john@company.com" required>
                </div>
              </div>

              <div class="supreme-input-group">
                <label>Password</label>
                <div class="input-focus-wrapper">
                  <span class="icon">🔒</span>
                  <input type="password" name="password" [(ngModel)]="credentials.password" 
                         placeholder="••••••••" required>
                </div>
              </div>

              <div class="supreme-actions">
                <label class="custom-checkbox">
                  <input type="checkbox" name="remember">
                  <span class="box"></span>
                  Remember for 30 days
                </label>
                <a routerLink="/auth/forgot-password" class="supreme-link">Forgot Password?</a>
              </div>

              <button type="submit" class="btn-supreme" [disabled]="loading">
                <span *ngIf="!loading">Sign In Now</span>
                <div *ngIf="loading" class="spinner-white"></div>
              </button>

              <div *ngIf="error" class="supreme-error fade-in">
                <span>⚠️</span> {{ error }}
              </div>
            </form>

            <div class="supreme-footer">
              Don't have an account? <a routerLink="/auth/register">Create one for free</a>
            </div>
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
      overflow: hidden;
    }

    .auth-split {
      display: flex;
      width: 100%;
    }

    /* Left Side Branding */
    .auth-side-brand {
      flex: 1.2;
      background: linear-gradient(135deg, var(--bg-sidebar), var(--primary-hover));
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px;
      color: white;
      overflow: hidden;
    }

    .brand-content { position: relative; z-index: 10; max-width: 500px; }

    .logo-white {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: -2px;
      margin-bottom: 40px;
      font-family: 'Outfit', sans-serif;
    }
    .logo-white span { color: var(--primary); }

    .supreme-title { font-size: 48px; font-weight: 800; line-height: 1.1; margin-bottom: 20px; font-family: 'Outfit', sans-serif; }
    .supreme-title span { color: var(--primary); }

    .supreme-subtitle { font-size: 18px; opacity: 0.9; margin-bottom: 60px; line-height: 1.6; }

    .feature-cards { display: flex; flex-direction: column; gap: 20px; }
    .feature-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 24px;
      border-radius: 24px;
      display: flex;
      gap: 16px;
      align-items: center;
      transition: 0.3s;
    }
    .feature-card:hover { transform: scale(1.02); background: rgba(255,255,255,0.1); }

    .f-icon { font-size: 24px; background: var(--primary); width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
    .f-info h4 { margin: 0; font-size: 17px; font-weight: 700; font-family: 'Outfit', sans-serif; }
    .f-info p { margin: 4px 0 0; font-size: 14px; opacity: 0.8; }

    /* Right Side Form */
    .auth-side-form {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: var(--bg);
    }

    .form-container-supreme { width: 100%; max-width: 420px; }

    .form-header-supreme { margin-bottom: 40px; }
    .form-header-supreme h1 { font-size: 36px; font-weight: 900; color: var(--text); margin-bottom: 12px; letter-spacing: -1.5px; font-family: 'Outfit', sans-serif; }
    .form-header-supreme p { color: var(--text-sec); font-size: 17px; }

    .logo-mobile { font-size: 32px; font-weight: 900; margin-bottom: 24px; font-family: 'Outfit', sans-serif; }
    .logo-mobile span { color: var(--primary); }

    .supreme-form { display: flex; flex-direction: column; gap: 28px; }

    .supreme-input-group label { display: block; font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }

    .input-focus-wrapper { position: relative; }
    .input-focus-wrapper .icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); font-size: 20px; opacity: 0.5; }
    
    .input-focus-wrapper input {
      width: 100%;
      padding: 16px 20px 16px 54px;
      border: 2px solid var(--border);
      border-radius: 18px;
      background: var(--input-bg);
      color: var(--text);
      font-size: 16px;
      font-weight: 500;
      transition: all 0.3s ease;
      outline: none;
    }

    .input-focus-wrapper input:focus {
      border-color: var(--primary);
      background: var(--bg-elevated);
      box-shadow: 0 0 0 5px var(--accent);
    }

    .supreme-actions { display: flex; justify-content: space-between; align-items: center; font-size: 14px; font-weight: 600; }
    .supreme-link { color: var(--primary); font-weight: 800; text-decoration: none; transition: 0.3s; }
    .supreme-link:hover { opacity: 0.8; }

    .custom-checkbox { display: flex; align-items: center; gap: 12px; cursor: pointer; color: var(--text-sec); }
    .custom-checkbox input { display: none; }
    .custom-checkbox .box { width: 22px; height: 22px; border: 2px solid var(--border); border-radius: 7px; transition: 0.3s; position: relative; }
    .custom-checkbox input:checked + .box { background: var(--primary); border-color: var(--primary); }
    .custom-checkbox input:checked + .box::after { content: '✓'; color: white; font-size: 14px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }

    .btn-supreme {
      background: linear-gradient(135deg, var(--primary), var(--primary-hover));
      color: white; border: none; padding: 18px; border-radius: 18px;
      font-size: 17px; font-weight: 800; cursor: pointer; transition: 0.4s;
      box-shadow: 0 12px 24px -6px rgba(59, 130, 246, 0.4);
      font-family: 'Outfit', sans-serif;
    }
    .btn-supreme:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 20px 35px -10px rgba(59, 130, 246, 0.5); }
    .btn-supreme:disabled { opacity: 0.6; cursor: not-allowed; }

    .supreme-error {
      padding: 16px;
      background: rgba(255, 95, 71, 0.1);
      border: 1px solid rgba(255, 95, 71, 0.2);
      border-radius: 18px;
      color: var(--alert);
      font-size: 14px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .supreme-footer { margin-top: 40px; text-align: center; font-size: 16px; color: var(--text-sec); font-weight: 500; }
    .supreme-footer a { color: var(--primary); font-weight: 800; text-decoration: none; }

    .spinner-white {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 992px) {
      .auth-side-brand { display: none; }
      .auth-side-form { flex: 1; padding: 24px; }
    }
  `]
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    
    this.authService.login(this.credentials).subscribe({
      next: (res: any) => {
        const role = res.role;
        if (role === 'teacher' || role === 'instructor') {
          this.router.navigate(['/instructor/dashboard']);
        } else {
          this.router.navigate(['/student/dashboard']);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Invalid email or password';
        this.loading = false;
      }
    });
  }
}
