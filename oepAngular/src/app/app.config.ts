import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { appRouting } from './app.routes';
import { AuthInterceptor } from './guards/auth.interceptor';
import { errorInterceptor } from './guards/error.interceptor';
import { importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';


export const appConfig: ApplicationConfig = {
  providers: [
   // provideHttpClient(),
    appRouting,
    provideHttpClient(withInterceptors([AuthInterceptor,errorInterceptor])),
    importProvidersFrom(MatSnackBarModule)
  ]
};



