import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorService } from '../../services/instructor.service';
import { TranslationService } from '../../services/translation.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-earnings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="content-body">
      <div class="card">
        <div class="card-header">
          <h3>{{trans.get('earnings')}}</h3>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>{{trans.get('course_title')}}</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let e of earnings">
                <td>{{e.studentId?.firstName}} {{e.studentId?.lastName}}</td>
                <td>{{e.courseId?.title[trans.getCurrentLang()] || e.courseId?.title?.en || e.courseId?.title}}</td>
                <td style="color: var(--success); font-weight: 600;">+\${{e.amount | number}}</td>
                <td>{{e.paymentMethod}}</td>
                <td>{{e.createdAt | date:'mediumDate'}}</td>
              </tr>
              <tr *ngIf="earnings.length === 0">
                <td colspan="5" style="text-align: center; padding: 40px;">No earnings recorded yet.</td>
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
    table { width: 100%; border-collapse: collapse; min-width: 600px; }
    th { text-align: left; color: var(--text-sec); font-size: 13px; font-weight: 700; padding: 16px; border-bottom: 1px solid var(--border); text-transform: uppercase; }
    td { padding: 16px; border-bottom: 1px solid var(--border); font-size: 14px; color: var(--text); }
    [dir='rtl'] th { text-align: right; }
    
    @media (max-width: 768px) {
      .content-body { padding: 20px; }
      .card { padding: 20px; }
    }
  `]
})
export class EarningsComponent implements OnInit {
  earnings: any[] = [];
  constructor(
    private instructorService: InstructorService,
    public trans: TranslationService
  ) {}
  ngOnInit(): void {
    this.instructorService.getEarningsDetails().subscribe({
      next: (res) => { if (res.success) this.earnings = res.earnings; },
      error: (err) => console.error(err)
    });
  }
}
