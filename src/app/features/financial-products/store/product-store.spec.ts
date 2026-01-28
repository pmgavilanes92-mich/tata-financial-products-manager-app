import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { PRODUCT_FIELDS_FILTER } from '../constants/product-fields-filter';
import { IProduct } from '../models/Product';
import { IProductCreateResponse, IProductResponse } from '../models/ProductResponse';
import { ProductStoreService } from './product-store';

describe('ProductStoreService', () => {
  let service: ProductStoreService;
  let httpMock: HttpTestingController;
  let mockRouter: jest.Mocked<Router>;
  const mockFields = PRODUCT_FIELDS_FILTER;
  const mockProducts: IProduct[] = [
    {
      id: 'trj-crd-1',
      name: 'Product 1',
      logoUrl: 'assets-1.png',
      description: 'Description 1',
      date_release: '2024-01-01',
      date_revision: '2025-01-01',
    },
    {
      id: 'trj-crd-2',
      name: 'Product 2',
      logoUrl: 'assets-2.png',
      description: 'Description 2',
      date_release: '2024-02-01',
      date_revision: '2025-02-01',
    },
    {
      id: 'trj-crd-3',
      name: 'Product 3',
      logoUrl: 'assets-3.png',
      description: 'Description 3',
      date_release: '2024-03-01',
      date_revision: '2025-03-01',
    },
  ];

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductStoreService, { provide: Router, useValue: mockRouter }],
    });

    service = TestBed.inject(ProductStoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('getAllProductsByPageSize', () => {
    it('should load all products and apply pagination when pageSize is provided', (done) => {
      const pageSize = 2;
      const mockResponse: IProductResponse = { data: mockProducts };

      service.getAllProductsByPageSize(pageSize);
      expect(service.loading()).toBe(true);
      expect(service.error()).toBeNull();

      const req = httpMock.expectOne('/api/bp/products');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse, { status: 200, statusText: 'OK' });
      setTimeout(() => {
        expect(service.products()).toEqual(mockProducts);
        expect(service.products().length).toBe(3);
        expect(service.productsFilter().length).toBe(pageSize);
        expect(service.productsFilter()).toEqual(mockProducts.slice(0, pageSize));
        expect(service.loading()).toBe(false);
        expect(service.loadProducts()).toBe(true);
        done();
      }, 100);
    });

    it('should load all products without pagination when pageSize is not provided', (done) => {
      const mockResponse: IProductResponse = { data: mockProducts };

      service.getAllProductsByPageSize();

      const req = httpMock.expectOne('/api/bp/products');
      req.flush(mockResponse);

      setTimeout(() => {
        expect(service.products()).toEqual(mockProducts);
        expect(service.productsFilter()).toEqual(mockProducts);
        expect(service.productsFilter().length).toBe(mockProducts.length);
        expect(service.loading()).toBe(false);
        expect(service.loadProducts()).toBe(true);
        done();
      }, 100);
    });

    it('should handle empty products array', (done) => {
      const pageSize = 5;
      const mockResponse: IProductResponse = { data: [] };

      service.getAllProductsByPageSize(pageSize);

      const req = httpMock.expectOne('/api/bp/products');
      req.flush(mockResponse);

      setTimeout(() => {
        expect(service.products()).toEqual([]);
        expect(service.productsFilter()).toEqual([]);
        expect(service.loading()).toBe(false);
        expect(service.loadProducts()).toBe(true);
        done();
      }, 100);
    });

    it('should set error message when request fails', (done) => {
      const pageSize = 5;

      service.error.set('Previous error');
      service.getAllProductsByPageSize(pageSize);

      expect(service.error()).toBeNull();

      const req = httpMock.expectOne('/api/bp/products');
      req.error(new ProgressEvent('Network error'), { status: 500 });

      setTimeout(() => {
        expect(service.error()).toBe('No se pudo cargar la información');
        expect(service.loading()).toBe(false);
        expect(service.loadProducts()).toBe(true);
        expect(service.products()).toEqual([]);
        done();
      }, 100);
    });
  });

  describe('update', () => {
    it('should update product and navigate to home', () => {
      const product: IProduct = mockProducts[0];
      const mockResponse: IProductCreateResponse = {
        message: 'prod',
        data: product,
      };
      service.update(product);
      const req = httpMock.expectOne('/api/bp/products/'.concat(product.id));
      expect(req.request.method).toBe('PUT');
      req.flush(mockResponse, { status: 200, statusText: 'OK' });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('searchFilter', () => {
    it('should only apply pagination when value is empty', () => {
      const value = '';
      const fields = mockFields;
      const pageSize = 5;
      service.products.set(mockProducts);
      service.searchFilter(value, fields, pageSize);
      expect(service.productsFilter()).toEqual(service.products().slice(0, pageSize));
    });
    it('should filter products and apply pagination when value is not empty', () => {
      const value = 'test';
      const fields = mockFields;
      const pageSize = 5;
      service.searchFilter(value, fields, pageSize);
      service.products.set(mockProducts);
      expect(service.productsFilter()).not.toEqual(service.products().slice(0, pageSize));
    });
  });

  describe('getById', () => {
    it('should return product by id if it exists', () => {
      service.products.set(mockProducts);
      const result = service.getById('trj-crd-2');
      expect(result?.id).toBe('trj-crd-2');
    });
    it('should return null if it dont exists', () => {
      service.products.set(mockProducts);
      const result = service.getById('90Test');
      expect(result).toBeNull();
    });
  });

  describe('deleteProduct', () => {
    it('should delete product by id if it exists', () => {
      service.deleteProduct('Test', '', mockFields, 3);
      expect(service.loading()).toBe(true);
      expect(service.error()).toBeNull();
    });
  });
});
