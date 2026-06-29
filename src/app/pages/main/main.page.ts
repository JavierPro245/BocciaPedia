import { Component, inject, OnInit } from '@angular/core';
import { Menu } from 'src/app/models/menu.model';
import { MenuService } from 'src/app/services/menu';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: false
})
export class MainPage implements OnInit {

  readonly menuService = inject(MenuService);

  pages: Menu[] = [];

  ngOnInit(): void {
    this.pages = this.menuService.getMenu();
  }

}