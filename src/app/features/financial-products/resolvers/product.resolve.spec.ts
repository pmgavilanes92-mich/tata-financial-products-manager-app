import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { ProductStoreService } from '../store/product-store';
import { ProductResolve } from './product.resolve';

describe('ProductResolve', () => {
  let mockProductStoreService: Partial<ProductStoreService> & {
    getAllProductsByPageSize: jest.Mock;
    isLoadAllProducts: jest.Mock;
  };

  beforeEach(() => {
    mockProductStoreService = {
      getAllProductsByPageSize: jest.fn(),
      isLoadAllProducts: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: ProductStoreService, useValue: mockProductStoreService }],
    });
  });

  const executeResolver = () =>
    TestBed.runInInjectionContext(() =>
      ProductResolve({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  describe('when isLoadAllProducts is true', () => {
    it('should return true and not call getAllProductsByPageSize', () => {
      mockProductStoreService.isLoadAllProducts = jest.fn().mockReturnValue(true);
      const result = executeResolver();
      expect(mockProductStoreService.isLoadAllProducts).toHaveBeenCalled();
      expect(mockProductStoreService.getAllProductsByPageSize).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('when isLoadAllProducts is false', () => {
    it('should return true and call getAllProductsByPageSize', () => {
      mockProductStoreService.isLoadAllProducts = jest.fn().mockReturnValue(false);
      const result = executeResolver();
      expect(mockProductStoreService.isLoadAllProducts).toHaveBeenCalled();
      expect(mockProductStoreService.getAllProductsByPageSize).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
