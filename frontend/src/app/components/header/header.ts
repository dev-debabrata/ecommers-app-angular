import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, Navbar, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
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
}
