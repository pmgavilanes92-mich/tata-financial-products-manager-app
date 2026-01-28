import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { ProductsUpdate } from './products-update';
import { ProductStoreService } from '../../../store/product-store';
import { IProduct } from '../../../models/Product';

describe('ProductsUpdate', () => {
  let component: ProductsUpdate;
  let fixture: ComponentFixture<ProductsUpdate>;
  let mockProductStoreService: Partial<ProductStoreService> & {
    save: jest.Mock;
    update: jest.Mock;
    getById: jest.Mock;
    error: ReturnType<typeof signal<string | null>>;
    loading: ReturnType<typeof signal<boolean>>;
  };
  let mockRouter: Partial<Router> & { navigate: jest.Mock };
  let mockActivatedRoute: any;

  const mockProduct: IProduct = {
    id: 'TEST123',
    name: 'Tarjetas de Crédito',
    description: 'Tarjeta de consumo bajo la modalidad de crédito',
    logoUrl:
      'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
    date_release: '2024-01-01',
    date_revision: '2025-01-01',
  };

  beforeEach(async () => {
    mockProductStoreService = {
      save: jest.fn(),
      update: jest.fn(),
      getById: jest.fn(),
      error: signal<string | null>(null),
      loading: signal<boolean>(false),
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue(null),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [ProductsUpdate],
      providers: [
        { provide: ProductStoreService, useValue: mockProductStoreService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize in create mode when no id is provided', () => {
      expect(component.isEditing).toBe(false);
      expect(component.productForm).toBeDefined();
    });

    it('should initialize in edit mode when id is provided', () => {
      (mockActivatedRoute.snapshot.paramMap.get as jest.Mock).mockReturnValue('TEST123');
      (mockProductStoreService.getById as jest.Mock).mockReturnValue(mockProduct);
      fixture = TestBed.createComponent(ProductsUpdate);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.isEditing).toBe(true);
      expect(mockProductStoreService.getById).toHaveBeenCalledWith('TEST123');
    });

    it('should patch form values when editing', () => {
      (mockActivatedRoute.snapshot.paramMap.get as jest.Mock).mockReturnValue('TEST123');
      (mockProductStoreService.getById as jest.Mock).mockReturnValue(mockProduct);

      fixture = TestBed.createComponent(ProductsUpdate);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.productForm.get('id')?.value).toBe('TEST123');
      expect(component.productForm.get('name')?.value).toBe('Tarjetas de Crédito');
      expect(component.productForm.get('description')?.value).toBe(
        'Tarjeta de consumo bajo la modalidad de crédito',
      );
      expect(component.productForm.get('logoUrl')?.value).toBe(
        'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
      );
      expect(component.productForm.get('dateRelease')?.value).toBe('2024-01-01');
      expect(component.productForm.get('dateRevision')?.value).toBe('2025-01-01');
    });
  });

  describe('Form Validation', () => {
    it('should have required validators on all fields', () => {
      const idControl = component.productForm.get('id');
      const nameControl = component.productForm.get('name');
      const descriptionControl = component.productForm.get('description');
      const logoUrlControl = component.productForm.get('logoUrl');
      const dateReleaseControl = component.productForm.get('dateRelease');
      const dateRevisionControl = component.productForm.get('dateRevision');

      expect(idControl?.hasError('required')).toBe(true);
      expect(nameControl?.hasError('required')).toBe(true);
      expect(descriptionControl?.hasError('required')).toBe(true);
      expect(logoUrlControl?.hasError('required')).toBe(true);
      expect(dateReleaseControl?.hasError('required')).toBe(true);
      expect(dateRevisionControl?.hasError('required')).toBe(true);
    });

    it('should validate id max length', () => {
      const idControl = component.productForm.get('id');
      idControl?.setValue('ABCDEFGHIJK');
      expect(idControl?.hasError('maxlength')).toBe(true);
    });

    it('should validate name max length', () => {
      const nameControl = component.productForm.get('name');
      nameControl?.setValue('A'.repeat(101));
      expect(nameControl?.hasError('maxlength')).toBe(true);
    });

    it('should validate description max length', () => {
      const descriptionControl = component.productForm.get('description');
      descriptionControl?.setValue('A'.repeat(201));
      expect(descriptionControl?.hasError('maxlength')).toBe(true);
    });

    it('should be valid when all fields are correctly filled', () => {
      component.productForm.patchValue({
        id: 'trj-crd',
        name: ' Tarjetas de Crédito',
        description: 'Targetas de credito bajo la modalidad de credito',
        logoUrl:
          'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
        dateRelease: '2024-01-01',
        dateRevision: '2025-01-01',
      });

      expect(component.productForm.valid).toBe(true);
    });
  });

  describe('saveProduct', () => {
    it('should not save when form is invalid', () => {
      component.saveProduct();

      expect(mockProductStoreService.save).not.toHaveBeenCalled();
      expect(mockProductStoreService.update).not.toHaveBeenCalled();
    });

    it('should call save when form is valid and not editing', () => {
      component.isEditing = false;
      component.productForm.patchValue({
        id: 'TEST123',
        name: 'Tarjetas de Crédito',
        description: 'Tarjeta de consumo bajo la modalidad de crédito',
        logoUrl:
          'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
        dateRelease: '2024-01-01',
        dateRevision: '2025-01-01',
      });

      component.saveProduct();

      expect(mockProductStoreService.save).toHaveBeenCalled();
      expect(mockProductStoreService.update).not.toHaveBeenCalled();
    });

    it('should call update when form is valid and editing', () => {
      component.isEditing = true;
      component.productForm.patchValue({
        id: 'TEST123',
        name: 'Tarjetas de Crédito',
        description: 'Tarjeta de consumo bajo la modalidad de crédito',
        logoUrl:
          'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
        dateRelease: '2024-01-01',
        dateRevision: '2025-01-01',
      });

      component.saveProduct();

      expect(mockProductStoreService.update).toHaveBeenCalled();
      expect(mockProductStoreService.save).not.toHaveBeenCalled();
    });
  });

  describe('resetProduct', () => {
    it('should reset form when not editing', () => {
      component.isEditing = false;
      component.productForm.patchValue({
        id: 'TEST123',
        name: 'Tarjetas de Crédito',
        description: 'Tarjeta de consumo bajo la modalidad de crédito',
        logoUrl:
          'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
        dateRelease: '2024-01-01',
        dateRevision: '2025-01-01',
      });

      component.resetProduct();

      expect(component.productForm.get('id')?.value).toBeNull();
      expect(component.productForm.get('name')?.value).toBeNull();
    });

    it('should patch product values when editing', () => {
      component.isEditing = true;
      (component as any).product = mockProduct;
      component.productForm.patchValue({
        name: 'Changed Name',
      });

      component.resetProduct();

      expect(component.productForm.get('name')?.value).toBe('Tarjetas de Crédito');
      expect(component.productForm.get('id')?.value).toBe('TEST123');
    });
  });

  describe('Error and Loading states', () => {
    it('should display error from store', () => {
      mockProductStoreService.error.set('Test error message');
      fixture.detectChanges();

      expect(component.error()).toBe('Test error message');
    });

    it('should display loading state from store', () => {
      mockProductStoreService.loading.set(true);
      fixture.detectChanges();

      expect(component.loading()).toBe(true);
    });
  });
});
