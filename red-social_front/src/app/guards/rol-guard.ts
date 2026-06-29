// role.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const rolGuard = (route: any) => {
 const router = inject(Router);
  const userString = localStorage.getItem('usuario');
  
  if (!userString) {
    router.navigate(['/login']);
    return false;
  }

  const user = JSON.parse(userString);

  const expectedRole = route.data['expectedRole'];

  if (user.perfil === expectedRole) {
    return true; 
  } else {
    router.navigate(['/muro']); 
    return false;
  }
};