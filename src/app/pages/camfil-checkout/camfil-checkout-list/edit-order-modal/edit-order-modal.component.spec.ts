import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CamfilCamCardModalComponent } from 'ish-shared/components/common/camfil-cam-card-modal/camfil-cam-card-modal.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrderFormComponent } from '../../../../extensions/cam-cards/shared/add-to-cart-modal/create-order-modal/order-form/order-form.component';

import { EditOrderModalComponent } from './edit-order-modal.component';

describe('Edit Order Modal Component', () => {
  let component: EditOrderModalComponent;
  let fixture: ComponentFixture<EditOrderModalComponent>;
  let element: HTMLElement;
  let shoppingFacadeMock: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacadeMock = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [
        CamfilCamCardModalComponent,
        CamfilErrorComponent,
        EditOrderModalComponent,
        MockComponent(LoadingComponent),
        OrderFormComponent,
      ],
      providers: [
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) },
        { provide: CheckoutFacade, useFactory: () => instance(CheckoutFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrderModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.order = {
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
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
