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
  breadcrumbs: {
    label: string;
    url: string;
    queryParams?: Record<string, string>;
  }[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
  ) {
    this.buildBreadcrumbs();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.buildBreadcrumbs());
  }

  private buildBreadcrumbs() {
    const currentUrl = this.router.url;

    if (currentUrl === '/') {
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
        !this.breadcrumbs.some((b) => b.label === staticLabel)
      ) {
        this.breadcrumbs.push({ label: staticLabel, url });
      }
    }

    let deepest = this.route.snapshot;
    while (deepest.firstChild) deepest = deepest.firstChild;

    const productId = deepest.params['id'];
    const isProductPage = !!productId;

    const queryParams = this.route.snapshot.queryParams;

    if (!isProductPage && queryParams['category']) {
      const category = queryParams['category'].toLowerCase().trim();
      const label = this.toLabel(category);

      this.breadcrumbs.push({
        label,
        url: '/products',
        queryParams: { category },
      });
    }

    if (isProductPage) {
      const productUrl = `/products/${productId}`;

      this.productService.getProductById(productId).subscribe((post) => {
        if (!post) return;

        const category = post.category?.toLowerCase().trim();

        if (category) {
          const label = this.toLabel(category);

          this.breadcrumbs = this.breadcrumbs.filter(
            (b) => b.label.toLowerCase() !== label.toLowerCase(),
          );

          this.breadcrumbs.splice(2, 0, {
            label,
            url: '/products',
            queryParams: { category },
          });
        }

        const shortTitle = post.title.length > 25 ? post.title.slice(0, 25) + '...' : post.title;

        this.breadcrumbs = this.breadcrumbs.filter((b) => b.label !== shortTitle);

        this.breadcrumbs.push({
          label: shortTitle,
          url: productUrl,
        });
      });
    }
  }

  private toLabel(category: string): string {
    if (category === 'all') return 'All';
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
}

// import { Component } from '@angular/core';
// import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
// import { ProductService } from '../../services/product-service';
// import { filter } from 'rxjs';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-breadcrumb',
//   standalone: true,
//   imports: [CommonModule, RouterLink],
//   templateUrl: './breadcrumb.html',
//   styleUrl: './breadcrumb.css',
// })
// export class Breadcrumb {
//   breadcrumbs: { label: string; url: string; queryParams?: Record<string, string> }[] = [];

//   constructor(
//     private router: Router,
//     private route: ActivatedRoute,
//     private productService: ProductService,
//   ) {
//     this.buildBreadcrumbs();

//     this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
//       this.buildBreadcrumbs();
//     });
//   }

//   private buildBreadcrumbs() {
//     if (this.router.url === '/') {
//       this.breadcrumbs = [];
//       return;
//     }

//     this.breadcrumbs = [{ label: 'Home', url: '/' }];

//     let currentRoute = this.route.root;
//     let url = '';

//     const queryParams = this.route.snapshot.queryParams;

//     // STEP 1: Build static breadcrumbs
//     while (currentRoute.firstChild) {
//       currentRoute = currentRoute.firstChild;

//       const routeURL = currentRoute.snapshot.url.map((s) => s.path).join('/');
//       if (!routeURL) continue;

//       url += `/${routeURL}`;

//       const staticLabel = currentRoute.snapshot.data['breadcrumb'];

//       if (
//         staticLabel &&
//         staticLabel !== 'Home' &&
//         !this.breadcrumbs.some((b) => b.label === staticLabel)
//       ) {
//         this.breadcrumbs.push({ label: staticLabel, url });
//       }
//     }

//     // STEP 2: Detect product page
//     let deepest = this.route.snapshot;
//     while (deepest.firstChild) {
//       deepest = deepest.firstChild;
//     }

//     const postId = deepest.params['id'];
//     const isProductPage = !!postId;

//     // STEP 3: CATEGORY (LIST PAGE ONLY)
//     if (!isProductPage && queryParams['category']) {
//       const category = queryParams['category'].toLowerCase().trim();

//       const label =
//         category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1);

//       this.breadcrumbs.push({
//         label,
//         url: '/products',
//         queryParams: { category }, // ✅ Fixed: separate queryParams
//       });
//     }

//     // STEP 4: PRODUCT PAGE (CATEGORY + PRODUCT)
//     if (isProductPage) {
//       this.productService.getProductById(postId).subscribe((post) => {
//         if (!post) return;

//         // CATEGORY
//         const category = post.category?.toLowerCase().trim();

//         if (category) {
//           const label =
//             category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1);

