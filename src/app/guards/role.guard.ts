import { Injectable } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { PermissionService } from '../services/permission.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const roles =
      route.data['roles'] as string[];

    if (!roles || roles.length === 0) {

      return true;

    }

    const allowed =
      this.permissionService.hasAnyRole(
        roles as any
      );

    if (allowed) {

      return true;

    }

    this.router.navigateByUrl('/main/home');

    return false;

  }

}