import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorService } from '../../services/instructor.service';
import { TranslationService } from '../../services/translation.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="content-body">
      <div class="card">
        <div class="card-header">
          <h3>{{trans.get('student_list')}}</h3>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{trans.get('students')}}</th>
                <th>Email</th>
                <th>{{trans.get('course_title')}}</th>
                <th>{{trans.get('progress')}}</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of students">
                <td>{{s.studentId?.firstName}} {{s.studentId?.lastName}}</td>
                <td>{{s.studentId?.email}}</td>
                <td>{{s.courseId?.title[trans.getCurrentLang()] || s.courseId?.title?.en || s.courseId?.title}}</td>
                <td>
                  <div class="progress-wrapper">
                    <div class="progress-track">
                      <div class="progress-bar" [style.width.%]="s.progress?.completionPercentage || 0"></div>
                    </div>
                    <span class="progress-text">{{s.progress?.completionPercentage || 0}}%</span>
                  </div>
                </td>
                <td>{{s.createdAt | date:'mediumDate'}}</td>
              </tr>
              <tr *ngIf="students.length === 0">
                <td colspan="5" style="text-align: center; padding: 40px;">No students enrolled yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .content-body { padding: 40px; background: var(--bg); color: var(--text); }
    .card { background: var(--bg-elevated); border-radius: 24px; padding: 32px; box-shadow: var(--shadow); border: 1px solid var(--border); }
    .table-container { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    table { width: 100%; border-collapse: collapse; min-width: 850px; }
    th { text-align: left; color: var(--text-sec); font-size: 13px; font-weight: 700; padding: 16px; border-bottom: 1px solid var(--border); text-transform: uppercase; }
    td { padding: 16px; border-bottom: 1px solid var(--border); font-size: 14px; color: var(--text); }
    [dir='rtl'] th { text-align: right; }

    .progress-wrapper { display: flex; align-items: center; gap: 12px; min-width: 160px; }
    .progress-track { flex: 1; height: 8px; background: var(--accent); border-radius: 10px; position: relative; overflow: hidden; }
    .progress-bar { position: absolute; top: 0; left: 0; height: 100%; background: linear-gradient(90deg, var(--primary), var(--primary-hover)); border-radius: 10px; transition: width 0.5s ease-in-out; }
    [dir='rtl'] .progress-bar { left: auto; right: 0; }
    .progress-text { font-size: 13px; font-weight: 700; color: var(--primary); min-width: 40px; }
    
    @media (max-width: 768px) {
      .content-body { padding: 20px; }
      .card { padding: 20px; }
    }
  `]
})
export class StudentListComponent implements OnInit {
  students: any[] = [];
  constructor(
    private instructorService: InstructorService,
    public trans: TranslationService
  ) {}
  ngOnInit(): void {
    this.instructorService.getStudentList().subscribe({
      next: (res) => { if (res.success) this.students = res.students; },
      error: (err) => console.error(err)
    });
  }
}
