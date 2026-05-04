import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';
import { Progress } from '../../core/models';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ProgressComponent implements OnInit {
  progress: Progress[] = [];
  loading = false;

  constructor(private admin: AdminService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.admin.getAllProgress().subscribe({
      next: res => { this.progress = res.data || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  formatTime(minutes: number): string {
    if (!minutes) return '0 min';
    if (minutes < 60) return `${minutes} min`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  }
}
