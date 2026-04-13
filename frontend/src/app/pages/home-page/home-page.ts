import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [Hero],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
