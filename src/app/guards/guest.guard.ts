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
export class GuestGuard implements CanActivate {

  constructor(
    private session: SessionService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {

    return this.session.initialized$.pipe(

      filter(initialized => initialized),

      take(1),

      map(() => {

        const user = this.session.getUser();

        if (user) {

          this.router.navigateByUrl('/main/home', {
            replaceUrl: true
          });

          return false;

        }

        return true;

      })

    );

  }

}