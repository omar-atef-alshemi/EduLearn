import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // 1. خلي الحالة بتاعتك زي ما هي (Boolean) عشان الكومبوننتس بتاعتك ما تضربش
  private darkMode = new BehaviorSubject<boolean>(true);
  
  // 2. سيب الـ Observable القديم بتاعك بنفس الاسم
  isDarkMode$ = this.darkMode.asObservable();

  constructor() {
    // حاول ترجع آخر وضع كان عليه المستخدم
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      this.setTheme('light');
    } else {
      this.setTheme('dark');
    }
  }

  // 3. الدالة اللي الـ Layout بيدور عليها (الوجه الأول)
  getTheme(): string {
    return this.darkMode.value ? 'dark' : 'light';
  }

  // 4. الدالة اللي بتغير الثيم
  toggleTheme() {
    const nextValue = !this.darkMode.value;
    this.setTheme(nextValue ? 'dark' : 'light');
  }

  // 5. المحرك الأساسي اللي بيحدث كل حاجة في نفس الوقت
  setTheme(theme: 'dark' | 'light') {
    const isDark = (theme === 'dark');
    
    // حدث الـ Subject (عشان الكومبوننتس تحس بالتغيير)
    this.darkMode.next(isDark);
    localStorage.setItem('theme', theme);

    // طبق على الـ HTML element (للـ [data-theme='dark'] CSS selector)
    document.documentElement.setAttribute('data-theme', theme);

    if (isDark) {
      // Dark Mode
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    } else {
      // Light Mode
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
  }

  // 6. دالة مساعدة لو محتاجها في كودك القديم
  getCurrentTheme(): boolean {
    return this.darkMode.value;
  }
}