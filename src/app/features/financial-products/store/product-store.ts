import { inject, Injectable, signal } from "@angular/core";
import { ProductService } from "../services/product-service";
import { IProduct } from "../models/Product";
import { finalize } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class ProductStoreService {
    private productService = inject(ProductService);
    private router = inject(Router);

    products = signal<IProduct[]>([]);
    productsFilter = signal<IProduct[]>([]);

    product = signal<IProduct | null>(null);

    error = signal<string | null>(null);
    loading = signal(false);
    isProductIdValid = signal(false);


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

    save(product: IProduct): void {
        this.loading.set(true);
        this.verifyAndCreateProduct(product.id, () => {
            this.productService.create(product).pipe(finalize(() => {
                this.loading.set(false);
            })).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: () => {
                    this.error.set('Error al guardar el producto');
                }
            });
        });
    }

    private verifyAndCreateProduct(id: string, create: () => void): void {
        this.productService.verifyProductId(id).pipe(finalize(() => {
            if (this.isProductIdValid()) {
                this.error.set('El ID del producto ya existe');
                this.loading.set(false);
            } else {
                create();
                this.error.set(null);
            }
        })).subscribe(res => {
            this.isProductIdValid.set(res.body ?? false)
        });
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
