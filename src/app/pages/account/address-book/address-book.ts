import { Component, inject, input, signal } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../../services/snackbar-service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-address-book',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './address-book.html',
  styleUrl: './address-book.css',
})
export class AddressBook {
  private authService = inject(AuthService);
  private snackBar = inject(SnackbarService);

  user = input<any>();

  showAddressPopup = signal(false);
  editAddressIndex = signal<number | null>(null);

  newAddress = signal({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pinCode: '',
  });

  updateField(field: string, value: string) {
    this.newAddress.update((a) => ({
      ...a,
      [field]: value,
    }));
  }

  openAddressPopup() {
    const currentUser = this.user();

    this.newAddress.set({
      fullName: `${currentUser.firstName} ${currentUser.lastName}`,
      email: currentUser.email,
      phone: Array.isArray(currentUser.phoneNumber)
        ? currentUser.phoneNumber[0]
        : currentUser.phoneNumber || '',
      address: '',
      landmark: '',
      city: '',
      state: '',
      pinCode: '',
    });

    this.editAddressIndex.set(null);
    this.showAddressPopup.set(true);
  }

  editAddress(index: number) {
    const addr = this.user().addresses[index];

    this.newAddress.set({ ...addr });
    this.editAddressIndex.set(index);
    this.showAddressPopup.set(true);
  }

  async saveAddress() {
    const addr = this.newAddress();

    if (
      !addr.fullName.trim() ||
      !addr.email.trim() ||
      !addr.phone.trim() ||
      !addr.address.trim() ||
      !addr.city.trim() ||
      !addr.state.trim() ||
      !addr.pinCode.trim()
    ) {
      this.snackBar.error('Please fill all required fields');
      return;
    }

    const currentUser = this.user();
    const addresses = [...(currentUser?.addresses || [])];

    const cleanAddress = {
      fullName: addr.fullName.trim(),
      email: addr.email.trim(),
      phone: addr.phone.trim(),
      address: addr.address.trim(),
      landmark: addr.landmark.trim(),
      city: addr.city.trim(),
      state: addr.state.trim(),
      pinCode: addr.pinCode.trim(),
    };

    if (this.editAddressIndex() !== null) {
      addresses[this.editAddressIndex()!] = cleanAddress;
    } else {
      addresses.push(cleanAddress);
    }

    await this.authService.updateUserAddress(currentUser.uid, {
      addresses,
    });

    currentUser.addresses = addresses;

    this.snackBar.success(
      this.editAddressIndex() !== null
        ? 'Address updated successfully'
        : 'Address saved successfully',
    );

    this.editAddressIndex.set(null);
    this.showAddressPopup.set(false);
  }

  // async saveAddress() {
  //   const currentUser = this.user();

  //   if (!currentUser?.uid) return;

  //   const addresses = currentUser.addresses || [];

  //   const addressData = {
  //     ...this.newAddress(),
  //     phone: String(this.newAddress().phone),
  //   };

  //   if (this.editAddressIndex() !== null) {
  //     addresses[this.editAddressIndex()!] = addressData;
  //   } else {
  //     addresses.push(addressData);
  //   }

  //   await this.authService.updateUserAddress(currentUser.uid, {
  //     addresses,
  //   });

  //   currentUser.addresses = addresses;

  //   this.showAddressPopup.set(false);
  //   this.editAddressIndex.set(null);
  // }

  async deleteAddress(index: number) {
    const currentUser = this.user();

    const addresses = [...(currentUser.addresses || [])];

    addresses.splice(index, 1);

    await this.authService.updateUserAddress(currentUser.uid, {
      addresses,
    });

    currentUser.addresses = addresses;

    this.snackBar.success('Address deleted successfully');
  }

  // async deleteAddress(index: number) {
  //   const currentUser = this.user();

  //   const addresses = currentUser.addresses || [];

  //   addresses.splice(index, 1);

  //   await this.authService.updateUserAddress(currentUser.uid, {
  //     addresses,
  //   });

  //   currentUser.addresses = addresses;
  // }
}
