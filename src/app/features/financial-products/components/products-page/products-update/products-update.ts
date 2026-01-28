import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ControlValidation } from '../../../../../shared/components/control-validation/control-validation';
import { NgClass } from '@angular/common';
import { ProductStoreService } from '../../../store/product-store';

@Component({
  selector: 'app-products-update',
  templateUrl: './products-update.html',
  styleUrl: './products-update.css',
    imports: [ReactiveFormsModule, ControlValidation, NgClass],
})
export class ProductsUpdate implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private productsStoreService = inject(ProductStoreService);
  private isEditing = false;

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
      const productData = this.productForm.value;
      const product = {
        ...productData,
        logo: productData.logoUrl,
        date_release: productData.dateRelease,
        date_revision: productData.dateRevision
      }
      this.productsStoreService.save(product);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      id: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['',  [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['',  [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logoUrl: ['', [Validators.required]],
      dateRelease: [null, [Validators.required,  ]],
      dateRevision: [null, [Validators.required]]
    });
  }

  private setProductUpdateData(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
    }
  }
}
