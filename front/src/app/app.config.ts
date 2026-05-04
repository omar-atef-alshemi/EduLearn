import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // ضفنا withInterceptors
import { authInterceptor } from './services/interceptor'; // تأكد من المسار الصح للـ ملف بتاعك
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]) // كدة الـ Interceptor بقى شغال على البرنامج كله
    )
  ]
};