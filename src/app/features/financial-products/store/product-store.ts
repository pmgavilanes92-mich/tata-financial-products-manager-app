import { inject, Injectable, signal } from "@angular/core";
import { ProductService } from "../services/product-service";
import { IProduct } from "../models/Product";
import { finalize } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ProductStoreService {
    private productService = inject(ProductService);

    products = signal<IProduct[]>([]);
    productsFilter = signal<IProduct[]>([]);
    error = signal<string | null>(null);
    loading = signal(false);

    getAllProductsByPageSize(pageSize: number) {
        this.loading.set(true);
        this.productService.getAllProducts().pipe(finalize(() => {
            this.loading.set(false);
        })).subscribe({
            next: (data) => {
                this.products.set(data.body?.data || []);
                this.productsFilter.set(this.products().slice(0, pageSize));
            },
            error: () => {
                this.error.set('No se pudo cargar la información');
            }
        });
    }

    searchFilter(value: string, fields: string[], pageSize: number): void {
        if (value) {
            const query = value.toLowerCase();
            const data = this.products();
            this.filterProductByField(data, fields, query);
        } else {
            this.productsFilter.set(this.products());
        }
        this.productsFilter.set(this.productsFilter().slice(0, pageSize));
    }

    private filterProductByField(products: IProduct[], fields: string[], query: string): void {
        this.productsFilter.set(products.filter((product: IProduct) =>
            fields.some(((f: string) =>
                String(product[f as keyof IProduct]).toLowerCase().includes(query)
            )
            )
        ));
    }
}
