import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ExamsComponent implements OnInit {

  exams: any[] = [];
  loading = false;
  processingId: string | null = null;
  toast = { show: false, message: '', type: 'success' };
  private toastTimer: any;

  constructor(private admin: AdminService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.admin.getAllExams().subscribe({
      next: (res: any) => {
        this.exams = res?.data ?? res ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Exams error:', err);
        this.showToast('Failed to load exams', 'error');
        this.loading = false;
      }
    });
  }

  approve(exam: any): void {
    this.processingId = exam._id;
    this.admin.approveExam(exam._id).subscribe({
      next: () => {
        // نحدّث الـ status في الـ UI من غير ما نعمل reload كامل
        exam.status = 'approved';
        exam.isPublished = true;
        this.processingId = null;
        this.showToast(`✅ "${exam.title?.en}" approved & published!`, 'success');
      },
      error: () => {
        this.showToast('Failed to approve exam', 'error');
        this.processingId = null;
      }
    });
  }

  reject(exam: any): void {
    if (!confirm(`Reject "${exam.title?.en || 'this exam'}"?`)) return;
    this.processingId = exam._id;
    this.admin.rejectExam(exam._id).subscribe({
      next: () => {
        // نحدّث الـ status في الـ UI من غير ما نعمل reload كامل
        exam.status = 'rejected';
        exam.isPublished = false;
        this.processingId = null;
        this.showToast(`❌ "${exam.title?.en}" rejected`, 'error');
      },
      error: () => {
        this.showToast('Failed to reject exam', 'error');
        this.processingId = null;
      }
    });
  }

  statusIcon(status: string): string {
    const icons: Record<string, string> = { pending: '⏳', approved: '✅', rejected: '❌' };
    return icons[status] ?? '❓';
  }

  optionLabel(index: number): string {
    return ['A)', 'B)', 'C)', 'D)'][index] ?? `${index + 1})`;
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    clearTimeout(this.toastTimer);
    this.toast = { show: true, message, type };
    this.toastTimer = setTimeout(() => this.toast = { ...this.toast, show: false }, 3500);
  }
}