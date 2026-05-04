import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';
import { DataService } from '../../services/data.service';
import { ApiService } from '../../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-course-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="course-viewer">
      <!-- ======= SIDEBAR ======= -->
      <div class="sidebar">
        <div class="sidebar-header">
          <a [routerLink]="userRole === 'teacher' ? '/instructor/dashboard' : '/student/dashboard'" class="back-link">← {{ userRole === 'teacher' ? 'Instructor' : 'Student' }} Dashboard</a>
          <h3>{{ course?.title?.en || course?.title || 'Loading...' }}</h3>
          <div class="course-meta">
            <span class="cat-tag">{{ course?.category }}</span>
            <span class="count-tag" *ngIf="course">{{ getSections().length }} units · {{ getTotalLessons() }} lessons</span>
          </div>
        </div>

        <!-- Loading & Error states -->
        <div *ngIf="!course && !loadError" class="state-msg">⏳ Loading course...</div>
        <div *ngIf="loadError" class="error-msg">❌ {{ loadError }}</div>
        <div *ngIf="course && getSections().length === 0" class="state-msg">⚠️ No units yet.</div>

        <!-- Units List -->
        <div class="units-list">
          <div *ngFor="let unit of getSections(); let i = index" class="unit-block">
            <div class="unit-header" (click)="toggleUnit(i)" [class.open]="activeUnit === i">
              <div class="unit-left">
                <span class="unit-num">{{ i + 1 }}</span>
                <span class="unit-name">{{ unit.title?.en || unit.title }}</span>
              </div>
              <div class="unit-right">
                <span class="lcount">{{ getLessons(unit).length }}</span>
                <span class="chevron">{{ activeUnit === i ? '▲' : '▼' }}</span>
              </div>
            </div>

            <!-- Lessons -->
            <div class="lesson-list" *ngIf="activeUnit === i">
              <div *ngFor="let lesson of getLessons(unit)"
                   class="lesson-row"
                   [class.active]="activeLesson === lesson"
                   [class.quiz-lesson]="lesson._isQuiz"
                   [class.completed]="isLessonCompleted(lesson._id)"
                   (click)="selectItem(lesson, unit._id)">
                <span class="lesson-icon">
                  <i *ngIf="isLessonCompleted(lesson._id)" class="fas fa-check-circle completed-icon"></i>
                  <span *ngIf="!isLessonCompleted(lesson._id)">
                    {{ lesson._isQuiz ? '📝' : lesson.type === 'video' ? '▶' : '📄' }}
                  </span>
                </span>
                <span class="lesson-name">{{ lesson.title }}</span>
                <span class="lesson-tag" *ngIf="lesson._isQuiz">Quiz</span>
              </div>
              <div *ngIf="getLessons(unit).length === 0" class="no-lessons">No lessons yet</div>
            </div>
          </div>

          <!-- Final Exam Block -->
          <div class="unit-block final-exam-block" *ngIf="course?.finalExam">
            <div class="lesson-row quiz-lesson" 
                 [class.active]="activeLesson === course.finalExam"
                 (click)="selectFinalExam()">
              <span class="lesson-icon">🏆</span>
              <span class="lesson-name">{{ course.finalExam.title?.en || course.finalExam.title?.ar || 'Final Exam' }}</span>
              <span class="lesson-tag">Final</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ======= MAIN CONTENT ======= -->
      <div class="main">
        <!-- Header -->
        <div class="main-header">
          <div class="flex justify-between items-center">
            <div>
              <h2>{{ activeLesson?.title || course?.title?.en || 'Course Preview' }}</h2>
              <p class="sub" *ngIf="!activeLesson">👈 Pick a lesson from the sidebar to begin</p>
            </div>
            
            <button *ngIf="activeLesson && !activeLesson._isQuiz && userRole === 'student' && !isLessonCompleted(activeLesson._id)" 
                    class="btn-complete" 
                    (click)="markAsCompleted()"
                    [disabled]="completing">
              <i class="fas fa-check"></i> {{ completing ? 'Saving...' : 'Mark as Completed' }}
            </button>
            <span *ngIf="isLessonCompleted(activeLesson?._id)" class="already-done">
              <i class="fas fa-check-double"></i> Completed
            </span>
          </div>
        </div>

        <!-- Video Player -->
        <div class="video-area" *ngIf="activeLesson && !activeLesson._isQuiz && activeLesson.type === 'video'">
          <div class="video-wrapper">
            <iframe [src]="getSafeUrl(activeLesson.url)"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
            </iframe>
          </div>
          <div class="lesson-info">
            <h3>{{ activeLesson.title }}</h3>
          </div>
        </div>

        <!-- PDF Viewer -->
        <div class="pdf-area" *ngIf="activeLesson && !activeLesson._isQuiz && activeLesson.type === 'pdf'">
          <div class="pdf-card">
            <span class="pdf-icon-big">📄</span>
            <h3>{{ activeLesson.title }}</h3>
            <a [href]="activeLesson.url" target="_blank" class="btn-open-pdf">Open PDF ↗</a>
          </div>
        </div>

        <!-- Quiz / Exam Viewer -->
        <div class="quiz-area" *ngIf="activeLesson?._isQuiz">
          <div class="quiz-header">
            <div class="quiz-icon">📝</div>
            <div>
              <h2>{{ activeLesson.title }}</h2>
              <div class="quiz-meta">
                <span *ngIf="activeLesson.duration">⏱ {{ activeLesson.duration }} min</span>
                <span *ngIf="activeLesson.minScore">✅ Pass: {{ activeLesson.minScore }}%</span>
                <span>❓ {{ activeLesson.questions?.length || 0 }} Questions</span>
              </div>
            </div>
          </div>

          <!-- Start Quiz or Show Questions -->
          <div *ngIf="!quizStarted" class="quiz-start">
            <button class="btn-start-quiz" (click)="startQuiz()">▶ Start Quiz</button>
          </div>

          <div *ngIf="quizStarted && !quizSubmitted" class="quiz-body">
            <div *ngFor="let q of activeLesson.questions; let qi = index" class="quiz-question">
              <p class="q-text">{{ qi + 1 }}. {{ q.questionText?.ar || q.questionText?.en || q.questionText || q.text }}</p>
              <div class="q-options">
                <button *ngFor="let opt of getQuestionOptions(q); let oi = index"
                        class="opt-btn"
                        [class.selected]="userAnswers[qi] === oi"
                        (click)="!quizSubmitted && selectAnswer(qi, oi)">
                  <span class="opt-letter">{{ ['A','B','C','D'][oi] }}</span>
                  {{ opt }}
                </button>
                <p *ngIf="getQuestionOptions(q).length === 0" class="error-msg">
                  ⚠️ No options found for this question.
                </p>
              </div>
            </div>
            <button class="btn-submit-quiz" (click)="submitQuiz()" [disabled]="completing">
              {{ completing ? 'Submitting...' : 'Submit Answers' }}
            </button>
          </div>

          <div *ngIf="quizSubmitted" class="quiz-result">
            <div class="result-circle" [class.passed]="quizScore >= (activeLesson.minScore || 50)">
              <span class="score">{{ quizScore }}%</span>
              <span class="label">{{ quizScore >= (activeLesson.minScore || 50) ? '✅ Passed' : '❌ Failed' }}</span>
            </div>
            <p>You answered {{ correctCount }}/{{ activeLesson.questions?.length }} correctly</p>
            
            <div class="result-actions">
              <button class="btn-retry" (click)="retryQuiz()">↺ Retry Quiz</button>
              <button *ngIf="quizScore >= (activeLesson.minScore || 50) && activeLesson._isFinal" 
                      class="btn-primary-glow" 
                      routerLink="/student/certificates">
                🏆 View My Certificate
              </button>
            </div>
          </div>
        </div>

        <!-- Welcome Placeholder -->
        <div class="welcome" *ngIf="!activeLesson">
          <div class="play-btn">▶</div>
          <h3>Ready to start learning?</h3>
          <p>Select a lesson or quiz from the sidebar to get started.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    * { box-sizing: border-box; }

    .course-viewer {
      display: flex; height: 100vh; overflow: hidden;
      background: #0a0f1e; font-family: 'Outfit', 'Inter', sans-serif;
    }

    /* ===== SIDEBAR ===== */
    .sidebar {
      width: 320px; min-width: 320px; display: flex; flex-direction: column;
      background: #111827; border-right: 1px solid #1f2937; overflow-y: auto;
    }
    .sidebar-header {
      padding: 24px 20px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      flex-shrink: 0;
    }
    .back-link { color: rgba(255,255,255,0.7); text-decoration: none; font-size: 12px; display: block; margin-bottom: 12px; }
    .sidebar-header h3 { color: white; font-size: 16px; font-weight: 700; margin: 0 0 10px; }
    .course-meta { display: flex; flex-wrap: wrap; gap: 8px; }
    .cat-tag, .count-tag {
      background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.85);
      padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
    }

    .state-msg { padding: 30px 20px; text-align: center; color: #4b5563; font-size: 14px; }
    .error-msg { padding: 20px; color: #ef4444; font-size: 13px; }

    .units-list { flex: 1; }
    .unit-block { border-bottom: 1px solid #1f2937; }
    .unit-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 14px 18px; cursor: pointer; transition: background .2s;
    }
    .unit-header:hover, .unit-header.open { background: #1f2937; }
    .unit-left { display: flex; align-items: center; gap: 10px; }
    .unit-num {
      background: #4f46e5; color: white; width: 24px; height: 24px;
      border-radius: 8px; display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800; flex-shrink: 0;
    }
    .unit-name { color: #d1d5db; font-size: 13px; font-weight: 600; }
    .unit-right { display: flex; align-items: center; gap: 8px; }
    .lcount { background: #1f2937; color: #6b7280; padding: 2px 8px; border-radius: 10px; font-size: 11px; }
    .chevron { color: #6b7280; font-size: 10px; }

    .lesson-list { background: #0d1117; padding: 4px 0; }
    .lesson-row {
      display: flex; align-items: center; gap: 10px; padding: 10px 20px 10px 32px;
      cursor: pointer; color: #6b7280; font-size: 13px; transition: all .2s;
      border-bottom: 1px solid #111827;
    }
    .lesson-row:hover { color: #a5b4fc; background: rgba(99,102,241,0.08); }
    .lesson-row.active { color: white; background: #4f46e5; }
    .lesson-row.quiz-lesson { color: #34d399; }
    .lesson-row.quiz-lesson.active { background: #065f46; color: #34d399; }
    .lesson-icon { font-size: 12px; width: 16px; text-align: center; flex-shrink: 0; }
    .lesson-name { flex: 1; }
    .lesson-tag { background: #064e3b; color: #34d399; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; }
    .no-lessons { padding: 12px 32px; color: #374151; font-size: 12px; font-style: italic; }

    /* ===== MAIN ===== */
    .main { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
    .main-header { padding: 24px 32px; background: #111827; border-bottom: 1px solid #1f2937; flex-shrink: 0; }
    .main-header h2 { color: white; margin: 0; font-size: 20px; font-weight: 700; }
    .sub { color: #4b5563; margin: 6px 0 0; font-size: 14px; }

    /* Video */
    .video-area { flex: 1; padding: 24px 32px; display: flex; flex-direction: column; gap: 20px; }
    .video-wrapper { border-radius: 16px; overflow: hidden; background: #000; position: relative; padding-bottom: 56.25%; }
    .video-wrapper iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
    .lesson-info h3 { color: white; margin: 0; font-size: 18px; }

    /* PDF */
    .pdf-area { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; }
    .pdf-card { text-align: center; color: white; }
    .pdf-icon-big { font-size: 80px; display: block; margin-bottom: 20px; }
    .pdf-card h3 { font-size: 24px; margin-bottom: 24px; }
    .btn-open-pdf {
      display: inline-block; background: #4f46e5; color: white; padding: 14px 32px;
      border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px;
    }

    /* Quiz */
    .quiz-area { flex: 1; padding: 32px; overflow-y: auto; }
    .quiz-header { display: flex; align-items: flex-start; gap: 20px; margin-bottom: 32px; }
    .quiz-icon {
      font-size: 36px; background: rgba(52,211,153,0.1); width: 70px; height: 70px;
      border-radius: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .quiz-area h2 { color: white; margin: 0 0 10px; font-size: 22px; }
    .quiz-meta { display: flex; gap: 12px; flex-wrap: wrap; }
    .quiz-meta span { background: rgba(255,255,255,0.05); color: #9ca3af; padding: 4px 14px; border-radius: 20px; font-size: 13px; }

    .quiz-start { text-align: center; padding: 60px 0; }
    .btn-start-quiz {
      background: linear-gradient(135deg, #059669, #10b981); color: white;
      padding: 16px 48px; border-radius: 16px; border: none; cursor: pointer;
      font-size: 18px; font-weight: 700; transition: all .2s;
    }
    .btn-start-quiz:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(16,185,129,0.4); }

    .quiz-body { max-width: 700px; }
    .quiz-question { background: rgba(255,255,255,0.03); border: 1px solid #1f2937; border-radius: 16px; padding: 24px; margin-bottom: 20px; }
    .q-text { color: #e5e7eb; font-size: 16px; font-weight: 600; margin: 0 0 16px; }
    .q-options { display: flex; flex-direction: column; gap: 10px; }
    .opt-btn {
      display: flex; align-items: center; gap: 14px;
      background: rgba(255,255,255,0.04); border: 1.5px solid #374151;
      color: #9ca3af; padding: 13px 18px; border-radius: 12px;
      cursor: pointer; font-size: 14px; text-align: left; transition: all .2s;
    }
    .opt-btn:hover { border-color: #4f46e5; color: white; background: rgba(99,102,241,0.1); }
    .opt-btn.selected { border-color: #4f46e5; color: #a5b4fc; background: rgba(99,102,241,0.15); }
    .opt-btn.correct { border-color: #10b981; color: #34d399; background: rgba(16,185,129,0.1); }
    .opt-btn.wrong { border-color: #ef4444; color: #f87171; background: rgba(239,68,68,0.1); }
    .opt-letter {
      background: #1f2937; width: 28px; height: 28px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 12px; flex-shrink: 0;
    }

    .btn-submit-quiz {
      background: #4f46e5; color: white; border: none; cursor: pointer;
      padding: 14px 36px; border-radius: 12px; font-size: 16px; font-weight: 700;
      margin-top: 24px; width: 100%; transition: all .2s;
    }
    .btn-submit-quiz:hover { background: #4338ca; }

    .quiz-result { text-align: center; padding: 40px 0; }
    .result-circle {
      width: 150px; height: 150px; border-radius: 50%; margin: 0 auto 24px;
      background: rgba(239,68,68,0.1); border: 4px solid #ef4444;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    .result-circle.passed { background: rgba(16,185,129,0.1); border-color: #10b981; }
    .score { color: white; font-size: 32px; font-weight: 800; }
    .label { color: #9ca3af; font-size: 13px; }
    .quiz-result p { color: #9ca3af; font-size: 16px; margin: 0 0 24px; }
    .btn-retry {
      background: rgba(255,255,255,0.06); border: 1px solid #374151;
      color: #d1d5db; padding: 12px 32px; border-radius: 12px; cursor: pointer;
      font-size: 14px; font-weight: 600;
    }

    .btn-complete {
      background: #059669; color: white; border: none; padding: 10px 20px;
      border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s;
      display: flex; align-items: center; gap: 8px;
    }
    .btn-complete:hover { background: #10b981; transform: translateY(-2px); }
    .btn-complete:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .already-done { color: #10b981; font-weight: 700; display: flex; align-items: center; gap: 8px; }
    
    .lesson-row.completed { border-left: 3px solid #10b981; }
    .completed-icon { color: #10b981; }
    
    .btn-primary-glow {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: white; border: none; padding: 12px 32px; border-radius: 12px;
      font-weight: 700; cursor: pointer; margin-left: 12px;
      box-shadow: 0 0 15px rgba(124, 58, 237, 0.4);
    }
    .result-actions { display: flex; justify-content: center; align-items: center; }
  `]
})
export class CourseViewComponent implements OnInit {
  course: any = null;
  activeUnit = 0;
  activeLesson: any = null;
  loadError = '';
  userRole = 'student';
  completing = false;
  completedLessons: string[] = [];
  currentSectionId: string = '';

  // Quiz state
  quizStarted = false;
  quizSubmitted = false;
  userAnswers: number[] = [];
  quizScore = 0;
  correctCount = 0;

  constructor(
    private route: ActivatedRoute,
    private instructorService: InstructorService,
    private dataService: DataService,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCourse(id);
    }
  }

  checkUserRole() {
    this.apiService.getMe().subscribe({
      next: (user) => {
        this.userRole = user.role;
        const id = this.route.snapshot.paramMap.get('id');
        if (id) this.loadUserProgress(id);
      },
      error: () => this.userRole = 'student'
    });
  }

  loadCourse(id: string) {
    this.instructorService.getCourseById(id).subscribe({
      next: (res) => {
        this.course = res.course || res;
      },
      error: (err) => {
        this.loadError = err.error?.message || `HTTP ${err.status}`;
      }
    });
  }

  loadUserProgress(courseId: string) {
    if (this.userRole !== 'student') return;
    this.dataService.getDashboardStats().subscribe({
      next: (res: any) => {
        const stats = res.data || res;
        const currentCourse = stats.activeCourses?.find((c: any) => c.courseId === courseId);
        if (currentCourse && currentCourse.completedLessons) {
          this.completedLessons = currentCourse.completedLessons;
        }
      }
    });
  }

  getSections(): any[] { return this.course?.sections || []; }

  getLessons(unit: any): any[] {
    const fromLessons: any[] = Array.isArray(unit?.lessons) ? unit.lessons : [];
    const fromContents: any[] = Array.isArray(unit?.contents) ? unit.contents : [];
    let items: any[] = fromLessons.length > 0 ? fromLessons : fromContents;
    items = items.filter((l: any) => l && (l.url || l.fileUrl || l._id));

    if (unit.exam && typeof unit.exam === 'object') {
      items = [...items, {
        _isQuiz: true,
        _id: unit.exam._id,
        title: unit.exam.title?.en || unit.exam.examTitle?.en || 'Unit Quiz',
        duration: unit.exam.duration,
        minScore: unit.exam.minScore || unit.exam.passingScore,
        questions: unit.exam.questions || []
      }];
    }
    return items;
  }

  getTotalLessons(): number {
    return this.getSections().reduce((t: number, u: any) => {
      const lessons = this.getLessons(u);
      return t + lessons.filter((l: any) => !l._isQuiz).length;
    }, 0);
  }

  toggleUnit(i: number) {
    this.activeUnit = this.activeUnit === i ? -1 : i;
  }

  isLessonCompleted(lessonId: string): boolean {
    return this.completedLessons.includes(lessonId);
  }

  selectItem(item: any, sectionId: string) {
    this.activeLesson = item;
    this.currentSectionId = sectionId;
    this.quizStarted = false;
    this.quizSubmitted = false;
    this.userAnswers = [];
  }

  selectFinalExam() {
    if (!this.course?.finalExam) return;
    const finalExam = this.course.finalExam;
    
    this.activeLesson = {
      _isQuiz: true,
      _isFinal: true,
      _id: finalExam._id,
      title: finalExam.title?.en || finalExam.title?.ar || 'Final Exam',
      duration: finalExam.duration,
      minScore: finalExam.minScore,
      questions: finalExam.questions || []
    };
    
    this.quizStarted = false;
    this.quizSubmitted = false;
    this.userAnswers = [];
  }

  markAsCompleted() {
    if (!this.activeLesson?._id || this.completing || !this.course?._id) return;
    this.completing = true;
    
    this.dataService.completeLesson(this.course._id, this.currentSectionId, this.activeLesson._id).subscribe({
      next: (res) => {
        if (!this.completedLessons.includes(this.activeLesson._id)) {
          this.completedLessons.push(this.activeLesson._id);
        }
        this.completing = false;
      },
      error: (err) => {
        console.error('Failed to complete lesson', err);
        this.completing = false;
      }
    });
  }

  startQuiz() {
    this.quizStarted = true;
    this.userAnswers = new Array(this.activeLesson.questions?.length || 0).fill(-1);
  }

  selectAnswer(qi: number, oi: number) {
    this.userAnswers[qi] = oi;
  }

  getQuestionOptions(q: any): string[] {
    console.log('🔍 Debug: getQuestionOptions for q:', q);
    if (!q) return [];
    
    // 1. لو موجود options ككائن (ar/en)
    if (q.options && typeof q.options === 'object' && !Array.isArray(q.options)) {
      if (Array.isArray(q.options.ar) && q.options.ar.length > 0) {
        console.log('✅ Found options.ar');
        return q.options.ar;
      }
      if (Array.isArray(q.options.en) && q.options.en.length > 0) {
        console.log('✅ Found options.en');
        return q.options.en;
      }
    }

    // 2. لو موجود choices ككائن (ar/en)
    if (q.choices && typeof q.choices === 'object' && !Array.isArray(q.choices)) {
      if (Array.isArray(q.choices.ar) && q.choices.ar.length > 0) return q.choices.ar;
      if (Array.isArray(q.choices.en) && q.choices.en.length > 0) return q.choices.en;
    }

    // 3. لو options مصفوفة مباشرة
    if (Array.isArray(q.options) && q.options.length > 0) return q.options;

    // 4. لو choices مصفوفة مباشرة
    if (Array.isArray(q.choices) && q.choices.length > 0) return q.choices;

    console.warn('⚠️ No options found for question:', q);
    return [];
  }

  submitQuiz() {
    if (this.completing || !this.activeLesson?._id || !this.course?._id) return;
    this.completing = true;

    this.dataService.submitExam(this.course._id, this.activeLesson._id, this.userAnswers).subscribe({
      next: (res) => {
        this.quizScore = res.score;
        this.correctCount = Math.round((res.score / 100) * this.activeLesson.questions.length);
        this.quizSubmitted = true;
        this.completing = false;
      },
      error: (err) => {
        console.error('Quiz submission failed', err);
        this.completing = false;
        alert('Failed to submit quiz: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

  retryQuiz() {
    this.quizSubmitted = false;
    this.quizStarted = false;
    this.userAnswers = [];
  }

  getSafeUrl(url: string): SafeResourceUrl {
    if (!url) return this.sanitizer.bypassSecurityTrustResourceUrl('');
    let embed = url.trim();
    if (embed.includes('youtube.com/watch')) {
      try { const v = new URL(embed).searchParams.get('v'); if (v) embed = `https://www.youtube.com/embed/${v}`; } catch (_) {}
    } else if (embed.includes('youtu.be/')) {
      const v = embed.split('youtu.be/')[1]?.split('?')[0];
      if (v) embed = `https://www.youtube.com/embed/${v}`;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(embed);
  }
}
