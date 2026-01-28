import { IProduct } from "./Product"

export interface IProductResponse {
    data: IProduct[];
}

export interface IProductCreateResponse {
    message: string;
    data: IProduct;
}
