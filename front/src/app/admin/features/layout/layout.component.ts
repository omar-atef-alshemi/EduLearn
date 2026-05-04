import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
})
export class LayoutComponent {
  sidebarCollapsed = false;

  navItems: NavItem[] = [
    { label: 'Dashboard',   icon: 'dashboard',   route: 'dashboard'   },
    { label: 'Teachers',    icon: 'group',       route: 'teachers'    },
    { label: 'Students',    icon: 'school',      route: 'students'    },
    { label: 'Courses',     icon: 'menu_book',   route: 'courses'     },
    { label: 'Exams',       icon: 'quiz',        route: 'exams'       },
    { label: 'Enrollments', icon: 'assignment',  route: 'enrollments' },
    { label: 'Reviews',     icon: 'star',        route: 'reviews'     },
    { label: 'Progress',    icon: 'trending_up', route: 'progress'    },
  ];

  constructor(public auth: AuthService, private router: Router) {}

  get initials(): string {
    const u = this.auth.currentUser;
    if (!u) return 'A';
    return `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`.toUpperCase();
  }

  logout(): void { this.auth.logout(); }
}
