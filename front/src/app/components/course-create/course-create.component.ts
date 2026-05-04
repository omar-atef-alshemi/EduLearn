import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { InstructorService } from '../../services/instructor.service';
import { Router, RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-course-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="content-body fade-in">
      <div class="header-section">
        <a routerLink="/instructor/dashboard" class="btn-back">← {{trans.get('back_to_dashboard')}}</a>
        <h1>{{trans.get('create_new_course')}}</h1>
        <p class="subtitle">{{trans.get('course_setup_msg')}}</p>
      </div>

      <form [formGroup]="courseForm" (ngSubmit)="onSubmit()">
        <!-- Basic Info Section -->
        <div class="glass-card section-card">
          <div class="section-header">
            <span class="step-num">1</span>
            <h3>{{trans.get('basic_information')}}</h3>
          </div>
          
        <div class="form-grid">
          <div class="form-group">
            <label>{{trans.get('course_title')}} (English) *</label>
            <input type="text" formControlName="titleEn" placeholder="e.g. Master React.js">
          </div>
          <div class="form-group">
            <label>{{trans.get('course_title')}} (Arabic) *</label>
            <input type="text" formControlName="titleAr" dir="rtl" placeholder="مثلاً: احتراف رياكت">
          </div>
          <div class="form-group full-width">
            <label>Description (English) *</label>
            <textarea formControlName="descEn" rows="3" placeholder="Tell students what this course is about..."></textarea>
          </div>
          <div class="form-group full-width">
            <label>الوصف (العربية) *</label>
            <textarea formControlName="descAr" dir="rtl" rows="3" placeholder="اشرح للطلاب محتوى الكورس..."></textarea>
          </div>
          <div class="form-group">
            <label>{{trans.get('category')}} *</label>
            <select formControlName="category">
              <option value="">{{trans.get('select_category')}}</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Languages">Languages</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{trans.get('price')}} ($) *</label>
            <input type="number" formControlName="price">
          </div>
          <div class="form-group full-width">
            <label>{{trans.get('thumbnail_url')}}</label>
            <div class="input-with-upload">
              <input type="text" formControlName="thumbnail" placeholder="Upload or paste image URL">
              <label class="btn-upload-action">
                <input type="file" (change)="onImageUpload($event)" accept="image/*" hidden>
                <span>📷 {{ uploadingThumb ? '...' : 'Upload' }}</span>
              </label>
            </div>
            <img *ngIf="courseForm.value.thumbnail" [src]="courseForm.value.thumbnail" class="thumb-preview-large">
          </div>
        </div>
      </div>

        <!-- Curriculum Section -->
        <div class="curriculum-header flex justify-between items-center mb-4">
          <div class="section-header">
            <span class="step-num">2</span>
            <h3>{{trans.get('curriculum')}}</h3>
          </div>
          <button type="button" class="btn-add-unit-top" (click)="addUnit()">+ {{trans.get('add_unit')}}</button>
        </div>

        <div formArrayName="sections">
          <div *ngFor="let unit of sections.controls; let i = index" [formGroupName]="i" class="glass-card unit-card slide-in">
            <div class="unit-top">
              <div class="unit-info">
                <span class="badge badge-indigo">UNIT {{ i + 1 }}</span>
                <div class="unit-titles">
                  <input type="text" formControlName="titleEn" placeholder="Unit Title (EN)">
                  <input type="text" formControlName="titleAr" dir="rtl" placeholder="عنوان الوحدة (AR)">
                </div>
              </div>
              <button type="button" class="btn-icon delete" (click)="removeUnit(i)">🗑️</button>
            </div>

            <!-- Lessons -->
            <div class="lessons-list" formArrayName="lessons">
              <div *ngFor="let lesson of getLessons(i).controls; let j = index" [formGroupName]="j" class="lesson-item">
                <div class="lesson-main">
                  <div class="lesson-header">
                    <span class="lesson-index">{{ j + 1 }}</span>
                    <input type="text" formControlName="title" placeholder="Lesson Title">
                    <select formControlName="type" class="type-mini">
                      <option value="video">Video</option>
                      <option value="pdf">PDF</option>
                    </select>
                  </div>
                  
                  <div class="lesson-url-row">
                    <input type="text" formControlName="url" placeholder="URL or Upload Video" [readonly]="uploadingIndex === i + '-' + j">
                    
                    <label class="btn-upload" *ngIf="lesson.value.type === 'video'">
                      <input type="file" (change)="onVideoUpload($event, i, j)" accept="video/*" hidden>
                      <span *ngIf="uploadingIndex !== i + '-' + j">📁 Upload</span>
                      <div *ngIf="uploadingIndex === i + '-' + j" class="spinner-sm"></div>
                    </label>
                    
                    <button type="button" class="btn-mini-del" (click)="removeLesson(i, j)">×</button>
                  </div>
                  
                  <div class="upload-progress" *ngIf="uploadingIndex === i + '-' + j">
                    <div class="progress-fill" style="width: 100%; animation: pulse 1.5s infinite"></div>
                  </div>
                </div>
              </div>
              <button type="button" class="btn-add-lesson" (click)="addLesson(i)">+ Add Lesson</button>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" routerLink="/instructor/dashboard" class="btn-cancel">Cancel</button>
          <button type="submit" class="btn-save" [disabled]="courseForm.invalid || loading">
            <span *ngIf="!loading">🚀 Create Course</span>
            <div *ngIf="loading" class="spinner"></div>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .content-body { max-width: 1100px; margin: 0 auto; padding: 50px 24px; }
    
    .header-section { margin-bottom: 48px; text-align: left; }
    .btn-back { color: var(--primary); text-decoration: none; font-weight: 700; font-size: 14px; margin-bottom: 16px; display: inline-flex; align-items: center; gap: 8px; transition: 0.3s; }
    .btn-back:hover { transform: translateX(-5px); }
    
    .header-section h1 { font-size: 36px; font-weight: 800; color: var(--text); letter-spacing: -1px; margin: 0; }
    .subtitle { color: var(--text-sec); font-size: 16px; margin-top: 10px; }

    .section-card { 
      background: var(--bg-elevated); border: 1px solid var(--border); 
      border-radius: 28px; padding: 40px; box-shadow: var(--shadow); 
      margin-bottom: 40px; position: relative; overflow: hidden;
    }
    .section-card::before { content: ''; position: absolute; top: 0; left: 0; width: 6px; height: 100%; background: var(--primary); }

    .section-header { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; }
    .step-num { 
      width: 44px; height: 44px; border-radius: 14px; 
      background: var(--primary);
      color: white; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 18px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    .section-header h3 { font-size: 22px; font-weight: 700; color: var(--text); margin: 0; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
    .form-group { display: flex; flex-direction: column; gap: 10px; }
    .form-group label { font-size: 14px; font-weight: 700; color: var(--text-sec); text-transform: uppercase; letter-spacing: 0.5px; }
    .form-group input, .form-group select, .form-group textarea {
      background: var(--bg); border: 2px solid var(--border); border-radius: 16px; padding: 14px 20px;
      color: var(--text); font-size: 15px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .form-group input:focus { border-color: var(--primary); background: var(--bg-elevated); box-shadow: 0 0 0 5px var(--accent); outline: none; }

    .input-with-upload { display: flex; gap: 12px; margin-bottom: 16px; }
    .btn-upload-action { 
      background: var(--primary); color: white; padding: 0 24px; border-radius: 14px;
      cursor: pointer; font-weight: 700; display: flex; align-items: center; gap: 10px; transition: 0.3s;
    }
    .btn-upload-action:hover { background: var(--primary-hover); transform: translateY(-2px); }

    .thumb-preview-large { 
      width: 100%; max-height: 300px; object-fit: cover; border-radius: 24px; 
      border: 1px solid var(--border); margin-top: 12px; box-shadow: var(--shadow);
    }

    /* Curriculum Section */
    .unit-card { 
      background: var(--bg-elevated); border: 1px solid var(--border); 
      border-radius: 28px; padding: 32px; margin-bottom: 32px;
      border-left: 8px solid var(--primary); transition: 0.3s;
    }
    .unit-card:hover { transform: translateY(-5px); box-shadow: var(--shadow); }

    .btn-save { 
      background: var(--primary);
      color: #FFFFFF !important; border: none; padding: 18px 60px; border-radius: 20px;
      font-weight: 800; font-size: 18px; cursor: pointer; transition: 0.4s;
      box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
    }
    .btn-save:hover { background: var(--primary-hover); transform: translateY(-3px) scale(1.02); box-shadow: 0 15px 40px rgba(59, 130, 246, 0.6); }

    .unit-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .unit-info { display: flex; flex-direction: column; gap: 12px; flex: 1; }
    .unit-titles { display: flex; gap: 16px; margin-bottom: 20px; }
    .unit-titles input { 
      flex: 1; background: var(--bg); border: 2px solid var(--border); 
      border-radius: 12px; padding: 12px 16px; color: var(--text);
      transition: 0.3s;
    }
    .unit-titles input:focus { border-color: var(--primary); outline: none; }

    .btn-add-unit-top {
      background: var(--accent); color: var(--primary); border: 1.5px solid var(--primary);
      padding: 10px 20px; border-radius: 10px; cursor: pointer; font-weight: 700;
      margin-bottom: 20px; transition: 0.3s; font-size: 13px;
    }
    .btn-add-unit-top:hover { background: var(--primary); color: white; }

    .form-actions { 
      display: flex; justify-content: flex-end; align-items: center; 
      gap: 20px; margin-top: 50px; padding-top: 30px; border-top: 1px solid var(--border);
    }
    .btn-cancel { color: var(--text-sec); background: none; border: none; cursor: pointer; font-weight: 600; }
    .btn-cancel:hover { color: #ef4444; }

    .lessons-list { background: rgba(0,0,0,0.02); border-radius: 20px; padding: 24px; margin-top: 16px; }
    
    .lesson-item { 
      background: var(--bg-elevated); border: 1px solid var(--border); 
      padding: 20px; border-radius: 16px; margin-bottom: 16px; 
      transition: 0.3s;
    }
    .lesson-item:hover { border-color: var(--primary); transform: translateX(5px); }
    
    .lesson-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .lesson-index { font-weight: 800; color: var(--text-muted); width: 20px; }
    
    .type-mini { width: 100px; padding: 8px; border-radius: 10px; font-size: 12px; }
    
    .lesson-url-row { display: flex; gap: 12px; align-items: center; }
    .lesson-url-row input { flex: 1; }

    .btn-upload { 
      background: var(--accent); color: var(--primary); padding: 10px 18px; 
      border-radius: 12px; border: 1.5px solid var(--border); cursor: pointer;
      font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 8px;
      transition: 0.3s;
    }
    .btn-upload:hover { background: var(--primary); color: white; border-color: var(--primary); }

    .btn-mini-del { background: rgba(239, 68, 68, 0.1); border: none; color: #ef4444; width: 36px; height: 36px; border-radius: 10px; cursor: pointer; font-size: 18px; transition: 0.3s; }
    .btn-mini-del:hover { background: #ef4444; color: white; }

    .btn-add-lesson { 
      width: 100%; padding: 14px; background: transparent; border: 2px dashed var(--border); 
      color: var(--text-sec); border-radius: 14px; cursor: pointer; font-weight: 700;
      transition: 0.3s;
    }
    .btn-add-lesson:hover { border-color: var(--primary); color: var(--primary); background: var(--bg-elevated); }

    .spinner-sm { width: 18px; height: 18px; border: 2px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
  `]
})
export class CourseCreateComponent {
  courseForm: FormGroup;
  loading = false;
  uploadingThumb = false;
  uploadingIndex: string | null = null; // e.g. "0-1" for unit 0, lesson 1

  constructor(
    private fb: FormBuilder,
    private instructorService: InstructorService,
    private router: Router,
    public trans: TranslationService
  ) {
    this.courseForm = this.fb.group({
      titleEn: ['', Validators.required],
      titleAr: ['', Validators.required],
      descEn: ['', Validators.required],
      descAr: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      thumbnail: [''],
      sections: this.fb.array([])
    });

    this.addUnit();
  }

  get sections() { return this.courseForm.get('sections') as FormArray; }
  getLessons(uIdx: number) { return this.sections.at(uIdx).get('lessons') as FormArray; }

  addUnit() {
    const unit = this.fb.group({
      titleEn: ['', Validators.required],
      titleAr: ['', Validators.required],
      lessons: this.fb.array([])
    });
    this.sections.push(unit);
    this.addLesson(this.sections.length - 1);
  }

  removeUnit(idx: number) { if (this.sections.length > 1) this.sections.removeAt(idx); }

  addLesson(uIdx: number) {
    const lesson = this.fb.group({
      type: ['video'],
      title: ['', Validators.required],
      url: ['', Validators.required]
    });
    this.getLessons(uIdx).push(lesson);
  }

  removeLesson(uIdx: number, lIdx: number) { this.getLessons(uIdx).removeAt(lIdx); }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.uploadingThumb = true;
    this.instructorService.directToCloudinary(file, 'image').subscribe({
      next: (res) => {
        this.courseForm.patchValue({ thumbnail: res.secure_url });
        this.uploadingThumb = false;
      },
      error: (err) => {
        console.error('Image upload failed', err);
        this.uploadingThumb = false;
      }
    });
  }

  onVideoUpload(event: any, uIdx: number, lIdx: number) {
    const file = event.target.files[0];
    if (!file) return;

    this.uploadingIndex = `${uIdx}-${lIdx}`;
    this.instructorService.directToCloudinary(file).subscribe({
      next: (res) => {
        // Cloudinary يرجع الرابط في secure_url
        this.getLessons(uIdx).at(lIdx).patchValue({ url: res.secure_url });
        this.uploadingIndex = null;
      },
      error: (err) => {
        console.error('Upload failed', err);
        alert('Upload failed: ' + err.message);
        this.uploadingIndex = null;
      }
    });
  }

  onSubmit() {
    if (this.courseForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    this.loading = true;
    const val = this.courseForm.value;
    const payload = {
      title: { en: val.titleEn, ar: val.titleAr },
      description: { en: val.descEn, ar: val.descAr },
      category: val.category,
      price: val.price,
      thumbnail: val.thumbnail,
      sections: val.sections.map((s: any, idx: number) => ({
        title: { en: s.titleEn, ar: s.titleAr },
        order: idx + 1,
        lessons: s.lessons
      }))
    };

    this.instructorService.createCourse(payload).subscribe({
      next: (res) => {
        this.router.navigate(['/instructor/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        alert('Failed to create course');
      }
    });
  }
}
