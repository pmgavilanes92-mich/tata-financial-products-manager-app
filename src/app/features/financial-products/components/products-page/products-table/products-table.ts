import { Component, inject, OnInit } from '@angular/core';
import { ProductStoreService } from '../../../store/product-store';
import { DatePipe } from '@angular/common';
import { SelectPagination } from '../../../../../shared/components/select-pagination/select-pagination';
import { PRODUCT_FIELDS_FILTER } from '../../../constants/product-fields-filter';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.html',
  imports: [DatePipe, SelectPagination],
  styleUrls: ['./products-table.css'],
})
export class ProductsTable implements OnInit {
  private productsStoreService = inject(ProductStoreService);
  private router = inject(Router);
  pageSize = 5;
  queryFilter = '';
  fields = PRODUCT_FIELDS_FILTER

  productsFilter = this.productsStoreService.productsFilter;
  error = this.productsStoreService.error;
  loading = this.productsStoreService.loading;

  ngOnInit(): void {
    this.getProducts();
  }

  searchFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();
    this.queryFilter = value;
    this.productsStoreService.searchFilter(value, this.fields, this.pageSize);
  }

  onPageChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.productsStoreService.searchFilter(this.queryFilter, this.fields, pageSize);
  }

  openCreateProductModal(): void {
    this.router.navigate(['/','create']);
  }

  private getProducts(): void {
    this.productsStoreService.getAllProductsByPageSize(this.pageSize);
  }
}
