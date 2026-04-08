import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  showMenu = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    this.isLoggedIn = false;
    this.showMenu = false;
    this.router.navigate(['/']);
  }
  links = [
    { name: 'Home', dropdown: false },
    { name: 'Products', dropdown: true },
    { name: 'About', dropdown: false },
    { name: 'Contact', dropdown: false },
  ];

  openDropdownIndex: number | null = null;

  openDropdown(index: number) {
    if (this.links[index].dropdown) {
      this.openDropdownIndex = index;
    }
  }

  closeDropdown() {
    this.openDropdownIndex = null;
  }
  // // categories = ['Home', 'All Products', 'Electronics', 'Fashion', 'Beauty', 'Sports'];

  // links = ['Home', 'Products', 'About', 'Contact'];
  // isDropdownOpen = false;

  // toggleDropdown() {
  //   this.isDropdownOpen = !this.isDropdownOpen;
  // }
}
