import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPagination } from './select-pagination';

describe('SelectPagination', () => {
  let component: SelectPagination;
  let fixture: ComponentFixture<SelectPagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectPagination],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPagination);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
