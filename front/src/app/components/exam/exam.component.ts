import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {
  questions: any[] = [];
  currentQuestionIndex: number = 0;
  selectedAnswers: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit() {
    const examId = this.route.snapshot.paramMap.get('id');
    if (examId) {
      this.dataService.getFinalExam(examId).subscribe({
        next: (data: any) => {
          this.questions = data.questions || [];
          // تحضير مصفوفة الإجابات بقيم فارغة (-1)
          this.selectedAnswers = new Array(this.questions.length).fill(-1);
        },
        error: (err: any) => console.error('Error', err)
      });
    }
  }

  goToQuestion(index: number) {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;
    }
  }

  selectOption(optionIndex: number) {
    this.selectedAnswers[this.currentQuestionIndex] = optionIndex;
  }

  getAnsweredCount(): number {
    return this.selectedAnswers.filter(ans => ans !== -1).length;
  }
}