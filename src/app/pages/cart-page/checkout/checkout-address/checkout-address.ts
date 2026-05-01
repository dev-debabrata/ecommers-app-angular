import { Component, inject, input, output, signal, effect, computed } from '@angular/core';
import { AddressUser, User } from '../../../../models/user';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user-service';
import { SnackbarService } from '../../../../services/snackbar-service';
import { FormsModule } from '@angular/forms';

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

  private lastUserId: string | null = null;

  user = input<User | null>();
  addressSelected = output<AddressUser>();
  showAll = signal(false);
  userData = signal<User | null>(null);

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

      this.userService.getUserById(u.uid).subscribe((user) => {
        this.userData.set(user);
      });
    });

    effect(() => {
      const user = this.userData();

      if (user?.addresses?.length && !this.selectedAddress()) {
        this.selectAddress(user.addresses[0]);
      }
    });
  }

  // constructor() {
  //   effect(() => {
  //     const u = this.user();
  //     if (!u?.uid) return;

  //     if (this.lastUserId !== u.uid) {
  //       this.selectedAddress.set(null);
  //       this.userData.set(null);
  //       this.lastUserId = u.uid;
  //     }
  //   });

  //   effect(() => {
  //     const u = this.user();
  //     if (!u?.uid) return;

  //     this.userService.getUserById(u.uid).subscribe((user) => {
  //       if (!user) return;

  //       const normalized = (user.addresses || []).map((addr: AddressUser, index: number) => ({
  //         ...addr,
  //         id: (addr as any).id ?? `${addr.pinCode}-${index}`,
  //         createdAt: (addr as any).createdAt ?? Date.now() - index,
  //       }));

  //       const sorted = normalized.sort((a: any, b: any) => b.createdAt - a.createdAt);

  //       this.userData.set({
  //         ...user,
  //         addresses: sorted,
  //       });
  //     });
  //   });

  //   effect(() => {
  //     const user = this.userData();
  //     const selected = this.selectedAddress();

  //     if (!user?.addresses?.length) return;

  //     const exists = user.addresses.some((a: any) => a.id === selected?.id);

  //     if (!selected || !exists) {
  //       this.selectAddress(user.addresses[0]);
  //     }
  //   });
  // }

  selectAddress(addr: AddressUser) {
    this.selectedAddress.set(addr);
    this.addressSelected.emit(addr);
  }

  visibleAddresses = computed(() => {
    const addresses = this.userData()?.addresses || [];
    const selected = this.selectedAddress();

    if (this.showAll()) return addresses;

    const firstTwo = addresses.slice(0, 2);

    if (selected && !firstTwo.some((a) => a.id === selected.id)) {
      return [selected, ...firstTwo.slice(0, 1)];
    }

    return firstTwo;
  });

  // visibleAddresses = () => {
  //   const list = this.userData()?.addresses || [];
  //   return this.showAll() ? list : list.slice(0, 2);
  // };

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

    const addr: any = {
      ...base,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    const addresses = [addr, ...(u.addresses || [])].sort(
      (a: any, b: any) => b.createdAt - a.createdAt,
    );

    this.userService.updateUserAddress(u.uid, { addresses }).subscribe({
      next: () => {
        this.userData.set({
          ...u,
          addresses,
        });

        this.selectAddress(addr);

        this.snackbar.success('Address added');
        this.showAddressPopup.set(false);
      },
      error: () => this.snackbar.error('Failed to save address'),
    });
  }
}
