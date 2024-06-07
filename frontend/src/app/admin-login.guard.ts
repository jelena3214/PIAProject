import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isEmptyObject = Object.keys(user).length === 0 && user.constructor === Object;

  if(isEmptyObject) return true

  // Ako je korisnik ulogovan i nije admin
  if (user && user.tip !== 'admin') {
    if(user.tip == 'gost') router.navigate(['guestStart']);
    else router.navigate(['']);
    return false;
  }

  // Ako korisnik nije ulogovan ili je admin, dozvoli pristup
  return true;
};
