import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data['role'];
  const actualRole = auth.decodeRoleFromToken();

  if (auth.getToken() && actualRole === expectedRole) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};