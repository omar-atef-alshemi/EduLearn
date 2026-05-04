import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { Teacher } from '../../core/models';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class TeachersComponent implements OnInit {

  // ── List state ──────────────────────────────────────
  teachers: Teacher[] = [];
  loading = false;
  total = 0; page = 1; pages = 1;
  statusFilter = '';

  // ── Create form state ────────────────────────────────
  showForm = false;
  creating = false;
  formError = '';
  formSuccess = '';
  teacherForm: FormGroup;

  // ── Edit modal state ─────────────────────────────────
  editingTeacher: Teacher | null = null;
  updating = false;
  editError = '';
  editSuccess = '';
  editForm: FormGroup;

  constructor(private admin: AdminService, private fb: FormBuilder) {

    // Create form – password required
    this.teacherForm = this.fb.group({
      firstName:       ['', Validators.required],
      lastName:        ['', Validators.required],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(6)]],
      jobTitle:        [''],
      specialization:  [''],
      experienceYears: [null],
      phone:           ['']
    });

    // Edit form – no password, extra profile fields
    this.editForm = this.fb.group({
      firstName:       ['', Validators.required],
      lastName:        ['', Validators.required],
      jobTitle:        [''],
      specialization:  [''],
      experienceYears: [null],
      phone:           [''],
      linkedinUrl:     [''],
      educationLevel:  [''],
      country:         [''],
      state:           ['']
    });
  }

  ngOnInit(): void { this.load(); }

  // ── Load list ─────────────────────────────────────────
  load(): void {
    this.loading = true;
    this.admin.getAllTeachers({ page: this.page, limit: 10, status: this.statusFilter || undefined }).subscribe({
      next: res => {
        this.teachers = res.data['teachers'] || [];
        this.total    = res.data['total']    || 0;
        this.pages    = res.data['pages']    || 1;
        this.loading  = false;
      },
      error: () => { this.loading = false; }
    });
  }

  // ── Create ────────────────────────────────────────────
  createTeacher(): void {
    if (this.teacherForm.invalid) return;
    this.creating = true;
    this.formError = '';
    this.formSuccess = '';
    this.admin.createTeacher(this.teacherForm.value).subscribe({
      next: () => {
        this.formSuccess = 'Teacher created successfully!';
        this.teacherForm.reset();
        this.creating = false;
        this.load();
      },
      error: err => {
        this.formError = err?.error?.message || 'Failed to create teacher';
        this.creating = false;
      }
    });
  }

  // ── Edit modal ────────────────────────────────────────
  openEditModal(t: Teacher): void {
    this.editingTeacher = t;
    this.editError   = '';
    this.editSuccess = '';

    // Pre-fill form with current teacher data
    this.editForm.patchValue({
      firstName:       t.firstName,
      lastName:        t.lastName,
      jobTitle:        t.jobTitle        || '',
      specialization:  t.specialization  || '',
      experienceYears: t.experienceYears ?? null,
      phone:           t.phone           || '',
      linkedinUrl:     t.linkedinUrl     || '',
      educationLevel:  t.educationLevel  || '',
      country:         t.location?.country || '',
      state:           t.location?.state   || ''
    });
  }

  closeEditModal(): void {
    this.editingTeacher = null;
    this.editError   = '';
    this.editSuccess = '';
  }

  submitUpdate(): void {
    if (this.editForm.invalid || !this.editingTeacher) return;
    this.updating  = true;
    this.editError = '';
    this.editSuccess = '';

    const { country, state, ...rest } = this.editForm.value;

    // Build payload – only send non-empty values
    const payload: Partial<Teacher> = {
      ...rest,
      ...(country || state ? { location: { country, state } } : {})
    };

    this.admin.updateTeacher(this.editingTeacher.userId._id, payload).subscribe({
      next: () => {
        this.editSuccess = 'Teacher updated successfully!';
        this.updating = false;
        this.load();
        // Close after short delay so the user sees the success message
        setTimeout(() => this.closeEditModal(), 1200);
      },
      error: err => {
        this.editError = err?.error?.message || 'Failed to update teacher';
        this.updating  = false;
      }
    });
  }

  // ── Status / activate / deactivate / delete ───────────
  setStatus(t: Teacher, status: 'approved' | 'rejected'): void {
    this.admin.updateTeacherStatus(t._id, status).subscribe({ next: () => this.load() });
  }

  activate(t: Teacher): void {
    this.admin.activateTeacher(t.userId._id).subscribe({ next: () => this.load() });
  }

  deactivate(t: Teacher): void {
    this.admin.deactivateTeacher(t.userId._id).subscribe({ next: () => this.load() });
  }

  delete(t: Teacher): void {
    if (!confirm(`Delete teacher ${t.firstName} ${t.lastName}?`)) return;
    this.admin.deleteTeacher(t.userId._id).subscribe({ next: () => this.load() });
  }

  changePage(p: number): void { this.page = p; this.load(); }

  resetForm(): void {
    this.teacherForm.reset();
    this.formError = '';
    this.formSuccess = '';
  }
}
