import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainToolbarComponent implements OnInit {
  get isDarkMode(): boolean {
    return localStorage.getItem('financius.theme') === 'dark';
  }

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    if (this.isDarkMode) {
      this.setDarkMode();
    }
  }

  toggleDarkMode() {
    if (this.isDarkMode) {
      this.renderer.removeClass(document.body, 'dark');
      localStorage.setItem('financius.theme', 'light');
    } else {
      this.setDarkMode();
    }
  }

  private setDarkMode() {
    this.renderer.addClass(document.body, 'dark');
    localStorage.setItem('financius.theme', 'dark');
  }
}
