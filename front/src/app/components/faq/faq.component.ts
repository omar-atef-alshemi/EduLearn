import { Component, inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service'; // تأكد من المسار

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements AfterViewInit {
  private themeService = inject(ThemeService);
  isDarkMode$ = this.themeService.isDarkMode$;

  @ViewChild('faqGrid') faqGrid!: ElementRef;
  activeIndex: number | null = null;

  faqs = [
    {
      question: "What types of courses are offered at the academy?",
      answer: "The academy provides comprehensive learning through high-quality pre-recorded courses, allowing you to study at your own pace."
    },
    {
      question: "How long can I access my course materials?",
      answer: "Once you subscribe to any of our courses, you get permanent lifetime access to all materials via your student dashboard."
    },
    {
      question: "How can I enroll and pay for a course?",
      answer: "You can pay securely online using various available methods such as Visa, Mastercard, or PayPal."
    },
    {
      question: "Do you provide accredited certificates for the courses?",
      answer: "We provide a digital Certificate of Completion reflecting the total credit hours you have finished on the academy platform."
    },
    {
      question: "Why are the course prices displayed in US Dollars?",
      answer: "The US Dollar is used as a unified global currency. You can pay the equivalent amount in your local currency during checkout."
    },
    {
      question: "Can I request help if I don't understand something?",
      answer: "Certainly! You can post your questions in the dedicated study group for your course, and our team will respond as quickly as possible."
    },
    {
      question: "How do I access the course after completing payment?",
      answer: "The course is automatically added to your account. You can access it via the 'My Courses' button or your profile dashboard."
    },
    {
      question: "How much time do I need to complete a course?",
      answer: "This varies per student, but most courses require a minimum of one month of focused study to master all lessons."
    }
  ];

  toggleFaq(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.faqGrid.nativeElement.classList.add('show');
        } else {
          // لإعادة الأنيميشن كل ما المستخدم يرجع للسكشن
          this.faqGrid.nativeElement.classList.remove('show');
        }
      });
    }, { threshold: 0.1 });

    observer.observe(this.faqGrid.nativeElement);
  }
}