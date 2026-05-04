import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { Enrollment } from '../../core/models';

@Component({
  selector: 'app-enrollments',
  templateUrl: './enrollments.component.html',
  styleUrls: ['./enrollments.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class EnrollmentsComponent implements OnInit {
  enrollments: Enrollment[] = [];
  loading = false;
  total = 0; page = 1; pages = 1;
  statusFilter = '';
  showForm = false;
  creating = false;
  formMsg = { text: '', type: '' };
  enrollForm: FormGroup;

  constructor(private admin: AdminService, private fb: FormBuilder) {
    this.enrollForm = this.fb.group({
      studentId: ['', Validators.required],
      courseId:  ['', Validators.required]
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.admin.getAllEnrollments({ page: this.page, limit: 10, status: this.statusFilter || undefined }).subscribe({
      next: res => {
        this.enrollments = res.data['enrollments'] || [];
        this.total = res.data['total'] || 0;
        this.pages = res.data['pages'] || 1;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  createEnrollment(): void {
    if (this.enrollForm.invalid) return;
    this.creating = true;
    const { studentId, courseId } = this.enrollForm.value;
    this.admin.createEnrollment(studentId, courseId).subscribe({
      next: () => {
        this.formMsg = { text: 'Enrolled successfully!', type: 'success' };
        this.enrollForm.reset();
        this.creating = false;
        this.load();
      },
      error: err => {
        this.formMsg = { text: err?.error?.message || 'Failed to enroll', type: 'error' };
        this.creating = false;
      }
    });
  }

  delete(e: Enrollment): void {
    if (!confirm('Remove this enrollment?')) return;
    this.admin.deleteEnrollment(e._id).subscribe({ next: () => this.load() });
  }

  changePage(p: number): void { this.page = p; this.load(); }
}
