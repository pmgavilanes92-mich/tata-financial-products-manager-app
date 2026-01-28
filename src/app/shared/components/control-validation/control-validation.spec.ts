import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlValidation } from './control-validation';

describe('ControlValidation', () => {
  let component: ControlValidation;
  let fixture: ComponentFixture<ControlValidation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlValidation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlValidation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
