import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { CamfilCounterComponent } from 'ish-shared/forms/components/camfil-counter/camfil-counter.component';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { ArticleDetailsComponent } from '../../../shared/add-product-to-cam-card-modal/article-details/article-details.component';

import { ModalAddNewProductComponent } from './modal-add-new-product.component';

describe('Modal Add New Product Component', () => {
  let component: ModalAddNewProductComponent;
  let fixture: ComponentFixture<ModalAddNewProductComponent>;
  let element: HTMLElement;
  let shoppingFacadeMock: ShoppingFacade;

  beforeEach(async () => {
    const camCardsFacade = mock(CamCardsFacade);
    when(camCardsFacade.currentCamCard$).thenReturn(EMPTY);
    shoppingFacadeMock = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [
        ArticleDetailsComponent,
        CamfilCounterComponent,
        CamfilErrorComponent,
        CamfilMaxLengthAttributeCreateDirective,
        CamfilProductQuantityComponent,
        MockComponent(CamfilLoadingComponent),
        ModalAddNewProductComponent,
      ],
      providers: [
        { provide: CamCardsFacade, useFactory: () => instance(camCardsFacade) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) },
        { provide: CheckoutFacade, useFactory: () => instance(CheckoutFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddNewProductComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(shoppingFacadeMock.basketAddresses$).thenReturn(of([]));
    when(shoppingFacadeMock.productUpdated$).thenReturn(of(false));
    when(shoppingFacadeMock.productAdded$).thenReturn(of(false));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
