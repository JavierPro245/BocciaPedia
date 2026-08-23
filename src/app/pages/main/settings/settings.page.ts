import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

import { ThemeService } from 'src/app/services/theme.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage implements OnInit {

  darkMode = false;

  appVersion = environment.appVersion;

  constructor(private themeService: ThemeService) { }

  async ngOnInit() {

    this.darkMode = this.themeService.isDarkMode();

    if (Capacitor.isNativePlatform()) {

      const info = await App.getInfo();

      this.appVersion = info.version;

    }

  }

  toggleDarkMode(enabled: boolean) {

    this.darkMode = enabled;

    this.themeService.setDarkMode(enabled);

  }

}
