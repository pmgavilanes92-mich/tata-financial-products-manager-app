import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ControlValidation } from '../../../../../shared/components/control-validation/control-validation';
import { NgClass } from '@angular/common';
import { ProductStoreService } from '../../../store/product-store';
import { IProduct } from '../../../models/Product';
import { FormSkeleton } from '../../../../../shared/components/skeletons/form-skeleton/form-skeleton';

@Component({
  selector: 'app-products-update',
  templateUrl: './products-update.html',
  styleUrl: './products-update.css',
  imports: [ReactiveFormsModule, ControlValidation, NgClass, FormSkeleton],
})
export class ProductsUpdate implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly productsStoreService = inject(ProductStoreService);
  product: IProduct | null = null;

  isEditing = false;
  error = this.productsStoreService.error;
  loading = this.productsStoreService.loading;
  productForm = this.createForm();

  ngOnInit(): void {
    this.setProductUpdateData();
  }

  controlIsInvalid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      const product = this.getProductByForm();
      if (this.isEditing) {
        this.productsStoreService.update(product);
      } else {
        this.productsStoreService.save(product);
      }
    }
  }

  resetProduct(): void {
    if (this.isEditing) {
      this.patchProduct(this.product);
    } else {
      this.productForm.reset();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      id: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logoUrl: ['', [Validators.required]],
      dateRelease: [null, [Validators.required]],
      dateRevision: [null, [Validators.required]],
    });
  }

  private getProductByForm(): IProduct {
    const productData = this.productForm.value;
    return {
      ...productData,
      logo: productData.logoUrl,
      date_release: productData.dateRelease,
      date_revision: productData.dateRevision,
    };
  }

  private setProductUpdateData(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      const productEdit = this.productsStoreService.getById(id);
      this.patchProduct(productEdit);
    }
  }

  private patchProduct(product: IProduct | null): void {
    if (product) {
      this.product = product;
      this.productForm.patchValue({
        id: product.id,
        name: product.name,
        description: product.description,
        logoUrl: product.logoUrl,
        dateRelease: product.date_release,
        dateRevision: product.date_revision,
      });
    }
  }
}
