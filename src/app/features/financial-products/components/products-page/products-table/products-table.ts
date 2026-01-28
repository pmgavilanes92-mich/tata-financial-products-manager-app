import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product-service';
import { ProductStoreService } from '../../../store/product-store';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.html',
  styleUrls: ['./products-table.css'],
})
export class ProductsTable implements OnInit {
  private productsStoreService = inject(ProductStoreService);
  products = this.productsStoreService.products;
  error    = this.productsStoreService.error;
  loading  = this.productsStoreService.loading;

  ngOnInit(): void {
    this.getProducts();
  }

  private getProducts(): void {
    this.productsStoreService.getAllProducts();

  }
}
