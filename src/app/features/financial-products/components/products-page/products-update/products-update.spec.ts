import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsUpdate } from './products-update';

describe('ProductsUpdate', () => {
  let component: ProductsUpdate;
  let fixture: ComponentFixture<ProductsUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsUpdate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
