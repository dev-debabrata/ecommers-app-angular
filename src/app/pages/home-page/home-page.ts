import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { ProductListPage } from '../products/product-list-page/product-list-page';
import { RouterLink } from '@angular/router';
import { HomeProduct } from '../../components/home-products/home-product/home-product';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [Hero, RouterLink, HomeProduct],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
