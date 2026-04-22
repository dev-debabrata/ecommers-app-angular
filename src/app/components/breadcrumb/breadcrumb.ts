import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css',
})
export class Breadcrumb {
  breadcrumbs: { label: string; url: string }[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,

    private productService: ProductService,
  ) {
    this.buildBreadcrumbs();

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.buildBreadcrumbs();
    });
  }

  private buildBreadcrumbs() {
    if (this.router.url === '/') {
      this.breadcrumbs = [];
      return;
    }

    this.breadcrumbs = [{ label: 'Home', url: '/' }];
    let currentRoute = this.route.root;
    let url = '';

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
      const routeURL = currentRoute.snapshot.url.map((s) => s.path).join('/');
      if (!routeURL) continue;

      url += `/${routeURL}`;

      const staticLabel = currentRoute.snapshot.data['breadcrumb'];

      if (
        staticLabel &&
        staticLabel !== 'Home' &&
        this.breadcrumbs[this.breadcrumbs.length - 1]?.label !== staticLabel
      ) {
        this.breadcrumbs = [...this.breadcrumbs, { label: staticLabel, url }];
      }
      // if (staticLabel && staticLabel !== 'Home') {
      //   this.breadcrumbs.push({ label: staticLabel, url });
      // }

      const postId = currentRoute.snapshot.params['id'];
      if (postId) {
        this.productService.getProductById(+postId).subscribe((post) => {
          this.breadcrumbs.push({ label: post.title, url });
        });
      }
    }
  }
}

// import { Component } from '@angular/core';
// import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
// import { filter } from 'rxjs';
// import { ProductService } from '../../services/product-service';

// @Component({
//   selector: 'app-breadcrumb',
//   standalone: true,
//   templateUrl: './breadcrumb.html',
//   styleUrl: './breadcrumb.css',
// })
// export class Breadcrumb {
//   breadcrumbs: { label: string; url: string }[] = [];

//   constructor(
//     private router: Router,
//     private route: ActivatedRoute,
//     private productService: ProductService,
//   ) {
//     this.router.events
//       .pipe(filter(event => event instanceof NavigationEnd))
//       .subscribe(() => {
//         this.buildBreadcrumbs();
//       });
//   }

//   private buildBreadcrumbs() {
//     const url = this.router.url;

//     // reset always
//     this.breadcrumbs = [{ label: 'Home', url: '/' }];

//     if (url === '/') {
//       return;
//     }

//     let currentRoute = this.route.root;
//     let fullUrl = '';

//     while (currentRoute.firstChild) {
//       currentRoute = currentRoute.firstChild;

//       const routeSegment = currentRoute.snapshot.url
//         .map(s => s.path)
//         .join('/');

//       if (!routeSegment) continue;

//       fullUrl += `/${routeSegment}`;

//       const staticLabel = currentRoute.snapshot.data['breadcrumb'];

//       // ✅ static breadcrumb (cart, products etc)
//       if (staticLabel) {
//         this.breadcrumbs.push({
//           label: staticLabel,
//           url: fullUrl,
//         });
//       }

//       // ✅ dynamic product title (only for /products/:id)
//       const id = currentRoute.snapshot.params['id'];
//       if (id) {
//         this.productService.getProductById(+id).subscribe(product => {
//           this.breadcrumbs = [
//             ...this.breadcrumbs,
//             {
//               label: product.title,
//               url: fullUrl,
//             },
//           ];
//         });
//       }
//     }
//   }
// }
