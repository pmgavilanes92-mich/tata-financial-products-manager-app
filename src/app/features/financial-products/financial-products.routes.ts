import { Routes } from '@angular/router';
import { ProductsPage } from './components/products-page/products-page';
import { ProductResolve } from './resolvers/product.resolve';
import { ProductExistsGuard } from './guards/product-exists.guard';

export const FINANCIAL_PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    component: ProductsPage,
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./components/products-page/products-update/products-update').then(
        (m) => m.ProductsUpdate
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/products-page/products-update/products-update').then(
        (m) => m.ProductsUpdate
      ),
    canActivate: [ProductExistsGuard],
    resolve: {
      preload: ProductResolve,
    },
  },
];
