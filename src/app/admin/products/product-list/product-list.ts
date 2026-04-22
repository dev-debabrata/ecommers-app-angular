import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, MatIcon],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {}
