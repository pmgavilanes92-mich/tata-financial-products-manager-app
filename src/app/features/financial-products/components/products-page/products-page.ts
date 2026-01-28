import { Component } from '@angular/core';
import { ProductsTable } from './products-table/products-table';

@Component({
  selector: 'app-products-page',
  imports: [ProductsTable],
  templateUrl: './products-page.html'
})
export class ProductsPage {

}
