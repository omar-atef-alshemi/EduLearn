import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from './services/translation.service';
import { Router, RouterModule } from '@angular/router';
import { InstructorService } from './services/instructor.service';
import { ThemeService } from './services/theme.service';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="layout-container" [class.sidebar-open]="isSidebarOpen">
      <!-- Sidebar Overlay -->
      <div class="sidebar-overlay" (click)="isSidebarOpen = false"></div>

      <!-- Sidebar -->
      <aside class="sidebar" [class.active]="isSidebarOpen">
        <div class="logo">
          <div class="logo-icon">E</div>
          <span>EduLearn</span>
          <button class="close-sidebar show-mobile" (click)="isSidebarOpen = false">✕</button>
        </div>
        
        <nav class="nav-menu">
          <a routerLink="/instructor/dashboard" routerLinkActive="active" (click)="isSidebarOpen = false" class="nav-item">
            <span class="material-symbols-rounded icon">dashboard</span>
            <span class="label">{{ trans.get('dashboard') }}</span>
          </a>
          <a routerLink="/instructor/courses" routerLinkActive="active" (click)="isSidebarOpen = false" class="nav-item">
            <span class="material-symbols-rounded icon">menu_book</span>
            <span class="label">{{ trans.get('courses') }}</span>
          </a>
          <a routerLink="/instructor/exams" routerLinkActive="active" (click)="isSidebarOpen = false" class="nav-item">
            <span class="material-symbols-rounded icon">description</span>
            <span class="label">{{ trans.get('exams') }}</span>
          </a>
          <a routerLink="/instructor/students" routerLinkActive="active" (click)="isSidebarOpen = false" class="nav-item">
            <span class="material-symbols-rounded icon">group</span>
            <span class="label">{{ trans.get('student_list') }}</span>
          </a>
          <a routerLink="/instructor/earnings" routerLinkActive="active" (click)="isSidebarOpen = false" class="nav-item">
            <span class="material-symbols-rounded icon">payments</span>
            <span class="label">{{ trans.get('earnings') }}</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <button class="logout-btn" (click)="logout()">
            <span class="material-symbols-rounded icon">logout</span>
            <span class="label">Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="content-area">
        <header class="top-header">
          <div class="header-left">
            <button class="menu-toggle show-mobile" (click)="isSidebarOpen = true">☰</button>
            <div class="search-bar hide-mobile">
              <input type="text" [placeholder]="trans.get('search_placeholder')">
            </div>
          </div>
          
          <div class="header-right">
            <button class="theme-toggle" (click)="themeService.toggleTheme()">
              <span class="material-symbols-rounded">{{ themeService.getTheme() === 'light' ? 'dark_mode' : 'light_mode' }}</span>
            </button>
            <div class="lang-toggle hide-mobile" (click)="toggleLanguage()">{{ trans.getCurrentLang() === 'ar' ? 'English' : 'العربية' }}</div>
            <div class="notification-bell hide-mobile">
              <span class="material-symbols-rounded">notifications</span>
            </div>
            <div class="user-profile">
              <span class="user-initials">ZM</span>
            </div>
          </div>
        </header>

        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout-container { display: flex; min-height: 100vh; background: var(--bg); color: var(--text); }
    
    .sidebar {
      width: 260px; background: var(--bg-sidebar); border-inline-end: 1px solid var(--border);
      display: flex; flex-direction: column; padding: 24px 0; position: fixed; height: 100vh;
      inset-inline-start: 0;
      z-index: 1000; transition: 0.3s ease;
    }
    
    .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999; backdrop-filter: blur(4px); }

    .logo { display: flex; align-items: center; gap: 12px; padding: 0 24px; margin-bottom: 40px; justify-content: space-between; }
    .logo-main { display: flex; align-items: center; gap: 12px; }
    .close-sidebar { background: none; border: none; font-size: 20px; color: var(--text-sec); cursor: pointer; }

    .content-area { flex: 1; margin-inline-start: 260px; display: flex; flex-direction: column; transition: 0.3s ease; }
    
    .top-header {
      height: 80px; background: var(--glass); backdrop-filter: blur(12px); 
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between; padding: 0 32px;
      position: sticky; top: 0; z-index: 100;
    }

    .header-left { display: flex; align-items: center; gap: 16px; }
    .menu-toggle { background: var(--bg-elevated); border: 1px solid var(--border); width: 44px; height: 44px; border-radius: 12px; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text); }

    @media (max-width: 1024px) {
      .sidebar { transform: translateX(-100%); }
      [dir='rtl'] .sidebar { transform: translateX(100%); }
      .sidebar.active { transform: translateX(0); }
      .content-area { margin-inline-start: 0; }
      .sidebar-overlay.active { display: block; }
      .layout-container.sidebar-open .sidebar-overlay { display: block; }
      .top-header { padding: 0 20px; }
    }

    .logo-icon { 
      background: linear-gradient(135deg, var(--primary), var(--indigo));
      width: 40px; height: 40px; border-radius: 12px; display: flex;
      align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 20px;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }
    .logo span { font-weight: 800; font-size: 22px; letter-spacing: -0.5px; color: white; }

    .nav-menu { flex: 1; padding: 0 16px; }
    .nav-item {
      display: flex; align-items: center; gap: 12px; padding: 14px 16px;
      text-decoration: none; color: rgba(255,255,255,0.7); border-radius: 12px;
      margin-bottom: 4px; transition: 0.3s; font-weight: 500;
    }
    .nav-item:hover { background: rgba(255,255,255,0.05); color: white; }
    .nav-item.active { 
      background: var(--primary); 
      color: white; 
      box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.4);
    }
    .nav-item .icon { font-size: 22px; }

    .sidebar-footer { padding: 16px; border-top: 1px solid var(--border); }
    .logout-btn {
      width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px;
      background: none; border: none; color: #ef4444; cursor: pointer; border-radius: 12px;
      transition: 0.3s; font-weight: 600;
    }

    .search-bar input {
      background: var(--bg); border: 1px solid var(--border); padding: 12px 20px;
      border-radius: 14px; width: 280px; color: var(--text); outline: none; transition: 0.3s;
      font-size: 14px;
    }
    .search-bar input:focus { border-color: var(--primary); width: 320px; background: var(--bg-elevated); box-shadow: var(--shadow); }

    .header-right { display: flex; align-items: center; gap: 16px; }
    .theme-toggle {
      background: var(--bg-elevated); border: 1px solid var(--border); width: 44px; height: 44px;
      border-radius: 12px; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center;
      transition: 0.3s; color: var(--text);
    }

    .lang-toggle { cursor: pointer; font-weight: 600; font-size: 14px; color: var(--text-sec); }
    .notification-bell { font-size: 20px; cursor: pointer; color: var(--text-sec); }
    .user-profile {
      width: 40px; height: 40px; border-radius: 10px; 
      background: linear-gradient(135deg, #0ea5e9, #2563eb);
      display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;
    }

    .page-content { padding: 24px; min-height: calc(100vh - 80px); }
    @media (max-width: 768px) {
      .page-content { padding: 16px; }
    }
  `]

})
export class MainLayoutComponent implements OnInit {
  isSidebarOpen = false;
  instructorName: string = 'Omar Atef';
  instructorAvatar: string = 'https://ui-avatars.com/api/?name=Omar+Atef&background=0D8ABC&color=fff';
  inquiries: any[] = [];
  searchTerm: string = '';

  constructor(
    private instructorService: InstructorService,
    private apiService: ApiService,
    public trans: TranslationService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('accessToken')) {
      console.log('🛠️ Dev Mode: Setting placeholder token');
      localStorage.setItem('accessToken', 'dev-placeholder-token');
    }
    this.loadProfile();
    this.loadInquiries();
    document.dir = this.trans.getCurrentLang() === 'ar' ? 'rtl' : 'ltr';
  }

  toggleLanguage() {
    const nextLang = this.trans.getCurrentLang() === 'en' ? 'ar' : 'en';
    this.trans.setLanguage(nextLang);
    document.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
  }

  logout() {
    this.apiService.logoutUser().subscribe({
      next: () => {
        localStorage.removeItem('accessToken');
        this.router.navigate(['/signin']);
      },
      error: () => {
        localStorage.removeItem('accessToken');
        this.router.navigate(['/signin']);
      }
    });
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value;
  }

  loadProfile(): void {
    this.instructorService.getProfile().subscribe({
      next: (res) => {
        this.instructorName = `${res.firstName || res.username}`;
        this.instructorAvatar = `https://ui-avatars.com/api/?name=${this.instructorName}&background=0D8ABC&color=fff`;
      },
      error: (err) => {
        console.error("Profile load failed:", err);
        if (err.status === 401 || err.status === 403 || err.status === 404) {
          // this.logout();
        }
      }
    });
  }

  loadInquiries(): void {
    this.instructorService.getStudentInquiries().subscribe({
      next: (res) => {
        if (res.success && res.inquiries) {
          this.inquiries = res.inquiries.map((i: any) => {
            const lang = this.trans.getCurrentLang();
            return {
              name: i.title[lang] || i.title.en || 'System',
              message: i.message[lang] || i.message.en || i.message,
              date: new Date(i.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              avatar: `https://ui-avatars.com/api/?name=${i.title.en || 'System'}`
            };
          });
        }
      },
      error: (err) => console.error(err)
    });
  }
}
