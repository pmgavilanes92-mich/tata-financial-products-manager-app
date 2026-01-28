import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { ProductStoreService } from '../../../store/product-store';
import { DatePipe } from '@angular/common';
import { SelectPagination } from '../../../../../shared/components/select-pagination/select-pagination';
import { PRODUCT_FIELDS_FILTER } from '../../../constants/product-fields-filter';
import { Router } from '@angular/router';
import { ConfirmModal } from '../../../../../shared/components/modals/confirm-modal/confirm-modal';


@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.html',
  imports: [DatePipe, SelectPagination, ConfirmModal],
  styleUrls: ['./products-table.css'],
})
export class ProductsTable implements OnInit {
  private readonly selectOptionsRef = viewChild<ElementRef>('selectOptions');
  private readonly productsStoreService = inject(ProductStoreService);
  private readonly router = inject(Router);

  pageSize = 5;
  queryFilter = '';
  fields = PRODUCT_FIELDS_FILTER;
  productsFilter = this.productsStoreService.productsFilter;
  error = this.productsStoreService.error;
  loading = this.productsStoreService.loading;

  showDeleteProductModal = signal(false);
  showDropdownOptions = signal<string | null>(null);
  productToDeleteId = signal<string | null>(null);
  deleteModalMessage = signal<string>('');

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.selectOptionsRef()) {
      this.showDropdownOptions.set(null);
    }
  }

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
    this.router.navigate(['/', 'create']);
  }

  openDropdownOptions(id: string): void {
    this.showDropdownOptions.set(id);
  }

  openEditProductPage(id: string): void {
    this.router.navigate(['/edit', id]);
  }

  openDeleteProductModal(id: string): void {
    const product = this.productsStoreService.getById(id);
    if (product) {
      this.productToDeleteId.set(id);
      this.deleteModalMessage.set(`¿Está seguro que desea eliminar el producto "${product.name}"?`);
      this.showDeleteProductModal.set(true);
    }
  }

  onDeleteModalResponse(confirmed: boolean): void {
    if (confirmed && this.productToDeleteId()) {
      this.productsStoreService.deleteProduct(
        this.productToDeleteId()!,
        this.queryFilter,
        this.fields,
        this.pageSize
      );
    }

    this.showDeleteProductModal.set(false);
    this.productToDeleteId.set(null);
  }

  private getProducts(): void {
    this.productsStoreService.getAllProductsByPageSize(this.pageSize);
  }
}
