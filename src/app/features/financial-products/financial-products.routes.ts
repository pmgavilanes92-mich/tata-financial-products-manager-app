import { Routes } from '@angular/router';
import { ProductsUpdate } from './components/products-page/products-update/products-update';
import { ProductsPage } from './components/products-page/products-page';

export const FINANCIAL_PRODUCTS_ROUTES: Routes = [
     {
        path: '',
        component: ProductsPage
    },
    {
        path: 'create',
        component: ProductsUpdate
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./components/products-page/products-update/products-update').then(m => m.ProductsUpdate)
    }
];
