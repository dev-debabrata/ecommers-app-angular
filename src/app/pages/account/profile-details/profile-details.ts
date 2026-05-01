import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { User } from '../../../models/user';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-details.html',
  styleUrl: './profile-details.css',
})
export class ProfileDetails {
  user = input<User | null>();
}
