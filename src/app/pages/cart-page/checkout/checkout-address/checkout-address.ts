import {
  Component,
  inject,
  input,
  output,
  signal,
  effect,
  computed,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { AddressUser, User } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import { SnackbarService } from '../../../../services/snackbar.service';

@Component({
  selector: 'app-checkout-address',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule],
  templateUrl: './checkout-address.html',
  styleUrl: './checkout-address.css',
})
export class CheckoutAddress {
  private userService = inject(UserService);
  private snackbar = inject(SnackbarService);
  private destroyRef = inject(DestroyRef);

  user = input<User | null>();
  addressSelected = output<AddressUser>();
  showAll = signal(false);
  userData = signal<User | null>(null);
  editingIndex = signal<number | null>(null);
  showAddressPopup = signal(false);
  selectedAddress = signal<AddressUser | null>(null);

  newAddress = signal<AddressUser>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pinCode: '',
  });

  constructor() {
    effect(() => {
      const u = this.user();
      if (!u?.uid) return;

      const userSub = this.userService.getUserById(u.uid).subscribe((user) => {
        this.userData.set(user);
      });
      this.destroyRef.onDestroy(() => {
        userSub.unsubscribe();
      });
    });
  }

  ngAfterViewInit() {}

  editAddress(addr: AddressUser) {
    this.newAddress.set({ ...addr });

    const user = this.userData();
    const realIndex =
      user?.addresses?.findIndex((a) =>
        a.id ? a.id === addr.id : a.address === addr.address && a.pinCode === addr.pinCode,
      ) ?? -1;

    this.editingIndex.set(realIndex !== -1 ? realIndex : null);
    this.showAddressPopup.set(true);
  }

  selectAddress(addr: AddressUser) {
    this.selectedAddress.set(addr);
    this.addressSelected.emit(addr);
  }

  visibleAddresses = computed(() => {
    const addresses = this.userData()?.addresses || [];

    if (this.showAll()) return addresses;

    return addresses.slice(0, 2);
  });

  toggleShowAll() {
    this.showAll.update((v) => !v);
  }

  openPopup() {
    const u = this.userData();

    this.newAddress.set({
      fullName: `${u?.firstName || ''} ${u?.lastName || ''}`.trim(),
      email: u?.email || '',
      phone: u?.phoneNumber?.[0] || '',
      address: '',
      landmark: '',
      city: '',
      state: '',
      pinCode: '',
    });
    this.editingIndex.set(null);
    this.showAddressPopup.set(true);
  }

  updateField(field: keyof AddressUser, value: string) {
    this.newAddress.update((a) => ({ ...a, [field]: value }));
  }

  saveAddress() {
    const u = this.userData();
    if (!u?.uid) return;

    const base = this.newAddress();

    if (
      !base.fullName ||
      !base.phone ||
      !base.address ||
      !base.city ||
      !base.state ||
      !base.pinCode
    ) {
      this.snackbar.error('Fill all required fields');
      return;
    }

    let addresses = [...(u.addresses || [])];

    if (this.editingIndex() !== null) {
      const index = this.editingIndex()!;

      addresses[index] = {
        ...addresses[index],
        ...base,
      };
    } else {
      const addr: any = {
        ...base,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };

      addresses = [addr, ...addresses];
    }

    addresses = addresses.sort((a: any, b: any) => b.createdAt - a.createdAt);

    this.userService.updateUserAddress(u.uid, { addresses }).subscribe({
      next: () => {
        this.userData.set({ ...u, addresses });

        const idx = this.editingIndex();

        if (idx !== null) {
          this.selectAddress(addresses[idx]);
        } else {
          this.selectAddress(addresses[0]);
        }

        this.snackbar.success(idx !== null ? 'Address updated' : 'Address added');

        this.editingIndex.set(null);
        this.showAddressPopup.set(false);
      },
      // next: () => {
      //   this.userData.set({
      //     ...u,
      //     addresses,
      //   });

      //   if (this.editingIndex() !== null) {
      //     this.selectAddress(addresses[this.editingIndex()!]);
      //   } else {
      //     this.selectAddress(addresses[0]);
      //   }

      //   this.snackbar.success(this.editingIndex() !== null ? 'Address updated' : 'Address added');

      //   this.editingIndex.set(null);
      //   this.showAddressPopup.set(false);
      // },
      error: () => this.snackbar.error('Failed to save address'),
    });
  }
}

////////////////////////////////////////////////////////////////////////////////////////

// import { Component, inject, input, output, signal, effect, computed } from '@angular/core';
// import { AddressUser, User } from '../../../../models/user';
// import { MatIconModule } from '@angular/material/icon';
// import { CommonModule } from '@angular/common';
// import { UserService } from '../../../../services/user-service';
// import { SnackbarService } from '../../../../services/snackbar-service';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-checkout-address',
//   standalone: true,
//   imports: [FormsModule, CommonModule, MatIconModule],
//   templateUrl: './checkout-address.html',
//   styleUrl: './checkout-address.css',
// })
// export class CheckoutAddress {
//   private userService = inject(UserService);
//   private snackbar = inject(SnackbarService);

//   private lastUserId: string | null = null;

