import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { ProductService } from '../services/product-service';
import { IProduct } from '../models/Product';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ProductStoreService {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  products = signal<IProduct[]>([]);
  productsFilter = signal<IProduct[]>([]);
  product = signal<IProduct | null>(null);
  error = signal<string | null>(null);
  loading = signal(false);
  loadProducts = signal(false);

  getAllProductsByPageSize(pageSize?: number): void {
    this.clearError();
    this.loading.set(true);
    this.productService
      .getAllProducts()
      .pipe(
        tap((data) => {
          const products = data.body?.data || [];
          this.products.set(products);

          if (pageSize) {
            this.applyPagination(products, pageSize);
          } else {
            this.productsFilter.set(products);
          }
        }),
        catchError(() => {
          this.error.set('No se pudo cargar la información');
          return of(null);
        }),
        finalize(() => {
          this.loading.set(false);
          this.loadProducts.set(true);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  searchFilter(value: string, fields: string[], pageSize: number): void {
    const allProducts = this.products();
    let filteredProducts: IProduct[];

    if (value.trim()) {
      const query = value.toLowerCase().trim();
      filteredProducts = this.filterProductByField(allProducts, fields, query);
    } else {
      filteredProducts = allProducts;
    }

    this.applyPagination(filteredProducts, pageSize);
  }

  save(product: IProduct): void {
    this.clearError();
    this.loading.set(true);
    this.productService
      .verifyProductId(product.id)
      .pipe(
        switchMap((res) => {
          if (res.body) {
            this.error.set('El ID del producto ya existe');
            this.loading.set(false);
            return of(null);
          }

          return this.productService.create(product).pipe(
            tap(() => {
              this.router.navigate(['/']);
            }),
            catchError(() => {
              this.error.set('Error al guardar el producto');
              return of(null);
            }),
          );
        }),
        finalize(() => {
          this.loading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  update(product: IProduct): void {
    this.clearError();
    this.loading.set(true);
    this.productService
      .update(product)
      .pipe(
        tap(() => {
          this.router.navigate(['/']);
        }),
        catchError(() => {
          this.error.set('Error al actualizar el producto');
          return of(null);
        }),
        finalize(() => {
          this.loading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  deleteProduct(id: string, queryFilter: string, fields: string[], pageSize: number): void {
    this.clearError();
    this.loading.set(true);
    this.productService
      .delete(id)
      .pipe(
        tap(() => {
          const updatedProducts = this.products().filter((product) => product.id !== id);
          this.products.set(updatedProducts);
          this.searchFilter(queryFilter, fields, pageSize);
        }),
        catchError(() => {
          this.error.set('Error al eliminar el producto');
          return of(null);
        }),
        finalize(() => {
          this.loading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  getById(id: string): IProduct | null {
    return this.products().find((product) => product.id === id) ?? null;
  }

  isLoadAllProducts(): boolean {
    return this.loadProducts();
  }

  clearError(): void {
    this.error.set(null);
  }

  private filterProductByField(products: IProduct[], fields: string[], query: string): IProduct[] {
    return products.filter((product) =>
      fields.some((field) => {
        const fieldValue = product[field as keyof IProduct];
        return String(fieldValue ?? '')
          .toLowerCase()
          .includes(query);
      }),
    );
  }

  private applyPagination(products: IProduct[], pageSize: number): void {
    this.productsFilter.set(products.slice(0, pageSize));
  }
}
