import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilBasketValidationResultsComponent } from './camfil-basket-validation-results.component';

describe('Camfil Basket Validation Results Component', () => {
  let component: CamfilBasketValidationResultsComponent;
  let fixture: ComponentFixture<CamfilBasketValidationResultsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilBasketValidationResultsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilBasketValidationResultsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
