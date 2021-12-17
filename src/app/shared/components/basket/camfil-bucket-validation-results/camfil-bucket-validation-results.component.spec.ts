import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { CamfilSlugifyPipe } from 'ish-core/pipes/camfil-slugify.pipe';
import { BasketValidationItemsComponent } from 'ish-shared/components/basket/basket-validation-items/basket-validation-items.component';
import { BasketValidationProductsComponent } from 'ish-shared/components/basket/basket-validation-products/basket-validation-products.component';

import { CamfilBucketValidationResultsComponent } from './camfil-bucket-validation-results.component';

describe('Camfil Bucket Validation Results Component', () => {
  let component: CamfilBucketValidationResultsComponent;
  let fixture: ComponentFixture<CamfilBucketValidationResultsComponent>;
  let element: HTMLElement;
  let checkoutFacadeMock: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacadeMock = mock(CheckoutFacade);
    when(checkoutFacadeMock.basketValidationResults$).thenReturn(of(undefined));
    when(checkoutFacadeMock.buckets$).thenReturn(of([]));

    await TestBed.configureTestingModule({
      declarations: [
        CamfilBucketValidationResultsComponent,
        MockComponent(BasketValidationItemsComponent),
        MockComponent(BasketValidationProductsComponent),
        MockPipe(CamfilSlugifyPipe),
      ],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilBucketValidationResultsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
