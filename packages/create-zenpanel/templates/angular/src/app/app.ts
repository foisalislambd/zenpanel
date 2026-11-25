import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/theme.service';
import { AdminToastHostComponent } from './admin/ui/admin-toast-host.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AdminToastHostComponent],
  template: `<router-outlet /><app-admin-toast-host />`,
})
export class App {
  // Injected eagerly so the persisted/system theme is applied to <html>
  // on every route (including "/"), not just routes that happen to use it.
  private readonly theme = inject(ThemeService);
}
