import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = 'An unexpected error occurred.';
      

      if (error.status === 400 && error.error?.errors) {
         return throwError(() => ({ validationErrors: error.error.errors }));
     }
        

      if (error.error instanceof ErrorEvent) {
        errorMsg = `Client Error: ${error.error.message}`;
      } else if (error.status === 0) {
        errorMsg = 'Backend is unreachable.';
      } else if (typeof error.error === 'string') {
        errorMsg = error.error;
      } else if (error.error?.message) {
        errorMsg = error.error.message;
      } else {
        errorMsg = `Error ${error.status}: ${error.statusText}`;
      }

      snackBar.open(errorMsg, 'Close', {
        duration: 5000,
        panelClass: ['snackbar-error']
      });

      return throwError(() => new Error(errorMsg));
    })
  );
};
