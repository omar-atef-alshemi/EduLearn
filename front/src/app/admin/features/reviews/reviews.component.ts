import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';
import { Review } from '../../core/models';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ReviewsComponent implements OnInit {
  reviews: Review[] = [];
  loading = false;

  constructor(private admin: AdminService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    // Reviews come from the toggle endpoint; load all via a mock for now
    // In production, you'd have a GET /admin/reviews endpoint
    this.loading = false;
    this.reviews = [];
  }

  toggle(r: Review): void {
    this.admin.toggleReview(r._id).subscribe({
      next: res => {
        const idx = this.reviews.findIndex(x => x._id === r._id);
        if (idx !== -1) this.reviews[idx] = res.data;
      }
    });
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
