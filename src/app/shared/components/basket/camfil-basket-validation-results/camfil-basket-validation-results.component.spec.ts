import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { CamfilSlugifyPipe } from 'ish-core/pipes/camfil-slugify.pipe';
import { BasketValidationItemsComponent } from 'ish-shared/components/basket/basket-validation-items/basket-validation-items.component';
import { BasketValidationProductsComponent } from 'ish-shared/components/basket/basket-validation-products/basket-validation-products.component';

import { CamfilBasketValidationResultsComponent } from './camfil-basket-validation-results.component';

describe('Camfil Basket Validation Results Component', () => {
  let component: CamfilBasketValidationResultsComponent;
  let fixture: ComponentFixture<CamfilBasketValidationResultsComponent>;
  let element: HTMLElement;
  let checkoutFacadeMock: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacadeMock = mock(CheckoutFacade);
    when(checkoutFacadeMock.basketValidationResults$).thenReturn(of(undefined));

    await TestBed.configureTestingModule({
      declarations: [
        CamfilBasketValidationResultsComponent,
        MockComponent(BasketValidationItemsComponent),
        MockComponent(BasketValidationProductsComponent),
        MockPipe(CamfilSlugifyPipe),
      ],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacadeMock) }],
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
