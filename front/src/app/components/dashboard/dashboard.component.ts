import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { DataService } from '../../services/data.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  enrollments: any[] = [];
  stats: any = {
    totalCourses: 0,
    completedCourses: 0,
    averageScore: 0,
    overallProgress: 0
  };
  userName: string = 'Student';
  userProfile: any = null;
  currentView: string = 'dashboard';
  loading: boolean = true;

  constructor(
    private dataService: DataService, 
    private apiService: ApiService,
    private router: Router
  ) {
    // استماع لتغييرات المسار لتحديث العرض تلقائياً
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.detectCurrentView();
      }
    });
  }

  ngOnInit() {
    this.detectCurrentView();
    this.loadUserProfile();
    this.loadDashboardData();
  }

  loadUserProfile() {
    this.apiService.getMe().subscribe({
      next: (user) => {
        if (user) {
          this.userProfile = user;
          const firstName = user.firstName || '';
          const lastName = user.lastName || '';
          this.userName = (firstName + ' ' + lastName).trim() || 'Student';
        }
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
        // Fallback to token if API fails
        this.getUserNameFromToken();
      }
    });
  }

  detectCurrentView() {
    const url = this.router.url;
    if (url.includes('certificates')) this.currentView = 'certificates';
    else if (url.includes('my-courses')) this.currentView = 'my-courses';
    else if (url.includes('profile')) this.currentView = 'profile';
    else this.currentView = 'dashboard';
  }

  getUserNameFromToken() {
    const token = localStorage.getItem('accessToken'); 
    if (token && token.includes('.')) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userInfo = payload.userInfo || payload;
        const firstName = userInfo.firstName || userInfo.name || '';
        const lastName = userInfo.lastName || '';
        this.userName = (firstName + ' ' + lastName).trim() || 'Student';
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }

  loadDashboardData() {
    this.loading = true;
    this.dataService.getDashboardStats().subscribe({
      next: (response: any) => {
        // دعم التنسيقات المختلفة للـ API
        const statsData = response.data || response.stats || response;
        if (statsData.summary) {
          this.stats = statsData.summary;
          this.enrollments = statsData.activeCourses || [];
        } else {
          // Fallback لو الداتا جاية مباشرة
          this.stats = statsData;
          this.enrollments = statsData.enrollments || [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.loading = false;
      }
    });
  }

  onLogout() {
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

  hasCertificates(): boolean {
    return this.enrollments && this.enrollments.some(item => item.isCompleted && item.certificate);
  }

  downloadCertificate(item: any) {
    if (!item.certificate) {
      alert('Certificate data not found. Please try again later.');
      return;
    }
    
    const certWindow = window.open('', '_blank');
    if (certWindow) {
      const title = item.title?.en || item.title?.ar || item.title;
      const date = new Date(item.certificate.issueDate || item.certificate.issuedAt).toLocaleDateString();
      const serial = item.certificate.certificateSerial || item.certificate.serialNumber;

      certWindow.document.write(`
        <html>
          <head>
            <title>Certificate - ${title}</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f3f4f6; }
              .certificate { background: white; width: 800px; padding: 60px; border: 20px solid #4f46e5; border-radius: 10px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); text-align: center; position: relative; }
              .certificate:after { content: ''; position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px; border: 2px solid #e5e7eb; pointer-events: none; }
              h1 { color: #1f2937; font-size: 50px; margin: 0 0 20px; text-transform: uppercase; letter-spacing: 2px; }
              p { color: #4b5563; font-size: 20px; margin: 10px 0; }
              .course-title { color: #4f46e5; font-size: 32px; font-weight: bold; margin: 30px 0; border-bottom: 2px solid #e5e7eb; display: inline-block; padding-bottom: 10px; }
              .footer { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; }
              .serial { font-size: 12px; color: #9ca3af; text-align: left; }
              .signature { border-top: 1px solid #374151; padding-top: 5px; width: 200px; font-style: italic; }
              .btn-print { margin-top: 40px; padding: 12px 30px; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px; }
              @media print { .btn-print { display: none; } body { background: white; } .certificate { box-shadow: none; border-width: 10px; } }
            </style>
          </head>
          <body>
            <div class="certificate">
              <div style="font-size: 14px; color: #4f46e5; font-weight: bold; text-transform: uppercase;">EduLearn Excellence Award</div>
              <h1>Certificate</h1>
              <p>of Course Completion</p>
              <p style="margin-top: 30px;">This is to certify that</p>
              <h2 style="font-size: 36px; color: #1f2937; margin: 15px 0;">${this.userName}</h2>
              <p>has successfully completed the course</p>
              <div class="course-title">${title}</div>
              <p>Achieved on ${date}</p>
              
              <div class="footer">
                <div class="serial">Certificate ID: ${serial}<br>Verify at edulearn.com/verify</div>
                <div class="signature">EduLearn Administration</div>
              </div>
              
              <button class="btn-print" onclick="window.print()">Download / Print PDF</button>
            </div>
          </body>
        </html>
      `);
      certWindow.document.close();
    }
  }
}