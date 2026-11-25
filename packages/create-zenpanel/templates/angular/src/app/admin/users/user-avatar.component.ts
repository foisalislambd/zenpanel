import { Component, computed, input } from '@angular/core';
import { initials } from '@/app/lib/admin-resources';

@Component({
  selector: 'app-user-avatar',
  template: `<span
    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
    aria-hidden="true"
    >{{ text() }}</span
  >`,
})
export class UserAvatarComponent {
  readonly name = input.required<string>();
  readonly text = computed(() => initials(this.name()));
}
