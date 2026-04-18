import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage {
  private authService = inject(AuthService);

  user = this.authService.getUser();
}
