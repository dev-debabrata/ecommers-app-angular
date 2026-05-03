import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ProductService } from '../../../services/product-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Product, ProductField } from '../../../models/products';
import { FormsModule } from '@angular/forms';

import { LoaderService } from '../../../services/loader-service';
import { SnackbarService } from '../../../services/snackbar-service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private snackbar = inject(SnackbarService);
  private loaderService = inject(LoaderService);
  private destroyRef = inject(DestroyRef);

  editId: string | null = null;
  isEdit = false;

  extraFields = signal<{ label: string; value: string }[]>([]);

  product = signal<Partial<Product>>({
    title: '',
    price: 0,
    discount: 0,
    stock: 0,
    brand: '',
    color: '',
    category: '',
    image: '',
    description: '',
    rating: 0,
  });

  touched = signal({
    title: false,
    price: false,
    discount: false,
    stock: false,
    brand: false,
    color: false,
    category: false,
    image: false,
    description: false,
    rating: false,
  });

  ngOnInit() {
    this.editId = this.route.snapshot.paramMap.get('id');

    if (!this.editId) return;

    this.isEdit = true;

    const sub = this.productService.getProductById(this.editId).subscribe({
      next: (data) => {
        if (data) {
          this.product.set(data);
        }
      },
      error: (err) => {
        console.error('Product fetch error:', err);
      },
    });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////

  addField() {
    this.extraFields.update((fields) => [...fields, { label: '', value: '' }]);
  }

  removeField(index: number) {
    this.extraFields.update((fields) => fields.filter((_, i) => i !== index));
  }

  updateExtraField(index: number, key: 'label' | 'value', value: string) {
    this.extraFields.update((fields) => {
      const updated = [...fields];
      updated[index] = {
        ...updated[index],
        [key]: value,
      };
      return updated;
    });
  }

  trackByIndex(index: number) {
    return index;
  }

  /////////////////////////////////////////////////////////

  updateField(field: ProductField, value: any) {
    this.product.update((p) => ({
      ...p,
      [field]: value,
    }));
  }

  markTouched(field: ProductField) {
    this.touched.update((t) => ({
      ...t,
      [field]: true,
    }));
  }

  isInvalid(field: ProductField): boolean {
    const product = this.product();
    const touched = this.touched();

    const value = product[field];

    return touched[field] && (value === '' || value === null || value === undefined);
  }

  isFormValid = computed(() => {
    const p = this.product();

    return (
      !!p.title &&
      (p.price ?? 0) > 0 &&
      (p.discount ?? 0) >= 0 &&
      (p.stock ?? 0) >= 0 &&
      !!p.brand &&
      !!p.color &&
      !!p.category &&
      !!p.image &&
      !!p.description &&
      (p.rating ?? 0) >= 0 &&
      (p.rating ?? 0) <= 5
    );
  });

  // isInvalid(field: ProductField): boolean {
  //   const product = this.product();
  //   const touched = this.touched();

  //   return !product[field] && touched[field];
  // }

  // isFormValid = computed(() => {
  //   const p = this.product();

  //   return (
  //     p.title &&
  //     p.price > 0 &&
  //     (p.discount ?? 0) >= 0 &&
  //     p.stock >= 0 &&
  //     p.brand &&
  //     p.color &&
  //     p.category &&
  //     p.image &&
  //     p.description &&
  //     (p.rating ?? 0) >= 0 &&
  //     (p.rating ?? 0) <= 5
  //   );
  // });

  onSubmit() {
    if (!this.isFormValid()) {
      this.snackbar.error('Please fill all required fields');
      return;
    }

    this.loaderService.show();

    const p = this.product();

    const finalProduct: Product = {
      id: this.editId ?? '',
      title: p.title!,
      price: p.price!,
      discount: p.discount,
      stock: p.stock!,
      brand: p.brand!,
      color: p.color!,
      category: p.category!,
      image: p.image!,
      description: p.description!,
      rating: p.rating,
      createdAt: Date.now(),
    };

    let sub;

    if (this.isEdit && this.editId) {
      sub = this.productService.updateProduct(this.editId, finalProduct).subscribe({
        next: () => {
          this.snackbar.success('Product Updated Successfully');
          this.loaderService.hide();
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          this.loaderService.hide();
          this.snackbar.error('Something went wrong');
          console.error(err);
        },
      });
    } else {
      sub = this.productService.addProduct(finalProduct).subscribe({
        next: () => {
          this.snackbar.success('Product Added Successfully');
          this.loaderService.hide();
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          this.loaderService.hide();
          this.snackbar.error('Something went wrong');
          console.error(err);
        },
      });
    }

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  onCancel() {
    this.location.back();
  }
}

// onSubmit() {
//   if (!this.isFormValid()) {
//     this.snackbar.error('Please fill all required fields');
//     return;
//   }

//   this.loaderService.show();

//   const p = this.product();

//   const finalProduct: Product = {
//     id: this.editId ?? '', // temp for update (ignored in add)
//     title: p.title!,
//     price: p.price!,
//     discount: p.discount,
//     stock: p.stock!,
//     brand: p.brand!,
//     color: p.color!,
//     category: p.category!,
//     image: p.image!,
//     description: p.description!,
//     rating: p.rating,
//     createdAt: Date.now(),
//   };

//   let sub;

//   if (this.isEdit && this.editId) {
//     sub = this.productService.updateProduct(this.editId, finalProduct).subscribe({
//       next: () => {
//         this.snackbar.success('Product Updated Successfully');
//         this.loaderService.hide();
//         this.router.navigate(['/admin/products']);
//       },
//       error: (err) => {
//         this.loaderService.hide();
//         this.snackbar.error('Something went wrong');
//         console.error(err);
//       },
//     });
//   } else {
//     sub = this.productService.addProduct(finalProduct).subscribe({
//       next: () => {
//         this.snackbar.success('Product Added Successfully');
//         this.loaderService.hide();
//         this.router.navigate(['/admin/products']);
//       },
//       error: (err) => {
//         this.loaderService.hide();
//         this.snackbar.error('Something went wrong');
//         console.error(err);
//       },
//     });
//   }

//   this.destroyRef.onDestroy(() => sub.unsubscribe());
// }

/////////////////////////////////////////////////////////////////////////////////////////////

// async onSubmit() {
//   if (!this.isFormValid()) {
//     this.snackbar.error('Please fill all required fields');
//     return;
//   }

//   this.loaderService.show();

//   try {
//     if (this.isEdit && this.editId) {
//       await this.productService.updateProduct(this.editId, this.product());
//       this.snackbar.success('Product Updated Successfully');
//     } else {
//       await this.productService.addProduct(this.product());
//       this.snackbar.success('Product Added Successfully');
//     }

//     this.loaderService.hide();
//     this.router.navigate(['/admin/products']);
//   } catch (err) {
//     this.loaderService.hide();
//     this.snackbar.error('Something went wrong');
//     console.error(err);
//   }
// }
// async onSubmit() {
//   if (!this.isFormValid()) {
//     this.snackBar.open('Please fill all required fields', 'Close', {
//       duration: 3000,
//       horizontalPosition: 'center',
//       verticalPosition: 'top',
//       panelClass: ['snackbar-error'],
//     });
//     return;
//   }

//   this.loaderService.show();

//   if (this.isEdit && this.editId) {
//     await this.productService.updateProduct(this.editId, this.product());

//     this.snackBar.open('Product Updated Successfully', 'Close', {
//       duration: 3000,
//       horizontalPosition: 'center',
//       verticalPosition: 'top',
//       panelClass: ['snackbar-success'],
//     });
//   } else {
//     await this.productService.addProduct(this.product());

//     this.snackBar.open('Product Added Successfully', 'Close', {
//       duration: 3000,
//       horizontalPosition: 'center',
//       verticalPosition: 'top',
//       panelClass: ['snackbar-success'],
//     });
//   }

//   this.router.navigate(['/admin/products']);
// }

//   onCancel() {
//   this.router.navigate(['/admin/products']);
// }

///////////////////////////////////////////////////////////////////////////////////////////////

// import { Component, computed, inject, signal } from '@angular/core';
// import { ProductService } from '../../../services/product-service';
// import { Router } from '@angular/router';
// import { Product } from '../../../models/products';
// import { FormsModule } from '@angular/forms';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// type ProductField =
//   | 'title'
//   | 'price'
//   | 'stock'
//   | 'brand'
//   | 'color'
//   | 'category'
//   | 'image'
//   | 'description';

// @Component({
//   selector: 'app-add-product',
//   standalone: true,
//   imports: [FormsModule, MatSnackBarModule],
//   templateUrl: './add-product.html',
//   styleUrl: './add-product.css',
// })
// export class AddProduct {
//   private productService = inject(ProductService);
//   private router = inject(Router);
//   private snackBar = inject(MatSnackBar);

//   product = signal<Product>({
//     title: '',
//     price: 0,
//     stock: 0,
//     brand: '',
//     color: '',
//     category: '',
//     image: '',
//     description: '',
//     rating: 0,
//   });

//   touched = signal({
//     title: false,
//     price: false,
//     stock: false,
//     brand: false,
//     color: false,
//     category: false,
//     image: false,
//     description: false,
//   });

//   updateField(field: ProductField, value: any) {
//     this.product.update((p) => ({
//       ...p,
//       [field]: value,
//     }));
//   }

//   markTouched(field: ProductField) {
//     this.touched.update((t) => ({
//       ...t,
//       [field]: true,
//     }));
//   }

//   isInvalid(field: ProductField): boolean {
//     const product = this.product();
//     const touched = this.touched();

//     return !product[field] && touched[field];
//   }

//   isFormValid = computed(() => {
//     const p = this.product();

//     return (
//       p.title &&
//       p.price > 0 &&
//       p.stock > 0 &&
//       p.brand &&
//       p.color &&
//       p.category &&
//       p.image &&
//       p.description
//     );
//   });

//   async onSubmit() {
//     if (!this.isFormValid()) {
//       this.snackBar.open('Please fill all required fields', 'Close', {
//         duration: 3000,
//         horizontalPosition: 'center',
//         verticalPosition: 'top',
//         panelClass: ['snackbar-error'],
//       });
//       return;
//     }

//     await this.productService.addProduct(this.product());

//     this.snackBar.open('Product Added Successfully', 'Close', {
//       duration: 3000,
//       horizontalPosition: 'center',
//       verticalPosition: 'top',
//       panelClass: ['snackbar-success'],
//     });

//     this.router.navigate(['/admin/products']);
//   }

// async onSubmit() {
//   if (!this.isFormValid()) return;

//   await this.productService.addProduct(this.product());

//   this.snackBar.open('Product Added Successfully', 'Close', {
//     duration: 3000,
//   });

//   this.router.navigate(['/admin/products']);
// }
// }

// import { Component, inject, signal } from '@angular/core';
// import { ProductService } from '../../../services/product-service';
// import { Router } from '@angular/router';
// import { Product } from '../../../models/products';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-add-product',
//   standalone: true,
//   imports: [FormsModule],
//   templateUrl: './add-product.html',
//   styleUrl: './add-product.css',
// })
// export class AddProduct {
//   private productService = inject(ProductService);
//   private router = inject(Router);

//   product = signal<Product>({
//     title: '',
//     price: 0,
//     stock: 0,
//     brand: '',
//     color: '',
//     category: '',
//     image: '',
//     description: '',
//     rating: 0,
//   });

//   updateField(field: string, value: any) {
//     this.product.update((p) => ({
//       ...p,
//       [field]: value,
//     }));
//   }

//   async onSubmit() {
//     const data = this.product();

//     await this.productService.addProduct(data);

//     alert('Product Added');

//     this.router.navigate(['/admin/products']);
//   }
// }

// import { Component, inject, signal } from '@angular/core';
// import { ProductService } from '../../../services/product-service';
// import { Router } from '@angular/router';
// import { Product } from '../../../models/products';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-add-product',
//   standalone: true,
//   imports: [FormsModule],
//   templateUrl: './add-product.html',
//   styleUrl: './add-product.css',
// })
// export class AddProduct {
//   private productService = inject(ProductService);
//   private router = inject(Router);

//   product = signal<Product>({
//     title: '',
//     price: 0,
//     stock: 0,
//     brand: '',
//     color: '',
//     category: '',
//     image: '',
//     description: '',
//     rating: 0,
//   });

//   updateField<K extends keyof Product>(field: K, value: Product[K]) {
//     this.product.update((p) => ({
//       ...p,
//       [field]: value,
//     }));
//   }

//   async onSubmit() {
//     try {
//       const data = this.product();

//       await this.productService.addProduct(data);

//       alert('Product Added');

//       this.router.navigate(['/admin/products']);
//     } catch (error) {
//       console.error(error);
//       alert('Failed');
//     }
//   }
// }
