import { HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, firstValueFrom, isObservable, of } from 'rxjs';

import { ProductService } from '../services/product-service';
import { ProductExistsGuard } from './product-exists.guard';

describe('ProductExistsGuard', () => {
  let mockProductService: Partial<ProductService> & {
    verifyProductId: jest.Mock;
  };
  let mockRouter: Partial<Router> & { navigate: jest.Mock };

  beforeEach(() => {
    mockProductService = {
      verifyProductId: jest.fn(),
    };
    mockRouter = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  describe('when product ID exists in route', () => {
    it('should return true if product exists', async () => {
      const route = {
        paramMap: {
          get: jest.fn().mockReturnValue('123'),
        },
      } as unknown as ActivatedRouteSnapshot;

      mockProductService.verifyProductId = jest
        .fn()
        .mockReturnValue(of(new HttpResponse({ body: true })));
      const result = TestBed.runInInjectionContext(() =>
        ProductExistsGuard(route, {} as RouterStateSnapshot),
      );
      if (isObservable(result)) {
        const canActivate = await firstValueFrom(result);
        expect(canActivate).toBe(true);
      } else {
        expect(result).toBe(true);
      }
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should redirect and return false if product does not exist', async () => {
      const route = {
        paramMap: {
          get: jest.fn().mockReturnValue('999'),
        },
      } as unknown as ActivatedRouteSnapshot;

      mockProductService.verifyProductId = jest
        .fn()
        .mockReturnValue(of(new HttpResponse({ body: false })));
      const result = TestBed.runInInjectionContext(() =>
        ProductExistsGuard(route, {} as RouterStateSnapshot),
      );
      if (typeof result === 'boolean') {
        expect(result).toBe(false);
      } else {
        const canActivate = await firstValueFrom(result as Observable<boolean>);
        expect(canActivate).toBe(false);
      }
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('when product ID is missing', () => {
    it('should redirect and return false', () => {
      const route = {
        paramMap: {
          get: jest.fn().mockReturnValue(null),
        },
      } as unknown as ActivatedRouteSnapshot;
      const result = TestBed.runInInjectionContext(() =>
        ProductExistsGuard(route, {} as RouterStateSnapshot),
      );
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
      expect(mockProductService.verifyProductId).not.toHaveBeenCalled();
    });
  });

  describe('when service throws error', () => {
    it('should redirect and return false', async () => {
      const route = {
        paramMap: {
          get: jest.fn().mockReturnValue('123'),
        },
      } as unknown as ActivatedRouteSnapshot;

      mockProductService.verifyProductId = jest
        .fn()
        .mockReturnValue(of(new Error('Service error')));
      const result = TestBed.runInInjectionContext(() =>
        ProductExistsGuard(route, {} as RouterStateSnapshot),
      );
      if (typeof result === 'boolean') {
        expect(result).toBe(false);
      } else {
        const canActivate = await firstValueFrom(result as Observable<boolean>);
        expect(canActivate).toBe(false);
      }
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
