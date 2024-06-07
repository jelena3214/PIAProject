import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const isEmptyObject = Object.keys(user).length === 0 && user.constructor === Object;

  if(isEmptyObject) return true

  if (user && user.tip !== 'gost') {
    if(user.tip == 'admin') router.navigate(['adminStart']);
    else router.navigate(['']);
    return false;
  }

  return true;
};
