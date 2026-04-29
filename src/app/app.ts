import { Component, inject } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { LoaderService } from './services/loader-service';
import { Loader } from './components/loader/loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Loader],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  loaderService = inject(LoaderService);
  // private router = inject(Router);

  // constructor() {
  //   this.router.events.subscribe((event) => {
  //     if (event instanceof NavigationStart) {
  //       this.loaderService.show();
  //     }

  //     if (
  //       event instanceof NavigationEnd ||
  //       event instanceof NavigationCancel ||
  //       event instanceof NavigationError
  //     ) {
  //       this.loaderService.hide();
  //     }
  //   });
  // }
}
