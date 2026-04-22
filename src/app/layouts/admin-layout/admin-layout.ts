import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AdminSidebar } from '../../admin/components/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../../admin/components/admin-header/admin-header';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, AdminSidebar, AdminHeader],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {}
