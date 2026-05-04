import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-world-network',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './world-network.component.html',
  styleUrls: ['./world-network.component.css']
})
export class WorldNetworkComponent implements OnInit, AfterViewInit {
  @ViewChild('section') section!: ElementRef;
  isLightMode = false;
  isActive = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // الاشتراك في السيرفيس - كده الـ Error اختفى
    this.themeService.isDarkMode$.subscribe((isDark: boolean) => {
      this.isLightMode = !isDark;
    });
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) this.isActive = true;
      });
    }, { threshold: 0.1 });
    observer.observe(this.section.nativeElement);
  }
}