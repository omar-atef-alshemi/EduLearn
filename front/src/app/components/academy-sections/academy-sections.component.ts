import { Component, inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 1. لازم تستورد ده
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-academy-sections',
  standalone: true,
  imports: [CommonModule, RouterModule], // 2. ولازم تضيفه هنا
  templateUrl: './academy-sections.component.html',
  styleUrls: ['./academy-sections.component.css']
})
export class AcademySectionsComponent implements AfterViewInit {
  private themeService = inject(ThemeService);
  isDarkMode$ = this.themeService.isDarkMode$;

  @ViewChild('sectionsGrid') sectionsGrid!: ElementRef;

  // 3. زودنا الـ id عشان الـ HTML يعرف إنت دايس على إيه
  academySubjects = [
    { id: 'fundamentals', title: 'Fundamentals', icon: 'fas fa-terminal', desc: 'Master the core logic and problem-solving.' },
    { id: 'frontend', title: 'Frontend Dev', icon: 'fas fa-laptop-code', desc: 'Build interactive user interfaces.' },
    { id: 'backend', title: 'Backend Dev', icon: 'fas fa-server', desc: 'Design robust APIs and databases.' },
    { id: 'mobile', title: 'Mobile Apps', icon: 'fas fa-mobile-alt', desc: 'Create iOS and Android applications.' },
    { id: 'networking', title: 'Networking', icon: 'fas fa-network-wired', desc: 'Master Cisco and security protocols.' },
    { id: 'data-science', title: 'Data Science', icon: 'fas fa-brain', desc: 'Harness the power of AI and data.' }
  ];

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.sectionsGrid.nativeElement.classList.add('show');
        } else {
          this.sectionsGrid.nativeElement.classList.remove('show');
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' 
    });

    observer.observe(this.sectionsGrid.nativeElement);
  }
}