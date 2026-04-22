import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AdminAuthService } from '../../../services/admin-auth-service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css',
})
export class AdminHeader {
  private adminAuthService = inject(AdminAuthService);

  logout() {
    this.adminAuthService.logout();
  }
}
