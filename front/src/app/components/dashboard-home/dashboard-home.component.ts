import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorService } from '../../services/instructor.service';
import { TranslationService } from '../../services/translation.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="content-body">
      <div class="welcome-section">
        <div class="welcome-text">
          <h1>{{trans.get('dashboard')}}</h1>
          <p>{{trans.get('welcome')}}. {{trans.get('today_msg')}}</p>
        </div>
        <div class="welcome-actions">
          <button class="btn btn-outline" routerLink="/instructor/earnings">{{trans.get('view_reports')}}</button>
          <button class="btn btn-primary" routerLink="/instructor/create-course">+ {{trans.get('new_content')}}</button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">{{trans.get('monthly_revenue')}}</span>
            <h2 class="stat-value">\${{stats.monthlyRevenue | number}}</h2>
            <span class="stat-change" [ngClass]="stats.revChange >= 0 ? 'positive' : 'negative'">
              {{stats.revChange >= 0 ? '+' : ''}}{{stats.revChange}}%
            </span>
          </div>
          <div class="stat-icon revenue">
            <span class="material-symbols-rounded">payments</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">{{trans.get('active_students')}}</span>
            <h2 class="stat-value">{{stats.activeStudents | number}}</h2>
          </div>
          <div class="stat-icon students">
            <span class="material-symbols-rounded">group</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">{{trans.get('avg_rating')}}</span>
            <h2 class="stat-value">{{stats.avgRating}}</h2>
          </div>
          <div class="stat-icon rating">
            <span class="material-symbols-rounded">star</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">{{trans.get('pending_approvals')}}</span>
            <h2 class="stat-value">{{stats.pendingApprovals}}</h2>
          </div>
          <div class="stat-icon pending">
            <span class="material-symbols-rounded">hourglass_empty</span>
          </div>
        </div>
      </div>

      <!-- Bottom Grid -->
      <div class="bottom-grid">
        <div class="left-col">
          <!-- Course Manager Table -->
          <section class="card course-manager">
            <div class="card-header">
              <h3>{{trans.get('course_manager')}}</h3>
              <a routerLink="/instructor/courses" class="view-all">{{trans.get('view_all')}}</a>
            </div>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>{{trans.get('course_title')}}</th>
                    <th>{{trans.get('students')}}</th>
                    <th>{{trans.get('earnings')}}</th>
                    <th>{{trans.get('status')}}</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let course of filteredCourses">
                    <td>
                       <div style="display: flex; align-items: center; gap: 10px;">
                         <img [src]="course.thumbnail || 'assets/default-course.png'" style="width: 40px; height: 30px; border-radius: 6px; object-fit: cover;">
                         {{course.title[trans.getCurrentLang()] || course.title.en || course.title}}
                       </div>
                    </td>
                    <td>{{course.students | number}}</td>
                    <td>\${{course.earnings || 0 | number}}</td>
                    <td>
                      <span class="status-badge" [ngClass]="course.status.toLowerCase()">
                        {{course.status}}
                      </span>
                    </td>
                    <td>
                      <div style="display: flex; gap: 8px;">
                        <button [routerLink]="['/instructor/view-course', course._id]" class="btn-icon" title="Preview">
                          <span class="material-symbols-rounded">visibility</span>
                        </button>
                        <button [routerLink]="['/instructor/edit-course', course._id]" class="btn-icon" title="Edit">
                          <span class="material-symbols-rounded">edit</span>
                        </button>
                        <button (click)="deleteCourse(course._id)" class="btn-icon delete" title="Delete">
                          <span class="material-symbols-rounded">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr *ngIf="filteredCourses.length === 0">
                    <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted)">
                      <div style="font-size: 2.5rem; margin-bottom: 10px;">
                        <span class="material-symbols-rounded" style="font-size: 48px;">folder_off</span>
                      </div>
                      No courses found. Start by creating one!
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Student Performance (Grades) -->
          <section class="card">
            <div class="card-header">
              <h3>Student Performance</h3>
              <span class="view-all">Recent Exams</span>
            </div>
            <div class="table-container">
               <table>
                 <thead>
                   <tr>
                     <th>Student</th>
                     <th>Course</th>
                     <th>Last Exam Score</th>
                     <th>Progress</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr *ngFor="let s of students">
                     <td>{{s.studentId.firstName}} {{s.studentId.lastName}}</td>
                     <td>{{s.courseId.title[trans.getCurrentLang()] || s.courseId.title.en}}</td>
                     <td>
                        <span *ngIf="s.progress?.examResults?.length > 0" 
                              [style.color]="s.progress.examResults[0].status === 'passed' ? '#00ff9d' : '#ff0055'">
                          {{s.progress.examResults[0].score}}% ({{s.progress.examResults[0].status}})
                        </span>
                        <span *ngIf="!s.progress?.examResults?.length" style="color: var(--text-muted)">No exams yet</span>
                     </td>
                     <td>
                        <div class="student-progress-row">
                          <span style="font-size: 0.75rem">{{s.progress?.completionPercentage || 0}}%</span>
                          <div class="progress-bar-container">
                            <div class="progress-fill" [style.width.%]="s.progress?.completionPercentage || 0"></div>
                          </div>
                        </div>
                     </td>
                   </tr>
                   <tr *ngIf="students.length === 0">
                      <td colspan="4" style="text-align: center; padding: 20px; color: var(--text-muted)">No students enrolled yet.</td>
                   </tr>
                 </tbody>
               </table>
            </div>
          </section>
        </div>

        <!-- Right Column (Reviews & Widgets) -->
        <div class="side-widgets">
          <!-- Recent Reviews -->
          <section class="card widget">
            <div class="card-header">
              <h3>Recent Reviews</h3>
            </div>
            <div class="reviews-list">
              <div class="review-item" *ngFor="let r of reviews">
                <img [src]="'https://ui-avatars.com/api/?name=' + r.studentId.firstName + '&background=random'" class="review-avatar">
                <div class="review-content">
                  <h4>{{r.studentId.firstName}} {{r.studentId.lastName}}</h4>
                  <div class="review-stars">
                    <span class="material-symbols-rounded" *ngFor="let star of [1,2,3,4,5]" 
                          [style.color]="star <= r.rating ? 'var(--warning)' : 'var(--border)'"
                          style="font-size: 16px;">star</span>
                  </div>
                  <p class="review-comment">{{r.comment}}</p>
                  <small style="color: var(--accent-cyan); font-size: 0.7rem">{{r.courseId.title.en}}</small>
                </div>
              </div>
              <div *ngIf="reviews.length === 0" style="text-align: center; padding: 20px; color: var(--text-muted)">
                No reviews yet.
              </div>
            </div>
          </section>

          <!-- Earnings Growth -->
          <section class="card widget">
            <h3>{{trans.get('earnings_growth')}}</h3>
            <p class="widget-subtitle">Revenue over the last 6 months</p>
            <div class="chart-container" style="height: 150px; margin-top: 20px;">
              <div class="chart-bars" style="display: flex; align-items: flex-end; gap: 8px; height: 100%;">
                <div class="bar-item" *ngFor="let h of stats.earningsHistory" style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                  <div class="bar" [style.height.%]="(h.total / (maxEarnings || 1)) * 100" 
                       style="width: 100%; background: linear-gradient(to top, var(--secondary-glow), var(--accent-cyan)); border-radius: 4px 4px 0 0;">
                  </div>
                  <span class="bar-label" style="font-size: 0.65rem; margin-top: 5px; color: var(--text-muted)">{{h.month}}</span>
                </div>
              </div>
            </div>
            <div class="total-ytd" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border-glass)">
              <span style="color: var(--text-muted)">{{trans.get('total_ytd')}}:</span>
              <strong style="float: right; color: var(--accent-cyan)">\${{stats.totalYTDEarnings | number}}</strong>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../instructor-dashboard/instructor-dashboard.component.css'],
  styles: [`
    .btn-icon {
      background: var(--bg);
      border: 1px solid var(--border);
      width: 36px;
      height: 36px;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.3s;
      color: var(--text-sec);
    }
    .btn-icon span { font-size: 20px; }
    .btn-icon:hover { background: var(--accent); color: var(--primary); border-color: var(--primary); }
    .btn-icon.delete:hover { background: #fff5f5; color: var(--alert); border-color: var(--alert); }
    
    .stat-icon.revenue { color: var(--success); background: rgba(5, 210, 70, 0.1); }
    .stat-icon.students { color: var(--primary); background: rgba(59, 130, 246, 0.1); }
    .stat-icon.rating { color: var(--warning); background: rgba(238, 154, 11, 0.1); }
    .stat-icon.pending { color: var(--alert); background: rgba(255, 95, 71, 0.1); }

    .left-col { display: flex; flex-direction: column; gap: 1rem; }
  `]
})
export class DashboardHomeComponent implements OnInit {
  courses: any[] = [];
  reviews: any[] = [];
  students: any[] = [];
  searchTerm: string = '';
  stats = {
    monthlyRevenue: 0,
    revChange: 0,
    activeStudents: 0,
    avgRating: 0,
    pendingApprovals: 0,
    totalYTDEarnings: 0,
    earningsHistory: [] as any[]
  };

