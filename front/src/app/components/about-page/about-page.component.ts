// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ThemeService } from '../../services/theme.service';

// @Component({
//   selector: 'app-about-page',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './about-page.component.html',
//   styleUrls: ['./about-page.component.css']
// })
// export class AboutPageComponent implements OnInit {
//   isDarkMode: boolean = false;

//   constructor(private themeService: ThemeService) {}

//   ngOnInit(): void {
//     // استخدمنا isDarkMode$ بدل darkMode$ زي ما السيرفيس بتاعتك متسمية
//     // وحددنا نوع الـ mode إنه boolean عشان الـ error التاني
//     this.themeService.isDarkMode$.subscribe((mode: boolean) => {
//       this.isDarkMode = mode;
//     });
//   }
// }