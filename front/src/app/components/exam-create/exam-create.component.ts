import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { InstructorService } from '../../services/instructor.service';
import { TranslationService } from '../../services/translation.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-exam-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="exam-page">
      <div class="page-header">
        <a routerLink="/instructor/dashboard" class="back-link">← {{trans.get('back')}}</a>
        <div>
          <h1>Create New Exam</h1>
          <p>Build professional quizzes and final exams for your courses</p>
        </div>
      </div>

      <div class="form-layout">
        <!-- Left: Settings & Questions -->
        <div class="builder-panel">
          <form [formGroup]="examForm" (ngSubmit)="onSubmit()">
            <div class="panel-card">
              <h3 class="panel-title">⚙️ Exam Configuration</h3>

              <div class="form-group">
                <label>Target Course *</label>
                <select formControlName="courseId" (change)="onCourseChange($event)" class="select-input">
                  <option value="">-- Select Course --</option>
                  <option *ngFor="let c of courses" [value]="c._id">{{ c.title?.en || c.title }}</option>
                </select>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Title (English)</label>
                  <input type="text" formControlName="titleEn" placeholder="Unit 1 Quiz" class="text-input">
                </div>
                <div class="form-group">
                  <label>Title (Arabic) *</label>
                  <input type="text" formControlName="titleAr" dir="rtl" placeholder="اختبار الوحدة الأولى" class="text-input">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Unit / Section</label>
                  <select formControlName="sectionId" class="select-input">
                    <option value="">🏆 Final Exam (Whole Course)</option>
                    <option *ngFor="let s of sections; let i = index" [value]="s._id">
                      Unit {{ i + 1 }}: {{ s.title?.en || s.title }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Duration (Minutes)</label>
                  <input type="number" formControlName="duration" class="text-input" min="1">
                </div>
              </div>
            </div>

            <div class="questions-section">
              <div class="questions-header">
                <h3 class="panel-title">❓ Questions Builder ({{ questions.length }})</h3>
                <button type="button" class="btn-add-q" (click)="addQuestion()">+ Add Question</button>
              </div>

              <div formArrayName="questions">
                <div *ngFor="let q of questions.controls; let i = index"
                     [formGroupName]="i" class="question-card">
                  <div class="q-header">
                    <span class="q-num">{{ i + 1 }}</span>
                    <button type="button" class="btn-remove-q" (click)="removeQuestion(i)">✕</button>
                  </div>

                  <div class="form-group">
                    <label>Question Title (Arabic) *</label>
                    <input type="text" formControlName="titleAr" dir="rtl" class="text-input" placeholder="اكتب السؤال هنا...">
                  </div>

                  <div class="options-grid">
                    <div *ngFor="let idx of [0,1,2,3]" class="option-input">
                      <span class="opt-letter">{{ ['A','B','C','D'][idx] }}</span>
                      <input type="text" [formControlName]="'opt' + idx" class="text-input" placeholder="Option {{ idx+1 }}">
                    </div>
                  </div>

                  <div class="q-footer">
                    <div class="form-group">
                      <label>Correct Answer</label>
                      <select [formControlName]="'correctAnswer'" class="select-input">
                        <option [value]="1">A</option>
                        <option [value]="2">B</option>
                        <option [value]="3">C</option>
                        <option [value]="4">D</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>Grade (Points)</label>
                      <input type="number" formControlName="grade" class="text-input" min="1">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions-bottom" style="margin-top: 40px;">
              <button type="submit" class="btn-submit" [disabled]="loading">
                {{ loading ? 'Saving...' : '🚀 Create & Publish Exam' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Right: Live Preview -->
        <div class="preview-panel">
          <div class="preview-card">
            <div class="preview-header">
              📱 LIVE STUDENT PREVIEW
            </div>
            <div class="preview-body">
              <div class="preview-title">{{ examForm.get('titleAr')?.value || examForm.get('titleEn')?.value || 'Exam Title' }}</div>
              <div class="preview-meta">
                <span>⏱ {{ examForm.get('duration')?.value }} min</span>
                <span>📊 {{ questions.length }} Qs</span>
              </div>
              
              <div class="preview-questions">
                <div *ngFor="let q of questions.controls; let i = index" class="preview-q">
                  <div class="pq-text">{{ i+1 }}. {{ q.get('titleAr')?.value || 'Question text...' }}</div>
                  <div class="pq-options">
                    <span *ngFor="let opt of ['opt0','opt1','opt2','opt3']; let j = index"
                          class="pq-opt"
                          [class.correct]="q.get('correctAnswer')?.value === j+1">
                      {{ ['A','B','C','D'][j] }}. {{ q.get(opt)?.value || '...' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .exam-page { padding: 40px; min-height: 100vh; background: var(--bg); color: var(--text); }
    .page-header { display: flex; align-items: center; gap: 24px; margin-bottom: 40px; }
    .back-link { color: var(--primary); text-decoration: none; font-size: 14px; font-weight: 700; transition: 0.3s; }
    .back-link:hover { transform: translateX(-5px); }
    .page-header h1 { font-size: 32px; font-weight: 800; margin: 0; letter-spacing: -1px; }
    .page-header p { color: var(--text-sec); margin-top: 6px; font-size: 16px; }

    .form-layout { display: grid; grid-template-columns: 1fr 420px; gap: 40px; align-items: start; }
    .panel-card {
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: 28px; padding: 40px; box-shadow: var(--shadow); margin-bottom: 32px;
    }
    .panel-title { color: var(--text); font-size: 20px; font-weight: 800; margin: 0 0 32px; display: flex; align-items: center; gap: 12px; }
    .form-group { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
    .form-group label { color: var(--text-sec); font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
    
    .text-input, .select-input {
      background: var(--bg); border: 2px solid var(--border);
      border-radius: 16px; padding: 14px 20px; color: var(--text); font-size: 15px;
      transition: 0.3s; outline: none;
    }
    .text-input:focus, .select-input:focus { border-color: var(--primary); box-shadow: 0 0 0 5px var(--accent); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

    .btn-add-q {
      background: var(--accent); color: var(--primary); border: 2px solid var(--primary);
      padding: 12px 24px; border-radius: 14px; cursor: pointer; font-weight: 800; transition: 0.3s;
    }
    .btn-add-q:hover { background: var(--primary); color: white; transform: translateY(-2px); }

    .question-card {
      background: var(--bg); border: 1px solid var(--border);
      border-radius: 24px; padding: 32px; margin-bottom: 24px; 
      border-left: 8px solid var(--primary); transition: 0.3s;
    }
    .question-card:hover { transform: scale(1.01); box-shadow: var(--shadow); }
    .q-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .q-num {
      background: linear-gradient(135deg, var(--primary), var(--indigo));
      color: white; width: 36px; height: 36px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; font-weight: 800;
    }
    .btn-remove-q {
      background: rgba(239, 68, 68, 0.1); border: none; color: #ef4444;
      width: 36px; height: 36px; border-radius: 10px; cursor: pointer;
      display: flex; align-items: center; justify-content: center; transition: 0.3s;
    }

    .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 24px 0; }
    .opt-letter {
      width: 36px; height: 36px; border-radius: 50%; background: var(--accent);
      color: var(--primary); display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 14px; flex-shrink: 0;
    }

    .preview-panel { position: sticky; top: 120px; }
    .preview-card { background: var(--accent); border: 2px solid var(--primary); border-radius: 28px; overflow: hidden; }
    .preview-header { background: var(--primary); color: white; padding: 20px; text-align: center; font-weight: 800; }
    .preview-body { padding: 24px; }
    .preview-title { font-size: 20px; font-weight: 800; color: var(--text); margin-bottom: 16px; }
    
    .pq-text { font-size: 14px; font-weight: 700; margin-bottom: 12px; color: var(--text); }
    .pq-opt { 
      display: block; padding: 10px 14px; border-radius: 10px; font-size: 13px; 
      color: var(--text-sec); margin-bottom: 6px; border: 1px solid var(--border); background: var(--bg-elevated);
    }
    .pq-opt.correct { background: rgba(16, 185, 129, 0.1); color: #10b981; border-color: #10b981; font-weight: 700; }

    .btn-submit {
      background: var(--primary);
      color: #FFFFFF !important;
      padding: 18px 60px; border-radius: 20px; font-weight: 800; font-size: 18px;
      border: none; cursor: pointer; box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
      transition: 0.4s; width: 100%;
    }
    .btn-submit:hover:not(:disabled) { 
      transform: translateY(-3px); 
      background: var(--primary-hover);
      box-shadow: 0 15px 40px rgba(59, 130, 246, 0.6); 
    }
  `]
})
export class ExamCreateComponent implements OnInit {
  examForm: FormGroup;
  courses: any[] = [];
  sections: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private instructorService: InstructorService,
    public trans: TranslationService, // تعديل: جعلناه عاماً للوصول إليه من الـ HTML
    private router: Router
  ) {
    this.examForm = this.fb.group({
      courseId: ['', Validators.required],
      sectionId: [''],
      isFinal: [false],
      titleEn: [''], // جعلناه اختياري
      titleAr: ['', Validators.required],
      duration: [60, [Validators.required, Validators.min(1)]],
      minScore: [50, [Validators.required, Validators.min(1), Validators.max(100)]],
      questions: this.fb.array([])
    });
  }

  get questions() { return this.examForm.get('questions') as FormArray; }

  ngOnInit(): void {
    this.instructorService.getMyCourses().subscribe({
      next: (res) => {
        if (res.success) this.courses = res.courses;
      }
    });
    this.addQuestion();
  }

  onCourseChange(event: any) {
    const courseId = event.target.value;
    const selectedCourse = this.courses.find(c => c._id === courseId);
    this.sections = selectedCourse?.sections || [];
  }

  addQuestion() {
    this.questions.push(this.fb.group({
      titleEn: [''], // اختياري
      titleAr: ['', Validators.required],
      opt0: ['', Validators.required],
      opt1: ['', Validators.required],
      opt2: [''], // جعلنا بعض الخيارات اختيارية
      opt3: [''], 
      correctAnswer: [1, [Validators.required, Validators.min(1), Validators.max(4)]],
      grade: [1, Validators.required]
    }));
  }

  removeQuestion(i: number) { this.questions.removeAt(i); }

  onSubmit() {
    if (this.examForm.invalid) {
      alert('يرجى ملء جميع الحقول المطلوبة الأساسية (مثل اسم الكورس، وعنوان الاختبار، والسؤال العربي، وخيارين على الأقل).');
      return;
    }
    
    this.loading = true;

    const v = this.examForm.value;
    const payload = {
      courseId: v.courseId,
      sectionId: v.sectionId || null,
      isFinal: v.isFinal || !v.sectionId,
      title: { en: v.titleEn || v.titleAr, ar: v.titleAr },
      duration: v.duration,
      minScore: v.minScore,
      questions: v.questions.map((q: any) => {
        // فلترة الخيارات الفارغة
        const options = [q.opt0, q.opt1, q.opt2, q.opt3].filter(o => o && o.trim() !== '');
        return {
          questionText: { en: q.titleEn || q.titleAr, ar: q.titleAr },
          options: { ar: options, en: options }, // 🔥 تأكدنا إنها كائن فيه ar و en
          correctAnswerIndex: q.correctAnswer - 1, // تأكد إن الـ Index بيشاور صح
          grade: q.grade
        };
      })
    };

    console.log("📤 Sending Exam Payload:", payload);

    this.instructorService.createExam(payload).subscribe({
      next: () => {
        alert('✅ تم حفظ الاختبار بنجاح!');
        this.router.navigate(['/instructor/courses']);
      },
      error: (err) => {
        console.error("❌ Error API:", err);
        this.loading = false;
        alert('فشل حفظ الاختبار: ' + (err.error?.message || err.message));
      }
    });
  }
}
