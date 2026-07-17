import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { previewFetchUsers, type PortalUserRow } from '@/app/lib/admin-api';

@Component({
  selector: 'app-users-page',
  imports: [DatePipe],
  template: `
    <div class="space-y-4">
      <h1 class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Users</h1>
      <div class="admin-card overflow-hidden">
        <div class="border-b border-gray-100 px-4 py-3 text-sm font-semibold dark:border-gray-800">
          Recent users
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="text-xs text-gray-500">
              <tr>
                <th class="px-4 py-2">Name</th>
                <th class="px-4 py-2">Email</th>
                <th class="px-4 py-2">Provider</th>
                <th class="px-4 py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users(); track user.id) {
                <tr class="border-t border-gray-100 dark:border-gray-800">
                  <td class="px-4 py-2 font-medium">{{ user.name }}</td>
                  <td class="px-4 py-2">{{ user.email }}</td>
                  <td class="px-4 py-2 capitalize">{{ user.authProvider }}</td>
                  <td class="px-4 py-2">{{ user.createdAt | date: 'shortDate' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class UsersPageComponent implements OnInit {
  readonly users = signal<PortalUserRow[]>([]);

  ngOnInit(): void {
    void previewFetchUsers().then((res) => this.users.set(res.users));
  }
}
