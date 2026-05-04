import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  course: any;
  loading: boolean = true;
  isEnrolled: boolean = false;
  activeTab: string = 'overview';
loadingPayment: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

ngOnInit() {
  const courseId = this.route.snapshot.paramMap.get('id');

  if (courseId) {
    this.loadCourseData(courseId);
    this.checkEnrollment(courseId); // دي اللي هتعرفنا الـ Webhook خلص ولا لسه
  }

  this.route.queryParams.subscribe(params => {
    if (params['payment'] === 'success') {
      // بدل ما نبعت طلب يدوي، هنستنى ثانية ونشوف الـ Webhook عمل إيه
      setTimeout(() => {
        if (courseId) this.checkEnrollment(courseId);
      }, 1500); 
    }
  });
}

  loadCourseData(id: string) {
    this.loading = true;
    this.dataService.getCourseById(id).subscribe({
      next: (res: any) => {
        this.course = res.course || res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading course:', err);
        this.loading = false;
      }
    });
  }

  checkEnrollment(courseId: string) {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    this.dataService.getUserEnrollments().subscribe({
      next: (enrollments: any) => {
        const data = Array.isArray(enrollments) ? enrollments : (enrollments as any).data || [];
        this.isEnrolled = data.some((e: any) => 
          (e.courseId?._id === courseId || e.courseId === courseId || e._id === courseId)
        );
      }
    });
  }

 enrollNow() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    this.router.navigate(['/signin'], { queryParams: { returnUrl: this.router.url } });
    return;
  }

  // 🆓 كورس مجاني
  if (this.course.price === 0) {
    this.dataService.enrollInCourse(this.course._id).subscribe({
      next: () => {
        alert('Enrolled successfully 🎉');
        this.router.navigate(['/student/dashboard']);
      },
      error: (err) => {
        alert(err.error?.message || 'Enrollment failed');
      }
    });

  } else {
    // 💳 كورس مدفوع
    this.loadingPayment = true;

    this.dataService.createCheckoutSession(this.course._id).subscribe({
      next: (res: any) => {
        window.location.href = res.url; // 🔥 يوديه Stripe
      },
      error: (err: any) => {
        this.loadingPayment = false;
        alert(err.error?.message || 'Payment failed');
      }
    });
  }
}
// completeEnrollment(courseId: string) {
//   this.dataService.confirmEnrollment(courseId).subscribe({
//     next: (res) => {
//       console.log('Enrollment confirmed successfully!');
//       this.isEnrolled = true; // بتخلي الزرار يتحول لـ "Start Learning"
      
//       // حركة شيك: بننضف الـ URL عشان الـ alert ميظهرش تاني لو عمل ريفريش
//       this.router.navigate([], {
//         relativeTo: this.route,
//         queryParams: { payment: null },
//         queryParamsHandling: 'merge'
//       });

//       alert('Payment successful 🎉 Your course is now active!');
//     },
//     error: (err) => {
//       console.error('Manual enrollment failed:', err);
//       alert('Payment was successful, but we had trouble activating the course. Please contact support.');
//     }
//   });
// }
}