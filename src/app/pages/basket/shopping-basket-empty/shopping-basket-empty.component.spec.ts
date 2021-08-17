import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { BasketInfoComponent } from 'ish-shared/components/basket/basket-info/basket-info.component';
import { BasketValidationResultsComponent } from 'ish-shared/components/basket/basket-validation-results/basket-validation-results.component';
import { CamfilErrorMessageComponent } from 'ish-shared/components/common/camfil-error-message/camfil-error-message.component';

import { ShoppingBasketEmptyComponent } from './shopping-basket-empty.component';

describe('Shopping Basket Empty Component', () => {
  let component: ShoppingBasketEmptyComponent;
  let fixture: ComponentFixture<ShoppingBasketEmptyComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(BasketInfoComponent),
        MockComponent(BasketValidationResultsComponent),
        MockComponent(CamfilErrorMessageComponent),
        ShoppingBasketEmptyComponent,
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingBasketEmptyComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not render an error if no error occurs', () => {
    fixture.detectChanges();
    expect(element.querySelector('[role="alert"]')).toBeFalsy();
  });

  it('should render an error if an error occurs', () => {
    component.error = makeHttpError({ status: 404 });

    fixture.detectChanges();
    expect(element.querySelector('camfil-error-message')).toBeTruthy();
  });
});
