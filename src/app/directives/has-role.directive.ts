import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

import { UserRole } from '../models/user.model';
import { PermissionService } from '../services/permission.service';

@Directive({
  selector: '[appHasRole]',
  standalone: false
})
export class HasRoleDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  @Input()
  set appHasRole(roles: UserRole[]) {

    this.viewContainer.clear();

    if (this.permissionService.hasAnyRole(roles)) {

      this.viewContainer.createEmbeddedView(
        this.templateRef
      );

    }

  }

}