export interface IProductResponse {
    data: IProduct[];
}
export interface IProduct {
    id:number;
    name:string;
    logoUrl:string;
    description:string;
    date_release: string;
    date_revision: string;
}
