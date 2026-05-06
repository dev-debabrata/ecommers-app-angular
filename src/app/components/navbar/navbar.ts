import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.user.service';
import { User } from '../../models/user.model';
import { Category } from '../../models/product.model';

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
export class Navbar implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  user = signal<User | null>(null);

  isSidebarOpen = false;
  isMenuOpen = false;
  isDropdownOpen = false;

  selectedCategory: Category | null = null;

  // selectedCategory = '';

  dropdownLeft = 0;
  dropdownTop = 0;

  categories: Category[] = [
    {
      name: 'Electronics',
      subcategories: ['Mobiles', 'Laptops', 'Headphones', 'Smart Watches'],
    },
    {
      name: 'Fashion',
      subcategories: ["Men's Fashion", "Women's Fashion"],
    },
    {
      name: 'Bags',
      subcategories: ['Backpacks', 'Travel Bags'],
    },
    {
      name: 'Footwear',
      subcategories: ['Sneakers', 'Sandals'],
    },
    {
      name: 'Groceries',
      subcategories: ['Rice', 'Oil', 'Snacks'],
    },
    {
      name: 'Beauty',
      subcategories: ['Makeup', 'Skincare'],
    },
    {
      name: 'Wellness',
      subcategories: ['Supplements', 'Yoga'],
    },
    {
      name: 'Jewellery',
      subcategories: ['Gold', 'Silver', 'Rings'],
    },
  ];

  // categories: string[] = [
  //   'Fashion',
  //   'Electronics',
  //   'Bags',
  //   'Footwear',
  //   'Groceries',
  //   'Beauty',
  //   'Wellness',
  //   'Jewellery',
  // ];

  // categoryProducts: any = {
  //   Fashion: ['Shirts', 'Jeans', 'Shoes'],
  //   Electronics: ['Mobiles', 'Laptops', 'Headphones'],
  //   Bags: ['Backpacks', 'Travel Bags'],
  //   Footwear: ['Sneakers', 'Sandals'],
  //   Groceries: ['Rice', 'Oil', 'Snacks'],
  //   Beauty: ['Makeup', 'Skincare'],
  //   Wellness: ['Supplements', 'Yoga'],
  //   Jewellery: ['Gold', 'Silver', 'Rings'],
  // };

  get authReady() {
    return this.authService.isAuthReady();
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  // get userName(): string {
  //   return this.authService.getUserName();
  // }

  ngOnInit() {
    const sub = this.authService.getFullUser().subscribe({
      next: (user) => {
        this.user.set(user);
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  logout() {
    this.authService.logout();
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

  openDropdown(category: Category, event: MouseEvent) {
    this.selectedCategory = category;
    this.isDropdownOpen = true;

    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    this.dropdownLeft = rect.left;
    this.dropdownTop = rect.bottom;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  goToSubCategory(sub: string) {
    this.router.navigate(['/products'], {
      queryParams: {
        main: this.selectedCategory!.name.toLowerCase().trim(),
        category: sub.toLowerCase().trim(),
      },
    });

    this.closeDropdown();
  }

  goToMainCategory(cat: string) {
    this.router.navigate(['/products'], {
      queryParams: {
        main: cat.toLowerCase().trim(),
        category: 'all',
      },
    });

    this.closeDropdown();
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
