import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorService } from '../../services/instructor.service';
import { TranslationService } from '../../services/translation.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="content-body">
      <div class="header-section">
        <div>
          <h1>{{trans.get('course_manager')}}</h1>
          <p>Manage and organize your learning content</p>
        </div>
        <button class="btn btn-primary" routerLink="/instructor/create-course">+ {{trans.get('new_content')}}</button>
      </div>

      <div class="card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{trans.get('course_title')}}</th>
                <th>Category</th>
                <th>{{trans.get('students')}}</th>
                <th>{{trans.get('earnings')}}</th>
                <th>{{trans.get('status')}}</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let course of courses">
                <td>
                  <div class="course-info">
                    <img [src]="course.thumbnail || 'https://via.placeholder.com/40'" class="thumb">
                    <span>{{course.title[trans.getCurrentLang()] || course.title.en || course.title}}</span>
                  </div>
                </td>
                <td>{{course.category}}</td>
                <td>{{course.students || 0}}</td>
                <td>\${{course.earnings || 0 | number}}</td>
                <td>
                  <span class="status-badge" [ngClass]="course.status.toLowerCase()">
                    {{course.status}}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <button class="btn-icon" [routerLink]="['/instructor/edit-course', course._id]" title="Edit">
                      <span class="material-symbols-rounded">edit</span>
                    </button>
                    <button class="btn-icon delete" (click)="deleteCourse(course._id)" title="Delete">
                      <span class="material-symbols-rounded">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="courses.length === 0">
                <td colspan="6" style="text-align: center; padding: 60px;">No courses found. Start by creating one!</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .content-body { padding: 40px; background: var(--bg); color: var(--text); }
    .header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; gap: 16px; }
    .header-section h1 { font-size: 32px; font-weight: 800; color: var(--text); margin: 0; }
    .header-section p { color: var(--text-sec); margin-top: 4px; }
    
    .card { background: var(--bg-elevated); border-radius: 20px; box-shadow: var(--shadow); border: 1px solid var(--border); overflow: hidden; }
    .table-container { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    table { width: 100%; border-collapse: collapse; min-width: 600px; }
    th { text-align: left; background: var(--accent); color: var(--text-sec); font-size: 13px; font-weight: 700; padding: 16px 24px; border-bottom: 1px solid var(--border); text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 16px 24px; border-bottom: 1px solid var(--border); font-size: 14px; color: var(--text); }
    
    .course-info { display: flex; align-items: center; gap: 12px; }
    .thumb { width: 44px; height: 44px; border-radius: 10px; object-fit: cover; border: 1px solid var(--border); }
    
    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .status-badge.approved { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    .status-badge.rejected { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    
    .actions { display: flex; gap: 8px; justify-content: flex-end; }
    .btn-icon { background: var(--bg); border: 1px solid var(--border); padding: 8px; border-radius: 10px; cursor: pointer; color: var(--text-sec); transition: 0.3s; }
    .btn-icon:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-2px); }
    .btn-icon.delete:hover { border-color: #ef4444; color: #ef4444; }
    
    .btn-primary { background: linear-gradient(135deg, var(--primary), var(--primary-hover)); color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4); }
    
    @media (max-width: 768px) {
      .content-body { padding: 20px; }
      .header-section { flex-direction: column; align-items: flex-start; }
      .btn-primary { width: 100%; text-align: center; }
    }
    
    [dir='rtl'] th { text-align: right; }
    [dir='rtl'] .actions { justify-content: flex-start; }
  `]
})
export class CourseListComponent implements OnInit {
  courses: any[] = [];
  constructor(
    private instructorService: InstructorService,
    public trans: TranslationService
  ) {}

  ngOnInit(): void {
    this.instructorService.getMyCourses().subscribe({
      next: (res) => { if (res.success) this.courses = res.courses; },
      error: (err) => console.error(err)
    });
  }

  deleteCourse(id: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.instructorService.deleteCourse(id).subscribe({
        next: () => this.courses = this.courses.filter(c => c._id !== id),
        error: (err) => console.error(err)
      });
    }
  }
}
