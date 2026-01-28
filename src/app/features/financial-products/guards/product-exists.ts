import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProductService } from '../services/product-service';

export const ProductExistsGuard: CanActivateFn = (route) => {
  const productService = inject(ProductService);
  const router = inject(Router);

  const productId = route.paramMap.get('id');

  if (!productId) {
    router.navigate(['/']);
    return false;
  }

  return productService.verifyProductId(productId).pipe(
    map((response) => {
      const exists = response.body ?? false;

      if (!exists) {
        router.navigate(['/']);
        return false;
      }

      return true;
    }),
    catchError(() => {
      router.navigate(['/']);
      return of(false);
    })
  );
};
