import { inject, Injectable, signal } from "@angular/core";
import { ProductService } from "../services/product-service";
import { IProduct } from "../models/Product";
import { finalize } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ProductStoreService {
    private productService = inject(ProductService);
    products = signal<IProduct[]>([]);
    error = signal<string | null>(null);
    loading = signal(false);

    getAllProducts() {
        this.loading.set(true);
        this.productService.getAllProducts().pipe(finalize(() => {
            this.loading.set(false);
        })).subscribe({
            next: (data) => this.products.set(data.body?.data || []),
            error: () => {
                this.error.set('No se pudo cargar la información');
            }
        });
    }
}
