import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './customer-layout.html',
  styleUrl: './customer-layout.css',
})
export class CustomerLayout {
  router = inject(Router);
  route = inject(ActivatedRoute);

  hideLayout = false;
  hideBreadcrumb = false;

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateLayoutFlags(this.router.routerState.root);
      }
    });
  }

  private updateLayoutFlags(route: ActivatedRoute) {
    let current: ActivatedRoute | null = route;

    this.hideLayout = false;
    this.hideBreadcrumb = false;

    while (current) {
      const data = current.snapshot.data;

      if (data?.['hideLayout']) {
        this.hideLayout = true;
      }

      if (data?.['hideBreadcrumb']) {
        this.hideBreadcrumb = true;
      }

      current = current.firstChild!;
    }
  }
}