  maxEarnings: number = 1;

  constructor(
    private instructorService: InstructorService,
    public trans: TranslationService
  ) {}

  get filteredCourses() {
    if (!this.searchTerm) return this.courses;
    return this.courses.filter(c => {
      const title = c.title[this.trans.getCurrentLang()] || c.title.en || c.title;
      return title.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  ngOnInit(): void {
    this.loadCourses();
    this.loadStats();
    this.loadReviews();
    this.loadStudents();
  }

  loadCourses(): void {
    this.instructorService.getMyCourses().subscribe({
      next: (res) => { if (res.success) this.courses = res.courses; },
      error: (err) => console.error(err)
    });
  }

  loadStats(): void {
    this.instructorService.getDashboardStats().subscribe({
      next: (res) => { 
        if (res.success) {
          this.stats = res.stats;
          if (this.stats.earningsHistory.length > 0) {
            this.maxEarnings = Math.max(...this.stats.earningsHistory.map((h: any) => h.total), 1);
          }
        }
      },
      error: (err) => console.error(err)
    });
  }

  loadReviews(): void {
    this.instructorService.getTeacherReviews().subscribe({
      next: (res) => { if (res.success) this.reviews = res.reviews.slice(0, 5); },
      error: (err) => console.error(err)
    });
  }

  loadStudents(): void {
    this.instructorService.getStudentList().subscribe({
      next: (res) => { if (res.success) this.students = res.students.slice(0, 5); },
      error: (err) => console.error(err)
    });
  }

  deleteCourse(id: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.instructorService.deleteCourse(id).subscribe({
        next: () => {
          this.courses = this.courses.filter(c => c._id !== id);
        },
        error: (err: any) => console.error('Error deleting course:', err)
      });
    }
  }
}
