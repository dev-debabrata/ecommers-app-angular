import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';

import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIcon, MatPaginatorModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  private userService = inject(UserService);

  users = signal<any[]>([]);
  sortDirection = signal<'asc' | 'desc'>('asc');

  pageSize = 10;
  pageIndex = 0;

  constructor() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((res) => {
      const data = (res || []).map((u: any) => ({
        ...u,
        createdAt: u.createdAt?.toDate ? u.createdAt.toDate() : u.createdAt,
      }));

      this.users.set(data);
    });
  }

  toggleSort() {
    const newDir = this.sortDirection() === 'asc' ? 'desc' : 'asc';
    this.sortDirection.set(newDir);
  }

  sortedUsers = computed(() => {
    const dir = this.sortDirection();

    return [...this.users()].sort((a: any, b: any) => {
      const aVal = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bVal = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      return dir === 'asc' ? aVal - bVal : bVal - aVal;
    });
  });

  get paginatedUsers() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;

    return this.sortedUsers().slice(start, end);
  }

  totalItems = computed(() => this.users().length);

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  deleteUser(id: string) {
    if (confirm('Delete this user?')) {
      this.userService.deleteUser(id).then(() => {
        this.loadUsers();
      });
    }
  }
}
