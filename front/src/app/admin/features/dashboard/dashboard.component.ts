import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { DashboardStats } from '../../core/models';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
  route: string;
}

interface AlertCard {
  label: string;
  count: number;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink],
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = false;
  error = '';

  statCards: StatCard[] = [];
  alertCards: AlertCard[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.adminService.getDashboard().subscribe({
      next: res => {
        this.stats = res.data;
        this.buildCards();
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.message || 'Failed to load dashboard';
        this.loading = false;
      }
    });
  }

  private buildCards(): void {
    if (!this.stats) return;
    const s = this.stats;

    this.statCards = [
      { label: 'Total Students',    value: s.totalStudents,    icon: 'school',      color: '#3B82F6', route: 'students'    },
      { label: 'Total Teachers',    value: s.totalTeachers,    icon: 'group',       color: '#10b981', route: 'teachers'    },
      { label: 'Total Courses',     value: s.totalCourses,     icon: 'menu_book',   color: '#8b5cf6', route: 'courses'     },
      { label: 'Total Enrollments', value: s.totalEnrollments, icon: 'assignment',  color: '#f59e0b', route: 'enrollments' },
    ];

    this.alertCards = [
      { label: 'Pending Courses',  count: s.pendingCourses,  icon: 'menu_book',   route: 'courses' },
      { label: 'Pending Sections', count: s.pendingSections, icon: 'folder_open', route: 'courses' },
      { label: 'Pending Exams',    count: s.pendingExams,    icon: 'quiz',        route: 'exams'   },
      { label: 'Pending Content',  count: s.pendingContent,  icon: 'movie',       route: 'courses' },
    ];
  }
}
