import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router
} from '@angular/router';

import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private session: SessionService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {

    return this.session.initialized$.pipe(

      // Espera hasta que Firebase haya respondido
      filter(initialized => initialized),

      // Solo la primera respuesta
      take(1),

      // Decide si deja pasar
      map(() => {

        const user = this.session.getUser();

        if (user) {
          return true;
        }

        this.router.navigateByUrl('/auth', {
          replaceUrl: true
        });

        return false;

      })

    );

  }

}