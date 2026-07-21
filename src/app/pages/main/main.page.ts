import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Menu } from 'src/app/models/menu.model';
import { MenuService } from 'src/app/services/menu';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: false
})
export class MainPage implements OnInit {

  readonly menuService = inject(MenuService);

  pages: Menu[] = [];

  constructor(
    private session: SessionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.pages = this.menuService.getMenu();

    this.session.currentUser$.subscribe(user => {

      console.log('SESSION');

      console.log(user);

    });

  }

  async menuClick(item: Menu) {

    if (item.title === 'Cerrar sesión') {

      await this.authService.logout();

      this.router.navigateByUrl('/auth', {
        replaceUrl: true
      });

    } else {

      if (item.url) {
  this.router.navigateByUrl(item.url);
}

    }

  }

}