import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProduct } from '../models/Product';
import { Observable } from 'rxjs';
import { IProductCreateResponse, IProductResponse } from '../models/ProductResponse';

export type EntityArrayResponseType = HttpResponse<IProductResponse>;
export type EntityResponseType = HttpResponse<IProductCreateResponse>;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  protected resourceUrl = ('/api/bp/products');
  constructor(private readonly _http: HttpClient) { }

  public getAllProducts(): Observable<EntityArrayResponseType> {
    return this._http.get<IProductResponse>(this.resourceUrl, { observe: 'response' });
  }

  public create(product: IProduct): Observable<EntityResponseType> {
    return this._http.post<IProductCreateResponse>(this.resourceUrl, product, { observe: 'response' });
  }

  public verifyProductId(id: string): Observable<HttpResponse<boolean>> {
    return this._http.get<boolean>(`${this.resourceUrl}/verification/${id}`, { observe: 'response' });
  }
}
