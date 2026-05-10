import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Hero } from '../../components/hero/hero';
import { Mobiles } from '../../components/categories/electronics/mobiles/mobiles';
import { MoreItems } from '../../components/categories/more-items/more-items';
import { Discount } from '../../components/categories/discount/discount';
import { TodayDeals } from '../../components/categories/today-deals/today-deals';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [Hero, RouterLink, Mobiles, MoreItems, Discount, TodayDeals],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
