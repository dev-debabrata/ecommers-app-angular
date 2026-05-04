import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { ProductListPage } from '../products/product-list-page/product-list-page';
import { RouterLink } from '@angular/router';
import { HomeProduct } from '../../components/home-products/home-product/home-product';
import { TodayDeals } from '../../components/home-products/today-deals/today-deals';
import { Discount } from '../../components/home-products/discount/discount';
import { Phones } from '../../components/home-products/phones/phones';
import { MoreItems } from '../../components/home-products/more-items/more-items';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [Hero, RouterLink, TodayDeals, Discount, Phones, MoreItems],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
