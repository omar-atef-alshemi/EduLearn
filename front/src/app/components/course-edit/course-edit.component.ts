import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InstructorService } from '../../services/instructor.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-course-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="content-body">
      <div class="header-section">
        <a routerLink="/instructor/dashboard" class="btn-back">← Back to Dashboard</a>
        <h2>Edit Course</h2>
        <p class="subtitle">Update your course details and settings</p>
      </div>

      <div class="card form-card" *ngIf="!fetching; else loader">
        <form [formGroup]="courseForm" (ngSubmit)="onSubmit()">
          
          <div class="section-title">Basic Information</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Course Title (English) *</label>
              <input type="text" formControlName="titleEn" placeholder="e.g. Fullstack Web Dev">
            </div>
            <div class="form-group">
              <label>Course Title (Arabic) *</label>
              <input type="text" formControlName="titleAr" dir="rtl" placeholder="مثلاً: تطوير الويب الشامل">
            </div>
            <div class="form-group">
              <label>Category *</label>
              <select formControlName="category">
                <option value="">Select Category</option>
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div class="form-group">
              <label>Price ($) *</label>
              <input type="number" formControlName="price" placeholder="0.00">
            </div>
          </div>

          <div class="section-title">Course Media</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Thumbnail Image URL</label>
              <input type="text" formControlName="thumbnail" placeholder="https://example.com/image.jpg">
            </div>
            <div class="form-group">
              <label>Intro Video URL</label>
              <input type="text" formControlName="introVideoUrl" placeholder="https://youtube.com/watch?v=...">
            </div>
            <div class="form-group checkbox-group full-width">
              <label class="switch">
                <input type="checkbox" formControlName="isPublished">
                <span class="slider round"></span>
              </label>
              <span>Published</span>
            </div>
          </div>

          <div class="section-title">Descriptions</div>
          <div class="form-grid">
            <div class="form-group">
              <label>Description (English)</label>
              <textarea formControlName="descriptionEn" rows="4"></textarea>
            </div>
            <div class="form-group">
              <label>Description (Arabic)</label>
              <textarea formControlName="descriptionAr" dir="rtl" rows="4"></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" routerLink="/instructor/dashboard" class="btn btn-outline">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="courseForm.invalid || loading">
              {{ loading ? 'Saving Changes...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>

      <ng-template #loader>
        <div class="loader-container">
          <div class="spinner"></div>
          <p>Fetching course data...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .content-body { padding: 40px; max-width: 1100px; margin: 0 auto; background: var(--bg); color: var(--text); }
    .header-section { margin-bottom: 32px; }
    .btn-back { color: var(--primary); text-decoration: none; font-size: 14px; font-weight: 700; display: block; margin-bottom: 8px; transition: 0.3s; }
    .btn-back:hover { transform: translateX(-5px); }
    .header-section h2 { font-size: 32px; font-weight: 800; color: var(--text); margin: 0; }
    .subtitle { color: var(--text-sec); margin-top: 4px; }
    
    .form-card { background: var(--bg-elevated); padding: 40px; border-radius: 28px; box-shadow: var(--shadow); border: 1px solid var(--border); }
    .section-title { font-size: 18px; font-weight: 800; color: var(--primary); margin: 40px 0 20px; padding-bottom: 12px; border-bottom: 2px solid var(--border); text-transform: uppercase; letter-spacing: 1px; }
    .section-title:first-child { margin-top: 0; }
    
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-group.full-width { grid-column: span 2; }
    label { font-size: 13px; font-weight: 700; color: var(--text-sec); text-transform: uppercase; }
    
    input, select, textarea { 
      background: var(--bg); border: 2px solid var(--border); border-radius: 14px; 
      padding: 12px 16px; color: var(--text); font-size: 15px; outline: none; transition: 0.3s;
    }
    input:focus, select:focus, textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 4px var(--accent); }

    .checkbox-group { flex-direction: row; align-items: center; gap: 16px; background: var(--accent); padding: 16px; border-radius: 16px; }
    .switch { position: relative; display: inline-block; width: 48px; height: 26px; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--text-muted); transition: .4s; border-radius: 34px; }
    .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
    input:checked + .slider { background-color: var(--primary); }
    input:checked + .slider:before { transform: translateX(22px); }
    
    .form-actions { display: flex; justify-content: flex-end; gap: 20px; margin-top: 40px; padding-top: 32px; border-top: 1px solid var(--border); }
    .btn { padding: 14px 32px; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; transition: 0.3s; }
    .btn-primary { background: linear-gradient(135deg, var(--primary), var(--indigo)); color: white; box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(79, 70, 229, 0.4); }
    .btn-outline { background: transparent; border: 2px solid var(--border); color: var(--text-sec); }
    .btn-outline:hover { border-color: var(--primary); color: var(--primary); }

    .loader-container { text-align: center; padding: 100px 0; color: var(--text-sec); }
    .spinner { width: 44px; height: 44px; border: 4px solid var(--border); border-top: 4px solid var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .content-body { padding: 20px; }
      .form-card { padding: 24px; }
      .form-actions { flex-direction: column-reverse; }
      .btn { width: 100%; }
    }
  `]
})
export class CourseEditComponent implements OnInit {
  courseForm: FormGroup;
  loading = false;
  fetching = true;
  courseId: string = '';

  constructor(
    private fb: FormBuilder,
    private instructorService: InstructorService,
    private router: Router,
    private route: ActivatedRoute,
    public trans: TranslationService
  ) {
    this.courseForm = this.fb.group({
      titleEn: ['', Validators.required],
      titleAr: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      descriptionEn: [''],
      descriptionAr: [''],
      thumbnail: [''],
      introVideoUrl: [''],
      isPublished: [false]
    });
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    if (this.courseId) {
      this.instructorService.getCourseById(this.courseId).subscribe({
        next: (res) => {
          if (res.success && res.course) {
            const c = res.course;
            this.courseForm.patchValue({
              titleEn: c.title?.en || '',
              titleAr: c.title?.ar || '',
              category: c.category || '',
              price: c.price || 0,
              descriptionEn: c.description?.en || '',
              descriptionAr: c.description?.ar || '',
              thumbnail: c.thumbnail || '',
              introVideoUrl: c.introVideoUrl || '',
              isPublished: c.isPublished || false
            });
          }
          this.fetching = false;
        },
        error: (err) => {
          console.error('Error fetching course:', err);
          this.fetching = false;
        }
      });
    }
  }

  onSubmit() {
    if (this.courseForm.invalid) return;
    this.loading = true;
    const formVal = this.courseForm.value;
    const courseData = {
      title: { en: formVal.titleEn, ar: formVal.titleAr },
      description: { en: formVal.descriptionEn, ar: formVal.descriptionAr },
      thumbnail: formVal.thumbnail,
      introVideoUrl: formVal.introVideoUrl,
      category: formVal.category,
      price: formVal.price,
      isPublished: formVal.isPublished
    };

    this.instructorService.updateCourse(this.courseId, courseData).subscribe({
      next: () => this.router.navigate(['/instructor/dashboard']),
      error: (err) => {
        console.error('Error updating course:', err);
        this.loading = false;
        alert('Failed to update course.');
      }
    });
  }
}
