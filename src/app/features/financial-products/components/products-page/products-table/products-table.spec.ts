import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ProductsTable } from './products-table';
import { ProductStoreService } from '../../../store/product-store';
import { signal } from '@angular/core';
import { IProduct } from '../../../models/Product';

describe('ProductsTable', () => {
  let component: ProductsTable;
  let fixture: ComponentFixture<ProductsTable>;
  let mockProductStoreService: Partial<ProductStoreService> & {
    searchFilter: jest.Mock;
    deleteProduct: jest.Mock;
    getById: jest.Mock;
    getAllProductsByPageSize: jest.Mock;
    productsFilter: ReturnType<typeof signal<IProduct[]>>;
    error: ReturnType<typeof signal<string | null>>;
    loading: ReturnType<typeof signal<boolean>>;
  };
  let mockRouter: jest.Mocked<Router>;

  const mockProducts: IProduct[] = [
    {
      id: 'Product1',
      name: 'Product 1',
      logoUrl: 'https://example.com/logo1.png',
      description: 'Description 1',
      date_release: '2024-01-01',
      date_revision: '2025-01-01',
    },
    {
      id: 'Product2',
      name: 'Product 2',
      logoUrl: 'https://example.com/logo2.png',
      description: 'Description 2',
      date_release: '2024-02-01',
      date_revision: '2025-02-01',
    },
  ];

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<Router>;

    mockProductStoreService = {
      searchFilter: jest.fn(),
      deleteProduct: jest.fn(),
      getById: jest.fn(),
      getAllProductsByPageSize: jest.fn(),
      productsFilter: signal<IProduct[]>([]),
      error: signal<string | null>(null),
      loading: signal<boolean>(false),
    };

    await TestBed.configureTestingModule({
      imports: [ProductsTable],
      providers: [
        { provide: ProductStoreService, useValue: mockProductStoreService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsTable);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should call getAllProductsByPageSize on ngOnInit', () => {
      fixture.detectChanges();
      expect(mockProductStoreService.getAllProductsByPageSize).toHaveBeenCalledWith(5);
    });

    it('should initialize with default values', () => {
      expect(component.pageSize).toBe(5);
      expect(component.queryFilter).toBe('');
      expect(component.showDeleteProductModal()).toBe(false);
      expect(component.showDropdownOptions()).toBeNull();
      expect(component.productToDeleteId()).toBeNull();
    });
  });

  describe('searchFilter', () => {
    it('should call searchFilter on store service with trimmed value', () => {
      const inputEvent = {
        target: { value: '  test search  ' },
      } as unknown as Event;
      component.searchFilter(inputEvent);
      expect(component.queryFilter).toBe('test search');
      expect(mockProductStoreService.searchFilter).toHaveBeenCalledWith(
        'test search',
        component.fields,
        5,
      );
    });

    it('should handle empty search value', () => {
      const inputEvent = {
        target: { value: '' },
      } as unknown as Event;
      component.searchFilter(inputEvent);
      expect(component.queryFilter).toBe('');
      expect(mockProductStoreService.searchFilter).toHaveBeenCalledWith('', component.fields, 5);
    });
  });

  describe('onPageChange', () => {
    it('should update pageSize and call searchFilter with new page size', () => {
      const newPageSize = 10;
      component.onPageChange(newPageSize);
      expect(component.pageSize).toBe(newPageSize);
      expect(mockProductStoreService.searchFilter).toHaveBeenCalledWith(
        component.queryFilter,
        component.fields,
        newPageSize,
      );
    });
  });

  describe('openCreateProductModal', () => {
    it('should navigate to create route', () => {
      component.openCreateProductModal();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/', 'create']);
    });
  });

  describe('openDropdownOptions', () => {
    it('should set showDropdownOptions with product id', () => {
      const productId = '123';
      component.openDropdownOptions(productId);
      expect(component.showDropdownOptions()).toBe(productId);
    });

    it('should replace existing dropdown when opening new one', () => {
      component.openDropdownOptions('123');
      expect(component.showDropdownOptions()).toBe('123');
      component.openDropdownOptions('456');
      expect(component.showDropdownOptions()).toBe('456');
    });
  });

  describe('openEditProductPage', () => {
    it('should navigate to edit route with product id', () => {
      const productId = '123';
      component.openEditProductPage(productId);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/edit', productId]);
    });
  });

  describe('openDeleteProductModal', () => {
    it('should open delete modal with product information when product exists', () => {
      const productId = 'Product1';
      const mockProduct = mockProducts[0];
      mockProductStoreService.getById = jest.fn().mockReturnValue(mockProduct);
      component.openDeleteProductModal(productId);
      expect(mockProductStoreService.getById).toHaveBeenCalledWith(productId);
      expect(component.productToDeleteId()).toBe(productId);
      expect(component.deleteModalMessage()).toBe(
        `¿Está seguro que desea eliminar el producto "${mockProduct.name}"?`,
      );
      expect(component.showDeleteProductModal()).toBe(true);
    });

    it('should not open modal when product does not exist', () => {
      const productId = '999';
      mockProductStoreService.getById = jest.fn().mockReturnValue(null);
      component.openDeleteProductModal(productId);
      expect(mockProductStoreService.getById).toHaveBeenCalledWith(productId);
      expect(component.showDeleteProductModal()).toBe(false);
      expect(component.productToDeleteId()).toBeNull();
    });
  });

  describe('onDeleteModalResponse', () => {
    beforeEach(() => {
      component.queryFilter = 'test';
      component.pageSize = 5;
    });

    it('should delete product when confirmed is true', () => {
      const productId = '123';
      component.productToDeleteId.set(productId);
      component.onDeleteModalResponse(true);
      expect(mockProductStoreService.deleteProduct).toHaveBeenCalledWith(
        productId,
        component.queryFilter,
        component.fields,
        component.pageSize,
      );
      expect(component.showDeleteProductModal()).toBe(false);
      expect(component.productToDeleteId()).toBeNull();
    });

    it('should not delete product when confirmed is false', () => {
      const productId = '123';
      component.productToDeleteId.set(productId);
      component.onDeleteModalResponse(false);
      expect(mockProductStoreService.deleteProduct).not.toHaveBeenCalled();
      expect(component.showDeleteProductModal()).toBe(false);
      expect(component.productToDeleteId()).toBeNull();
    });

    it('should not delete product when productToDeleteId is null', () => {
      component.productToDeleteId.set(null);
      component.onDeleteModalResponse(true);
      expect(mockProductStoreService.deleteProduct).not.toHaveBeenCalled();
      expect(component.showDeleteProductModal()).toBe(false);
    });
  });

  describe('onClickOutside', () => {
    it('should close dropdown when clicking outside and selectOptionsRef exists', () => {
      component.showDropdownOptions.set('123');
      const mockElementRef = { nativeElement: document.createElement('div') };
      (component as any).selectOptionsRef = jest.fn().mockReturnValue(mockElementRef);
      const clickEvent = new MouseEvent('click', { bubbles: true });
      component.onClickOutside(clickEvent);
      expect(component.showDropdownOptions()).toBeNull();
    });

    it('should not close dropdown when selectOptionsRef is null', () => {
      component.showDropdownOptions.set('123');
      (component as any).selectOptionsRef = jest.fn().mockReturnValue(null);
      const clickEvent = new MouseEvent('click', { bubbles: true });
      component.onClickOutside(clickEvent);
      expect(component.showDropdownOptions()).toBe('123');
    });
  });

  describe('Component signals and state', () => {
    it('should have access to productsFilter signal from store', () => {
      mockProductStoreService.productsFilter.set(mockProducts);
      fixture.detectChanges();
      expect(component.productsFilter()).toEqual(mockProducts);
    });

    it('should have access to error signal from store', () => {
      const errorMessage = 'Test error';
      mockProductStoreService.error.set(errorMessage);
      fixture.detectChanges();
      expect(component.error()).toBe(errorMessage);
    });

    it('should have access to loading signal from store', () => {
      mockProductStoreService.loading.set(true);
      fixture.detectChanges();
      expect(component.loading()).toBe(true);
    });
  });
});
