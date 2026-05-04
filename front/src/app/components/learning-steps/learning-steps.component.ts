import { Component, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-learning-steps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learning-steps.component.html',
  styleUrls: ['./learning-steps.component.css']
})
export class LearningStepsComponent implements AfterViewInit {
  private themeService = inject(ThemeService);
  isDarkMode$ = this.themeService.isDarkMode$;

  // نراقب السيكشن والخط فقط
  @ViewChild('sectionWrapper') sectionWrapper!: ElementRef;
  @ViewChild('scrollLine') scrollLine!: ElementRef;

  steps = [
    { title: 'Discovery', desc: 'Identify your goal and select a curated learning path.', icon: 'fas fa-search' },
    { title: 'Structured Learning', desc: 'Progress through sequentially unlocked modules.', icon: 'fas fa-book-open' },
    { title: 'Expert Feedback', desc: 'Get your work reviewed by industry professionals.', icon: 'fas fa-shield-alt' },
    { title: 'Certification', desc: 'Pass the final exam and earn a digital credential.', icon: 'fas fa-award' }
  ];

  ngAfterViewInit() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {

      const steps = entry.target.querySelectorAll('.step-item');

      if (entry.isIntersecting) {

        // شغل الانيميشن للكروت
        steps.forEach((el: any) => {
          el.classList.add('show-step');
        });

        // الخط بعدهم
        setTimeout(() => {
          if (this.scrollLine) {
            this.scrollLine.nativeElement.style.width = '100%';
          }
        }, steps.length * 250);

      } else {

        // reset
        steps.forEach((el: any) => {
          el.classList.remove('show-step');
        });

        if (this.scrollLine) {
          this.scrollLine.nativeElement.style.width = '0%';
        }
      }

    });
  }, { threshold: 0.2 });

  observer.observe(this.sectionWrapper.nativeElement);
}
}