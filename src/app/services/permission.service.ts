import { Injectable } from '@angular/core';

import { SessionService } from './session.service';

import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(
    private sessionService: SessionService
  ) {}

  hasRole(role: UserRole): boolean {

    const user = this.sessionService.getUser();

    if (!user) {
      return false;
    }

    return user.roles.includes(role);

  }

  hasAnyRole(roles: UserRole[]): boolean {

    const user = this.sessionService.getUser();

    if (!user) {
      return false;
    }

    return roles.some(role => user.roles.includes(role));

  }

}