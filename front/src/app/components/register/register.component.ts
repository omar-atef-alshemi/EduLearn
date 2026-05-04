import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="supreme-auth-wrapper mesh-bg">
      <div class="auth-split">
        <!-- Left Side: Branding -->
        <div class="auth-side-brand hide-mobile">
          <div class="brand-content fade-in">
            <div class="logo-white">Edu<span>Learn</span></div>
            <h2 class="supreme-title">{{ selectedRole === 'teacher' ? 'Empower the World with Your Expertise' : 'Start Your Learning Journey Today' }}</h2>
            <p class="supreme-subtitle">{{ selectedRole === 'teacher' ? 'Join the elite circle of instructors and start earning while you teach.' : 'Access thousands of courses and master new skills with industry experts.' }}</p>
            
            <div class="feature-cards">
              <div class="feature-card floating-1">
                <div class="f-icon">{{ selectedRole === 'teacher' ? '💰' : '📚' }}</div>
                <div class="f-info">
                  <h4>{{ selectedRole === 'teacher' ? 'Global Earnings' : 'Unlimited Access' }}</h4>
                  <p>{{ selectedRole === 'teacher' ? 'Withdraw your revenue in multiple currencies' : 'Learn anything, anywhere, at your own pace' }}</p>
                </div>
              </div>
              <div class="feature-card floating-2">
                <div class="f-icon">{{ selectedRole === 'teacher' ? '🛡️' : '🏆' }}</div>
                <div class="f-info">
                  <h4>{{ selectedRole === 'teacher' ? 'Content Protection' : 'Verified Certificates' }}</h4>
                  <p>{{ selectedRole === 'teacher' ? 'Advanced security for your intellectual property' : 'Earn recognized credentials for your career' }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="decorative-circles">
            <div class="circle c1"></div>
            <div class="circle c2"></div>
          </div>
        </div>

        <!-- Right Side: Register Form -->
        <div class="auth-side-form scrollable-side">
          <div class="form-container-supreme slide-up">
            <div class="form-header-supreme">
              <div class="show-mobile logo-mobile">Edu<span>Learn</span></div>
              <h1>Create Account</h1>
              <p>Join our community as a {{ selectedRole === 'teacher' ? 'instructor' : 'student' }}.</p>
            </div>

            <!-- Role Selector -->
            <div class="role-selector-supreme">
              <button [class.active]="selectedRole === 'student'" (click)="selectedRole = 'student'">
                <span>👨‍🎓</span> Student
              </button>
              <button [class.active]="selectedRole === 'teacher'" (click)="selectedRole = 'teacher'">
                <span>👨‍🏫</span> Instructor
              </button>
            </div>

            <form (ngSubmit)="onSubmit()" #regForm="ngForm" class="supreme-form">
              <div class="supreme-grid">
                <div class="supreme-input-group">
                  <label>First Name</label>
                  <div class="input-focus-wrapper">
                    <span class="icon">👤</span>
                    <input type="text" name="firstName" [(ngModel)]="userData.firstName" 
                           placeholder="John" required>
                  </div>
                </div>
                <div class="supreme-input-group">
                  <label>Last Name</label>
                  <div class="input-focus-wrapper">
                    <span class="icon">👤</span>
                    <input type="text" name="lastName" [(ngModel)]="userData.lastName" 
                           placeholder="Doe" required>
                  </div>
                </div>
              </div>

              <div class="supreme-input-group">
                <label>Email Address</label>
                <div class="input-focus-wrapper">
                  <span class="icon">📧</span>
                  <input type="email" name="email" [(ngModel)]="userData.email" 
                         placeholder="john@example.com" required>
                </div>
              </div>

              <div class="supreme-grid">
                <div class="supreme-input-group">
                  <label>Password</label>
                  <div class="input-focus-wrapper">
                    <span class="icon">🔒</span>
                    <input type="password" name="password" [(ngModel)]="userData.password" 
                           placeholder="••••••••" required>
                  </div>
                </div>
                <div class="supreme-input-group">
                  <label>Phone Number</label>
                  <div class="input-focus-wrapper">
                    <span class="icon">📱</span>
                    <input type="text" name="phone" [(ngModel)]="userData.phone" 
                           placeholder="+20 123..." required>
                  </div>
                </div>
              </div>

              <div class="supreme-input-group" *ngIf="selectedRole === 'teacher'">
                <label>Specialization</label>
                <div class="input-focus-wrapper">
                  <span class="icon">🎓</span>
                  <select name="specialization" [(ngModel)]="userData.specialization" [required]="selectedRole === 'teacher'">
                    <option value="">Select your field</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Graphic Design">Graphic Design</option>
                  </select>
                </div>
              </div>

              <button type="submit" class="btn-supreme" [disabled]="loading">
                <span *ngIf="!loading">Create My Account</span>
                <div *ngIf="loading" class="spinner-white"></div>
              </button>

              <div *ngIf="error" class="supreme-error fade-in">
                <span>⚠️</span> {{ error }}
              </div>
              <div *ngIf="success" class="supreme-success fade-in">
                <span>✅</span> Registration successful! Redirecting...
              </div>
            </form>

            <div class="supreme-footer">
              Already have an account? <a routerLink="/auth/login">Sign In instead</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .supreme-auth-wrapper { min-height: 100vh; width: 100%; display: flex; overflow: hidden; }
    .auth-split { display: flex; width: 100%; }

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
    .logo-white { font-size: 36px; font-weight: 800; letter-spacing: -2px; margin-bottom: 40px; font-family: 'Outfit', sans-serif; }
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
      display: flex; gap: 16px; align-items: center;
      transition: 0.3s;
    }
    .feature-card:hover { transform: scale(1.02); background: rgba(255,255,255,0.1); }
    .f-icon { font-size: 24px; background: var(--primary); width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
    .f-info h4 { margin: 0; font-size: 17px; font-weight: 700; font-family: 'Outfit', sans-serif; }
    .f-info p { margin: 4px 0 0; font-size: 14px; opacity: 0.8; }

    /* Role Selector */
    .role-selector-supreme {
      display: flex;
      background: var(--input-bg);
      padding: 6px;
      border-radius: 20px;
      margin-bottom: 32px;
      border: 2px solid var(--border);
    }
    .role-selector-supreme button {
      flex: 1; padding: 14px; border: none; background: none; border-radius: 16px;
      font-size: 15px; font-weight: 800; color: var(--text-sec); cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.3s;
    }
    .role-selector-supreme button.active {
      background: var(--bg-elevated);
      color: var(--primary);
      box-shadow: 0 8px 16px rgba(0,0,0,0.06);
    }

    /* Right Side Form */
    .auth-side-form { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; background: var(--bg); }
    .scrollable-side { overflow-y: auto; align-items: flex-start; padding-top: 60px; padding-bottom: 60px; }
    .form-container-supreme { width: 100%; max-width: 500px; }

    .form-header-supreme { margin-bottom: 32px; }
    .form-header-supreme h1 { font-size: 36px; font-weight: 900; color: var(--text); margin-bottom: 12px; letter-spacing: -1.5px; font-family: 'Outfit', sans-serif; }
    .form-header-supreme p { color: var(--text-sec); font-size: 17px; }

    .logo-mobile { font-size: 32px; font-weight: 900; margin-bottom: 24px; font-family: 'Outfit', sans-serif; }
    .logo-mobile span { color: var(--primary); }

    .supreme-form { display: flex; flex-direction: column; gap: 24px; }
    .supreme-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

    .supreme-input-group label { display: block; font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .input-focus-wrapper { position: relative; }
    .input-focus-wrapper .icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); font-size: 20px; opacity: 0.5; }
    
    .input-focus-wrapper input, .input-focus-wrapper select {
      width: 100%; padding: 16px 20px 16px 54px; border: 2px solid var(--border); border-radius: 18px;
      background: var(--input-bg); color: var(--text); font-size: 16px; font-weight: 500; transition: 0.3s; outline: none;
      appearance: none;
    }
    .input-focus-wrapper input:focus, .input-focus-wrapper select:focus { border-color: var(--primary); background: var(--bg-elevated); box-shadow: 0 0 0 5px var(--accent); }

    .btn-supreme {
      background: linear-gradient(135deg, var(--primary), var(--primary-hover));
      color: white; border: none; padding: 18px; border-radius: 18px;
      font-size: 17px; font-weight: 800; cursor: pointer; transition: 0.4s;
      box-shadow: 0 12px 24px -6px rgba(59, 130, 246, 0.4);
      font-family: 'Outfit', sans-serif;
    }
    .btn-supreme:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 20px 35px -10px rgba(59, 130, 246, 0.5); }

    .supreme-error, .supreme-success { padding: 16px; border-radius: 18px; font-size: 14px; font-weight: 700; display: flex; align-items: center; gap: 12px; }
    .supreme-error { background: rgba(255, 95, 71, 0.1); border: 1px solid rgba(255, 95, 71, 0.2); color: var(--alert); }
    .supreme-success { background: rgba(5, 210, 70, 0.1); border: 1px solid rgba(5, 210, 70, 0.2); color: var(--success); }

    .supreme-footer { margin-top: 32px; text-align: center; font-size: 16px; color: var(--text-sec); font-weight: 500; }
    .supreme-footer a { color: var(--primary); font-weight: 800; text-decoration: none; }

    .spinner-white { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 992px) {
      .auth-side-brand { display: none; }
      .auth-side-form { flex: 1; padding: 24px; }
      .supreme-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class RegisterComponent {
  userData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    specialization: ''
  };
  selectedRole: 'student' | 'teacher' = 'student';
  loading = false;
  error = '';
  success = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    
    const request = this.selectedRole === 'teacher' 
      ? this.authService.registerTeacher(this.userData)
      : this.authService.registerStudent(this.userData);

    request.subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/auth/verify-otp'], { 
            queryParams: { email: this.userData.email } 
          });
        }, 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed. Try again.';
        this.loading = false;
      }
    });
  }
}
