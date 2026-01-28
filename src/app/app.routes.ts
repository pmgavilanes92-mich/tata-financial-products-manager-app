import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren() {
      return import('./features/financial-products/financial-products.routes').then(m => m.FINANCIAL_PRODUCTS_ROUTES)
    },
  },
];
