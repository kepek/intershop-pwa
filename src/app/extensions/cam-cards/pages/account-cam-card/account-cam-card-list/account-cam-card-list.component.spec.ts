import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { anything, capture, instance, mock, spy, verify } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { CamfilProductAddToBasketComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket.component';

import { AccountCamCardListComponent } from './account-cam-card-list.component';

describe('Account Cam Card List Component', () => {
  let component: AccountCamCardListComponent;
  let fixture: ComponentFixture<AccountCamCardListComponent>;
  let element: HTMLElement;
  let shoppingFacadeMock: ShoppingFacade;

  const camCardDetails = [
    {
      title: 'testing cam cards',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemsCount: 1,
      public: false,
      items: [
        {
          sku: '1234',
          id: '12345',
          creationDate: 123124125,
          desiredQuantity: {
            value: 1,
          },
        },
      ],
    },
    {
      title: 'testing cam cards 2',
      id: '.AsdHS18FIAAAFuNiUBWx0d',
      itemsCount: 0,
      public: false,
    },
    {
      title: 'new cam cards',
      id: 'new cam cards id',
      itemsCount: 0,
      public: false,
    },
  ];

  beforeEach(async(() => {
    shoppingFacadeMock = mock(ShoppingFacade);
    TestBed.configureTestingModule({
      declarations: [
        AccountCamCardListComponent,
        MockComponent(CamfilProductAddToBasketComponent),
        MockComponent(FaIconComponent),
        MockComponent(ModalDialogComponent),
        MockPipe(DatePipe),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCamCardListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit delete id when delete is called', () => {
    const emitter = spy(component.deleteCamCard);

    component.delete('deleteId');

    verify(emitter.emit('deleteId')).once();
  });

  it('should trigger add product to cart with right sku', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
    component.camCards = camCardDetails;
    component.addCamCardToCart('.SKsEQAE4FIAAAFuNiUBWx0d');

    verify(shoppingFacadeMock.addProductToBasket(anything(), anything())).once();
    expect(capture(shoppingFacadeMock.addProductToBasket).last()).toMatchInlineSnapshot(`
      Array [
        "1234",
        1,
      ]
    `);
  });

  it('should not trigger add to product if camCard doesnt have items', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
    component.camCards = camCardDetails;
    component.addCamCardToCart('.AsdHS18FIAAAFuNiUBWx0d');

    verify(shoppingFacadeMock.addProductToBasket(anything(), anything())).never();
  });
});
