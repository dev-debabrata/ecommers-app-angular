import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth-service';

interface MenuItem {
  name: string;
  hasArrow?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, MatSnackBarModule, MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  isSidebarOpen = false;
  isMenuOpen = false;
  isDropdownOpen = false;

  selectedCategory = '';

  dropdownLeft = 0;
  dropdownTop = 0;

  categories: string[] = [
    'Fashion',
    'Electronics',
    'Bags',
    'Footwear',
    'Groceries',
    'Beauty',
    'Wellness',
    'Jewellery',
  ];

  categoryProducts: any = {
    Fashion: ['Shirts', 'Jeans', 'Shoes'],
    Electronics: ['Mobiles', 'Laptops', 'Headphones'],
    Bags: ['Backpacks', 'Travel Bags'],
    Footwear: ['Sneakers', 'Sandals'],
    Groceries: ['Rice', 'Oil', 'Snacks'],
    Beauty: ['Makeup', 'Skincare'],
    Wellness: ['Supplements', 'Yoga'],
    Jewellery: ['Gold', 'Silver', 'Rings'],
  };

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  get userName(): string {
    return this.authService.getUserName();
  }

  logout() {
    this.authService.removeToken();
    this.isMenuOpen = false;

    this.snackBar.open('Logged out successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'],
    });

    this.router.navigate(['/']);
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  openDropdown(category: string, event: MouseEvent) {
    this.selectedCategory = category;
    this.isDropdownOpen = true;

    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    this.dropdownLeft = rect.left;
    this.dropdownTop = rect.bottom;
  }

  // closeDropdown() {
  //   this.isDropdownOpen = false;
  // }

  getProductList() {
    this.router.navigate(['/products']);
  }

  menu: MenuSection[] = [
    {
      title: 'Trending',
      items: [{ name: 'Best Sellers' }, { name: 'New Releases' }, { name: 'Movers and Shakers' }],
    },
    {
      title: 'Digital Content And Devices',
      items: [
        { name: 'Echo & Alexa', hasArrow: true },
        { name: 'Fire TV', hasArrow: true },
        { name: 'Kindle E-Readers & eBooks', hasArrow: true },
        { name: 'Audible Audiobooks', hasArrow: true },
        { name: 'Amazon Prime Video', hasArrow: true },
        { name: 'Amazon Prime Music', hasArrow: true },
      ],
    },
    {
      title: 'Shop By Category',
      items: [
        { name: 'Mobiles, Computers', hasArrow: true },
        { name: 'TV, Appliances, Electronics', hasArrow: true },
        { name: "Men's Fashion", hasArrow: true },
        { name: "Women's Fashion", hasArrow: true },
      ],
    },
  ];
}
