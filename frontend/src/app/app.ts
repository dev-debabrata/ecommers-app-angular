import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  router = inject(Router);
  route = inject(ActivatedRoute);

  hideLayout = false;
  hideBreadcrumb = false;

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let current = this.route.firstChild;

        while (current?.firstChild) {
          current = current.firstChild;
        }

        this.hideLayout = current?.snapshot.data['hideLayout'] ?? false;
        this.hideBreadcrumb = current?.snapshot.data['hideBreadcrumb'] ?? false;
      }
    });
  }
}
