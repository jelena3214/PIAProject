import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const notloggedinGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const isEmptyObject = Object.keys(user).length === 0 && user.constructor === Object;

  if(isEmptyObject) return true

  if (user) {
    if(user.tip == 'admin') router.navigate(['adminStart']);
    else if(user.tip == 'gost') router.navigate(['guestStart'])
    else if(user.tip == 'konobar') router.navigate(['waiterStart'])
    else router.navigate(['']);
    return false;
  }

  return true;
};
