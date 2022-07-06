import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CamfilChannelToggleDirective } from 'camfil-pwa/directives/camfil-channel-toggle.directive';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AddressSortPipe } from 'ish-core/pipes/camfil-address-sort.pipe';
import { CamfilContactSortPipe } from 'ish-core/pipes/camfil-contact-sort.pipe';
import { CamfilCamCardModalComponent } from 'ish-shared/components/common/camfil-cam-card-modal/camfil-cam-card-modal.component';
import { CamfilCityFieldComponent } from 'ish-shared/components/common/camfil-city-field/camfil-city-field.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { ZipCodeComponent } from 'ish-shared/components/zip-code/zip-code.component';

import { OrderFormComponent } from '../../../../extensions/cam-cards/shared/add-product-to-cart-modal/create-order-product-modal/order-form/order-form.component';

import { CamfilEditOrderModalComponent } from './camfil-edit-order-modal.component';

describe('Camfil Edit Order Modal Component', () => {
  let component: CamfilEditOrderModalComponent;
  let fixture: ComponentFixture<CamfilEditOrderModalComponent>;
  let element: HTMLElement;
  let shoppingFacadeMock: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacadeMock = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [
        CamfilCamCardModalComponent,
        CamfilEditOrderModalComponent,
        CamfilErrorComponent,
        CamfilMaxLengthAttributeCreateDirective,
        MockComponent(CamfilCityFieldComponent),
        MockComponent(CamfilLoadingComponent),
        MockComponent(ZipCodeComponent),
        MockDirective(CamfilChannelToggleDirective),
        MockPipe(AddressSortPipe),
        MockPipe(CamfilContactSortPipe),
        OrderFormComponent,
      ],
      providers: [
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) },
        { provide: CheckoutFacade, useFactory: () => instance(CheckoutFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilEditOrderModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.order = {
      contactPerson: { firstName: 'test' },
      basket: 'test_basketId',
      id: 'test_id',
      customer: {
        id: 'test_customerId',
        customerNo: 'test_customerNo',
      },
      contacts: [
        {
          firstName: 'test',
          lastName: 'test',
        },
      ],
      totals: undefined,
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