//   user = input<User | null>();
//   addressSelected = output<AddressUser>();
//   showAll = signal(false);
//   userData = signal<User | null>(null);

//   editingIndex = signal<number | null>(null);
//   showAddressPopup = signal(false);
//   selectedAddress = signal<AddressUser | null>(null);

//   newAddress = signal<AddressUser>({
//     fullName: '',
//     email: '',
//     phone: '',
//     address: '',
//     landmark: '',
//     city: '',
//     state: '',
//     pinCode: '',
//   });

//   constructor() {
//     effect(() => {
//       const u = this.user();
//       if (!u?.uid) return;

//       this.userService.getUserById(u.uid).subscribe((user) => {
//         this.userData.set(user);
//       });
//     });

//     effect(() => {
//       const user = this.userData();

//       if (user?.addresses?.length && !this.selectedAddress()) {
//         this.selectAddress(user.addresses[0]);
//       }
//     });
//   }

//   editAddress(index: number) {
//     const user = this.userData();
//     if (!user?.addresses) return;

//     const addr = user.addresses[index];

//     this.newAddress.set({ ...addr });
//     this.editingIndex.set(index);
//     this.showAddressPopup.set(true);
//   }

//   selectAddress(addr: AddressUser) {
//     this.selectedAddress.set(addr);
//     this.addressSelected.emit(addr);
//   }

//   visibleAddresses = computed(() => {
//     const addresses = this.userData()?.addresses || [];
//     const selected = this.selectedAddress();

//     if (this.showAll()) return addresses;

//     const firstTwo = addresses.slice(0, 2);

//     if (selected && !firstTwo.some((a) => a.id === selected.id)) {
//       return [selected, ...firstTwo.slice(0, 1)];
//     }

//     return firstTwo;
//   });

//   // visibleAddresses = () => {
//   //   const list = this.userData()?.addresses || [];
//   //   return this.showAll() ? list : list.slice(0, 2);
//   // };

//   openPopup() {
//     const u = this.userData();

//     this.newAddress.set({
//       fullName: `${u?.firstName || ''} ${u?.lastName || ''}`.trim(),
//       email: u?.email || '',
//       phone: u?.phoneNumber?.[0] || '',
//       address: '',
//       landmark: '',
//       city: '',
//       state: '',
//       pinCode: '',
//     });
//     this.editingIndex.set(null);
//     this.showAddressPopup.set(true);
//   }

//   updateField(field: keyof AddressUser, value: string) {
//     this.newAddress.update((a) => ({ ...a, [field]: value }));
//   }

//   saveAddress() {
//     const u = this.userData();
//     if (!u?.uid) return;

//     const base = this.newAddress();

//     if (
//       !base.fullName ||
//       !base.phone ||
//       !base.address ||
//       !base.city ||
//       !base.state ||
//       !base.pinCode
//     ) {
//       this.snackbar.error('Fill all required fields');
//       return;
//     }

//     let addresses = [...(u.addresses || [])];

//     if (this.editingIndex() !== null) {
//       const index = this.editingIndex()!;

//       addresses[index] = {
//         ...addresses[index],
//         ...base,
//       };
//     } else {
//       const addr: any = {
//         ...base,
//         id: crypto.randomUUID(),
//         createdAt: Date.now(),
//       };

//       addresses = [addr, ...addresses];
//     }

//     addresses = addresses.sort((a: any, b: any) => b.createdAt - a.createdAt);

//     this.userService.updateUserAddress(u.uid, { addresses }).subscribe({
//       next: () => {
//         this.userData.set({
//           ...u,
//           addresses,
//         });

//         if (this.editingIndex() !== null) {
//           this.selectAddress(addresses[this.editingIndex()!]);
//         } else {
//           this.selectAddress(addresses[0]);
//         }

//         this.snackbar.success(this.editingIndex() !== null ? 'Address updated' : 'Address added');

//         this.editingIndex.set(null);
//         this.showAddressPopup.set(false);
//       },
//       error: () => this.snackbar.error('Failed to save address'),
//     });
//   }

//   // saveAddress() {
//   //   const u = this.userData();
//   //   if (!u?.uid) return;

//   //   const base = this.newAddress();

//   //   if (
//   //     !base.fullName ||
//   //     !base.phone ||
//   //     !base.address ||
//   //     !base.city ||
//   //     !base.state ||
//   //     !base.pinCode
//   //   ) {
//   //     this.snackbar.error('Fill all required fields');
//   //     return;
//   //   }

//   //   const addr: any = {
//   //     ...base,
//   //     id: crypto.randomUUID(),
//   //     createdAt: Date.now(),
//   //   };

//   //   const addresses = [addr, ...(u.addresses || [])].sort(
//   //     (a: any, b: any) => b.createdAt - a.createdAt,
//   //   );

//   //   this.userService.updateUserAddress(u.uid, { addresses }).subscribe({
//   //     next: () => {
//   //       this.userData.set({
//   //         ...u,
//   //         addresses,
//   //       });

//   //       this.selectAddress(addr);

//   //       this.snackbar.success('Address added');
//   //       this.showAddressPopup.set(false);
//   //     },
//   //     error: () => this.snackbar.error('Failed to save address'),
//   //   });
//   // }
// }