//           // Remove any existing category breadcrumb
//           this.breadcrumbs = this.breadcrumbs.filter(
//             (b) => b.label.toLowerCase() !== label.toLowerCase(),
//           );

//           // Insert after "Products"
//           this.breadcrumbs.splice(2, 0, {
//             label,
//             url: '/products',
//             queryParams: { category }, // ✅ Fixed: separate queryParams
//           });
//         }

//         // PRODUCT TITLE
//         const shortTitle = post.title.length > 25 ? post.title.slice(0, 25) + '...' : post.title;

//         // Remove duplicate product
//         this.breadcrumbs = this.breadcrumbs.filter((b) => b.label !== shortTitle);

//         this.breadcrumbs.push({
//           label: shortTitle,
//           url: this.router.url,
//         });
//       });
//     }
//   }
// }

// import { Component } from '@angular/core';
// import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
// import { ProductService } from '../../services/product-service';
// import { filter } from 'rxjs';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-breadcrumb',
//   standalone: true,
//   imports: [CommonModule, RouterLink],
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
//     this.buildBreadcrumbs();

//     this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
//       this.buildBreadcrumbs();
//     });
//   }

//   private buildBreadcrumbs() {
//     if (this.router.url === '/') {
//       this.breadcrumbs = [];
//       return;
//     }

//     this.breadcrumbs = [{ label: 'Home', url: '/' }];
//     let currentRoute = this.route.root;
//     let url = '';

//     while (currentRoute.firstChild) {
//       currentRoute = currentRoute.firstChild;
//       const routeURL = currentRoute.snapshot.url.map((s) => s.path).join('/');
//       if (!routeURL) continue;

//       url += `/${routeURL}`;

//       const staticLabel = currentRoute.snapshot.data['breadcrumb'];

//       if (
//         staticLabel &&
//         staticLabel !== 'Home' &&
//         this.breadcrumbs[this.breadcrumbs.length - 1]?.label !== staticLabel
//       ) {
//         this.breadcrumbs = [...this.breadcrumbs, { label: staticLabel, url }];
//       }
//       // if (staticLabel && staticLabel !== 'Home') {
//       //   this.breadcrumbs.push({ label: staticLabel, url });
//       // }

//       const postId = currentRoute.snapshot.params['id'];
//       if (postId) {
//         this.productService.getProductById(postId).subscribe((post) => {
//           if (post) {
//             const shortTitle =
//               post.title.length > 25 ? post.title.slice(0, 25) + '...' : post.title;

//             if (!this.breadcrumbs.some((b) => b.label === shortTitle)) {
//               this.breadcrumbs.push({
//                 label: shortTitle,
//                 url,
//               });
//             }
//           }
//         });
//         // this.productService.getProductById(+postId).subscribe((post) => {
//         //   this.breadcrumbs.push({ label: post.title, url });
//         // });
//       }
//     }
//   }
// }

// import { Component } from '@angular/core';
// import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { filter } from 'rxjs';

// import { ProductService } from '../../services/product-service';

// @Component({
//   selector: 'app-breadcrumb',
//   standalone: true,
//   imports: [CommonModule, RouterLink],
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
//     this.buildBreadcrumbs();

//     this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
//       this.buildBreadcrumbs();
//     });
//   }

//   private buildBreadcrumbs() {
//     if (this.router.url === '/') {
//       this.breadcrumbs = [];
//       return;
//     }

//     this.breadcrumbs = [{ label: 'Home', url: '/' }];

//     let currentRoute = this.route.root;
//     let url = '';

//     while (currentRoute.firstChild) {
//       currentRoute = currentRoute.firstChild;

//       const routeURL = currentRoute.snapshot.url.map((s) => s.path).join('/');

//       if (!routeURL) continue;

//       url += `/${routeURL}`;

//       const staticLabel = currentRoute.snapshot.data['breadcrumb'];

//       if (
//         staticLabel &&
//         staticLabel !== 'Home' &&
//         this.breadcrumbs[this.breadcrumbs.length - 1]?.label !== staticLabel
//       ) {
//         this.breadcrumbs.push({ label: staticLabel, url });
//       }

//       const postId = currentRoute.snapshot.params['id'];

//       if (postId) {
//         this.productService.getProductById(postId).subscribe((post) => {
//           if (post) {
//             const shortTitle =
//               post.title.length > 25 ? post.title.slice(0, 25) + '...' : post.title;

//             if (this.breadcrumbs[this.breadcrumbs.length - 1]?.label !== shortTitle) {
//               this.breadcrumbs.push({
//                 label: shortTitle,
//                 url,
//               });
//             }
//           }
//         });
//       }
//     }
//   }
// }

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
