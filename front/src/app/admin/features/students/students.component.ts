import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { Student, User } from '../../core/models';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class StudentsComponent implements OnInit {

  students: Student[] = [];
  loading     = false;
  total       = 0;
  activeCount = 0;
  page        = 1;
  pages       = 1;

  searchQuery  = '';
  activeFilter = '';
  private searchTimer: any;

  editingStudent: Student | null = null;
  updating    = false;
  editError   = '';
  editSuccess = '';
  editForm: FormGroup;

  constructor(private admin: AdminService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      firstName:       ['', Validators.required],
      lastName:        ['', Validators.required],
      phone:           [''],
      certificateName: ['']
    });
  }

  ngOnInit(): void { this.load(); }

  // ── Helper: استخرج الـ id سواء كان string أو User object ──
  private getId(userId: User | string): string {
    return typeof userId === 'string' ? userId : userId._id;
  }

  // ── Load ──────────────────────────────────────────────
  load(): void {
    this.loading = true;
    const params: any = { page: this.page, limit: 10 };
    if (this.activeFilter !== '') params.isActive = this.activeFilter;
    if (this.searchQuery)        params.search    = this.searchQuery;

    this.admin.getAllStudents(params).subscribe({
      next: (res: any) => {
        const d          = res.data || res;
        this.students    = d.students || [];
        this.total       = d.total    || 0;
        this.pages       = d.pages    || 1;
        this.activeCount = d.activeTotal ?? this.students.filter((s: Student) => s.userId?.isActive).length;
        this.loading     = false;
      },
      error: () => { this.loading = false; }
    });
  }

  // ── Search ────────────────────────────────────────────
  onSearch(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.page = 1; this.load(); }, 350);
  }

  clearSearch(): void { this.searchQuery = ''; this.page = 1; this.load(); }

  // ── Edit modal ────────────────────────────────────────
  openEditModal(s: Student): void {
    this.editingStudent = s;
    this.editError      = '';
    this.editSuccess    = '';
    this.editForm.patchValue({
      firstName:       s.firstName       || '',
      lastName:        s.lastName        || '',
      phone:           s.phone           || '',
      certificateName: s.certificateName || ''
    });
  }

  closeEditModal(): void {
    this.editingStudent = null;
    this.editError      = '';
    this.editSuccess    = '';
  }

  submitUpdate(): void {
    if (this.editForm.invalid || !this.editingStudent) return;
    this.updating  = true;
    this.editError = '';

    const userId = this.getId(this.editingStudent.userId);

    this.admin.updateStudent(userId, this.editForm.value).subscribe({
      next: () => {
        this.editSuccess = 'Student updated successfully!';
        this.updating    = false;
        this.load();
        setTimeout(() => this.closeEditModal(), 1200);
      },
      error: err => {
        this.editError = err?.error?.message || 'Failed to update student';
        this.updating  = false;
      }
    });
  }

  // ── Activate / Deactivate ─────────────────────────────
  activate(s: Student): void {
    this.admin.activateStudent(this.getId(s.userId)).subscribe({ next: () => this.load() });
  }

  deactivate(s: Student): void {
    this.admin.deactivateStudent(this.getId(s.userId)).subscribe({ next: () => this.load() });
  }

  // ── Delete ────────────────────────────────────────────
  delete(s: Student): void {
    const userId = this.getId(s.userId);
    if (!confirm(`Delete ${s.firstName} ${s.lastName}?`)) return;

    this.loading = true;
    this.admin.deleteStudent(userId).subscribe({
      next: () => {
        this.students = this.students.filter(st => this.getId(st.userId) !== userId);
        this.total--;
        this.loading = false;
      },
      error: () => { this.loading = false; alert('Failed to delete student.'); }
    });
  }

  changePage(p: number): void { this.page = p; this.load(); }
}
