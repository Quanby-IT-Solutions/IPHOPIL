import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const userRole = localStorage.getItem('userRole');
      const requiredRole = route.data['role'];

      if (!userRole) {
        this.router.navigate(['/login']);
        return false;
      }


      if (requiredRole && userRole === requiredRole) {
        return true;
      }

      this.router.navigate(['/unauthorized']);
      return false;
    }

    return false;
  }
}
