import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QrGeneratorComponent } from './qr-generator/qr-generator.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, QrGeneratorComponent, TranslateModule, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})

export class AppComponent {
  title = 'qr-generator';
  selectedLanguage = 'en';
  isDropdownOpen = false;

  appLanguages = [
    { code: 'EN', label: 'English' },
    { code: 'ES', label: 'Español' },
    { code: 'PT', label: 'Português' },
    { code: 'FR', label: 'Français' },
    { code: 'DE', label: 'Deutsch' },
    { code: 'IT', label: 'Italiano' },
    { code: 'ZH', label: '中文' },
    { code: 'AR', label: 'العربية' }
    //{ code: 'ja', label: '日本語' },
    //{ code: 'ru', label: 'Русский' }
  ];

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  changeLanguage(lang: string) {
    this.selectedLanguage = lang;
    this.translate.use(lang.toLocaleLowerCase());
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const clickedInside = target.closest('.custom-dropdown');
      
      if (!clickedInside) {
        this.isDropdownOpen = false;
      }
  }
}
