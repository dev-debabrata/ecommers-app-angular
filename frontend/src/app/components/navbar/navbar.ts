import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  categories = [
    'Home',
    'Fashion',
    'Electronics',
    'Bags',
    'Footwear',
    'Groceries',
    'Beauty',
    'Wellness',
    'Jewellery',
  ];
}
