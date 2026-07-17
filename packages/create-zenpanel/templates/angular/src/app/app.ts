import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {
  // Injected eagerly so the persisted/system theme is applied to <html>
  // on every route (including "/"), not just routes that happen to use it.
  private readonly theme = inject(ThemeService);
}
