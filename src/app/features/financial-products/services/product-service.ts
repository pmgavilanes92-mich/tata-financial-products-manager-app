import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProduct, IProductResponse } from '../models/Product';
import { Observable } from 'rxjs';

export type EntityArrayResponseType = HttpResponse<IProductResponse>;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  protected resourceUrl = ('/api/bp/products');
  constructor(private readonly _http: HttpClient) { }

  public getAllProducts(): Observable<EntityArrayResponseType> {
    return this._http.get<IProductResponse>(this.resourceUrl, { observe: 'response' });
  }
}
