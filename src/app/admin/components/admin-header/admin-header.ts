import { Component, inject, OnInit } from '@angular/core';

import { AdminAuthService } from '../../../services/auth.admin.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css',
})
export class AdminHeader implements OnInit {
  private adminAuthService = inject(AdminAuthService);

  adminName = 'Admin';

  ngOnInit() {
    this.adminAuthService.firebaseUser$.subscribe((user) => {
      // if (user?.displayName) {
      //   this.adminName = user.displayName;
      // }
      if (user) {
        this.adminName = user.displayName || user.email || 'Admin';
      }
    });
  }

  logout() {
    this.adminAuthService.logout();
  }
}

////////////////////////////////////////////
// ngOnInit() {
//   this.adminAuthService.firebaseUser$.subscribe(async (user) => {
//     if (user) {
//       const adminRef = doc(this.firestore, 'users/' + user.uid);
//       const snap = await getDoc(adminRef);

//       if (snap.exists()) {
//         const data = snap.data();
//         this.adminName = `${data['firstName']} ${data['lastName']}`;
//       }
//     }
//   });
// }
