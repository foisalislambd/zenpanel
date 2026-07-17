import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { adminConfig } from '@/app/core/admin.config';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  template: `
    <main
      class="flex min-h-dvh flex-col items-center justify-center bg-gray-50 px-6 py-16 text-center dark:bg-gray-950"
    >
      <span
        class="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-xl font-bold text-white"
        >{{ brand.letter }}</span
      >
      <h1 class="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        {{ brand.name }}
      </h1>
      <p class="mt-3 max-w-md text-gray-600 dark:text-gray-400">
        Admin panel shell for Angular — same UI as Next.js.
      </p>
      <a
        routerLink="/admin/login"
        class="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-6 text-sm font-semibold text-white hover:bg-brand-600"
        >Admin sign in</a
      >
    </main>
  `,
})
export class HomePageComponent {
  readonly brand = adminConfig.brand;
}
