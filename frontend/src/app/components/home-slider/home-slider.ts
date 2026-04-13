import { Component } from '@angular/core';

@Component({
  selector: 'app-home-slider',
  imports: [],
  templateUrl: './home-slider.html',
  styleUrl: './home-slider.css',
})
export class HomeSlider {
  images = [
    '/banner/banner1.jpg',
    '/banner/banner2.jpg',
    '/banner/banner3.jpg',
    '/banner/banner4.jpg',
    '/banner/banner5.jpg',
    '/banner/banner6.jpg',
  ];

  currentIndex = 0;

  ngOnInit() {
    setInterval(() => {
      this.currentIndex++;
      if (this.currentIndex >= this.images.length) {
        this.currentIndex = 0;
      }
    }, 2000);
  }
}
