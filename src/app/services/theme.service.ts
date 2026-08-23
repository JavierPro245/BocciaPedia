import { Injectable } from '@angular/core';

const STORAGE_KEY = 'bocciapp-dark-mode';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  init(): void {

    const saved = localStorage.getItem(STORAGE_KEY);

    this.apply(saved === 'true');

  }

  isDarkMode(): boolean {

    return document.documentElement.classList.contains('ion-palette-dark');

  }

  setDarkMode(enabled: boolean): void {

    localStorage.setItem(STORAGE_KEY, String(enabled));

    this.apply(enabled);

  }

  private apply(enabled: boolean): void {

    document.documentElement.classList.toggle('ion-palette-dark', enabled);

  }

}
