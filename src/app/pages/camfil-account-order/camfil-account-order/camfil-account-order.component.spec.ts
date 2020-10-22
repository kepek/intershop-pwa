import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { DatePipe } from 'ish-core/pipes/date.pipe';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { CamfilBasketCostSummaryComponent } from 'ish-shared/components/basket/camfil-basket-cost-summary/camfil-basket-cost-summary.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { CamfilLineItemTableComponent } from 'ish-shared/components/line-item/camfil-line-item-table/camfil-line-item-table.component';

import { CamfilAccountOrderComponent } from './camfil-account-order.component';

describe('Camfil Account Order Component', () => {
  let component: CamfilAccountOrderComponent;
  let fixture: ComponentFixture<CamfilAccountOrderComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilAccountOrderComponent,
        MockComponent(AddressComponent),
        MockComponent(CamfilBasketCostSummaryComponent),
        MockComponent(CamfilLineItemTableComponent),
        MockComponent(FaIconComponent),
        MockComponent(InfoBoxComponent),
        MockPipe(DatePipe),
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilAccountOrderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.order = BasketMockData.getOrder();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be rendered without errors if no order is available', () => {
    component.order = undefined;
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render order details for the given order', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=order-summary-info]')).toBeTruthy();
    expect(element.querySelector('camfil-line-item-table')).toBeTruthy();
    expect(element.querySelector('camfil-basket-cost-summary')).toBeTruthy();
  });

  it('should display the order again link after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="order-again"]')).toBeTruthy();
  });

  it('should display the order list link after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="orders-link"]')).toBeTruthy();
  });
});
