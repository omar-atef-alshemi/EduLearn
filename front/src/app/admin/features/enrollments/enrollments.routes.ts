import { Routes } from '@angular/router';

export const ENROLLMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./enrollments.component').then(m => m.EnrollmentsComponent),
  },
];
