import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductStoreService } from '../store/product-store';

export const ProductResolve: ResolveFn<boolean> = () => {
  const productStore = inject(ProductStoreService);
  if (!productStore.isLoadAllProducts()) {
productStore.getAllProductsByPageSize();
  }
  return true;
};
