import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { Course } from '../../core/models';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  loading = false;
  total = 0; page = 1; pages = 1;
  statusFilter = '';
  categoryFilter = '';

  // Modal
  modalOpen = false;
  modalLoading = false;
  selectedCourse: any = null;

  constructor(private admin: AdminService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.admin.getAllCourses({
      page: this.page, limit: 10,
      status: this.statusFilter || undefined,
      category: this.categoryFilter || undefined
    }).subscribe({
      next: (res: any) => {
        const data = res.data || res;
        this.courses = data.courses || [];
        this.total = data.total || 0;
        this.pages = data.pages || 1;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  // فتح المودال وجيب التفاصيل الكاملة
  openModal(c: Course): void {
    this.selectedCourse = c; // اعرض البيانات الموجودة فوراً
    this.modalOpen = true;
    this.modalLoading = true;

    this.admin.getCourseById((c as any)._id).subscribe({
      next: (res: any) => {
        this.selectedCourse = res?.data ?? res;
        this.modalLoading = false;
      },
      error: () => {
        // لو فشل، اعرض البيانات الموجودة من الجدول
        this.selectedCourse = c;
        this.modalLoading = false;
      }
    });
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedCourse = null;
  }

  onStatusChange(c: Course, newStatus: string): void {
    if (!confirm(`Change status to ${newStatus}?`)) {
      this.load();
      return;
    }
    this.loading = true;
    let request;
    if (newStatus === 'approved') {
      request = this.admin.approveCourse((c as any)._id);
    } else if (newStatus === 'rejected') {
      request = this.admin.rejectCourse((c as any)._id);
    } else {
      request = this.admin.updateCourse((c as any)._id, { status: 'pending' } as any);
    }
    request.subscribe({
      next: () => {
        c.status = newStatus as any;
        this.loading = false;
      },
      error: () => { this.loading = false; this.load(); }
    });
  }

  delete(c: Course): void {
    const name = (c.title as any)?.ar || (c.title as any)?.en || 'this course';
    if (!confirm(`Delete "${name}"?`)) return;
    this.loading = true;
    this.admin.deleteCourse((c as any)._id).subscribe({
      next: () => {
        this.courses = this.courses.filter(item => (item as any)._id !== (c as any)._id);
        this.total--;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  changePage(p: number): void { this.page = p; this.load(); }
}
