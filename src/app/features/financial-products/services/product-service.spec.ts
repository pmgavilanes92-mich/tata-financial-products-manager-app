import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IProduct } from '../models/Product';
import { IProductCreateResponse, IProductResponse } from '../models/ProductResponse';
import { ProductService } from './product-service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const baseUrl = '/api/bp/products';

  const mockProduct: IProduct = {
    id: 'trj-crd',
    name: 'Tarjetas de Crédito',
    logoUrl:
      'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
    description: 'Tarjeta de consumo bajo la modalidad de crédito',
    date_release: '2024-01-01',
    date_revision: '2025-01-01',
  };

  const mockProductResponse: IProductResponse = {
    data: [mockProduct],
  };

  const mockCreateResponse: IProductCreateResponse = {
    message: 'Product created successfully',
    data: mockProduct,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllProducts', () => {
    it('should return an Observable<EntityArrayResponseType>', () => {
      service.getAllProducts().subscribe((response) => {
        expect(response.body).toEqual(mockProductResponse);
        expect(response.status).toBe(200);
      });
      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockProductResponse, { status: 200, statusText: 'OK' });
    });
  });

  describe('create', () => {
    it('should create a product and return Observable<EntityResponseType>', () => {
      const newProduct: IProduct = {
        id: 'trj-crd-456',
        name: 'Tarjeta de Crédito 2',
        logoUrl: 'assets-1.png',
        description: 'Consumo bajo la modalidad de crédito',
        date_release: '2024-02-01',
        date_revision: '2025-02-01',
      };

      service.create(newProduct).subscribe((response) => {
        expect(response.body).toEqual(mockCreateResponse);
        expect(response.status).toBe(201);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProduct);
      req.flush(mockCreateResponse, { status: 201, statusText: 'Created' });
    });
  });

  describe('verifyProductId', () => {
    it('should verify product ID and return Observable<HttpResponse<boolean>>', () => {
      const productId = 'trj-crd';
      const verificationUrl = `${baseUrl}/verification/${productId}`;

      service.verifyProductId(productId).subscribe((response) => {
        expect(response.body).toBe(true);
        expect(response.status).toBe(200);
      });

      const req = httpMock.expectOne(verificationUrl);
      expect(req.request.method).toBe('GET');
      req.flush(true, { status: 200, statusText: 'OK' });
    });
  });

  describe('update', () => {
    it('should update a product and return Observable<EntityResponseType>', () => {
      const productId = 'trj-crd-789';
      const updatedProduct: IProduct = {
        ...mockProduct,
        id: productId,
        name: 'Updated Product Name',
      };

      service.update(updatedProduct).subscribe((response) => {
        expect(response.body).toEqual(mockCreateResponse);
        expect(response.status).toBe(200);
      });

      const req = httpMock.expectOne(`${baseUrl}/${updatedProduct.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProduct);
      req.flush(mockCreateResponse, { status: 200, statusText: 'OK' });
    });
  });

  describe('delete', () => {
    it('should delete a product and return Observable<HttpResponse<void>>', () => {
      const productId = 'trj-crd';
      const deleteUrl = `${baseUrl}/${productId}`;

      service.delete(productId).subscribe((response) => {
        expect(response.body).toBeNull();
        expect(response.status).toBe(200);
      });

      const req = httpMock.expectOne(deleteUrl);
      expect(req.request.method).toBe('DELETE');
      req.flush(null, { status: 200, statusText: 'OK' });
    });
  });
});
