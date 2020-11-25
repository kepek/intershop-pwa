import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { anything, capture, instance, mock, spy, verify } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { CamfilProductAddToBasketComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket.component';

import { CamCard } from '../../../models/cam-card/cam-card.model';
import { CamCardProductCommentComponent } from '../../../shared/cam-card-product-comment/cam-card-product-comment.component';
import { AccountCamCardDetailLineItemComponent } from '../../account-cam-card-detail/account-cam-card-detail-line-item/account-cam-card-detail-line-item.component';
import { AccountCamCardToolbarComponent } from '../account-cam-card-toolbar/account-cam-card-toolbar.component';
import { CamfilCamCardsSearchComponent } from '../camfil-cam-cards-search/camfil-cam-cards-search.component';

import { AccountCamCardListComponent } from './account-cam-card-list.component';

describe('Account Cam Card List Component', () => {
  let component: AccountCamCardListComponent;
  let fixture: ComponentFixture<AccountCamCardListComponent>;
  let element: HTMLElement;
  let shoppingFacadeMock: ShoppingFacade;

  const camCardDetails: CamCard[] = [
    {
      name: 'testing cam cards',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemsCount: 1,
      camCardItems: [
        {
          id: '12345',
          quantity: 1,
          creationDate: 123124125,
          product: {
            sku: '1234',
          },
        },
      ],
    },
    {
      name: 'testing cam cards 2',
      id: '.AsdHS18FIAAAFuNiUBWx0d',
      itemsCount: 0,
    },
    {
      name: 'new cam cards',
      id: 'new cam cards id',
      itemsCount: 0,
    },
  ];

  beforeEach(async () => {
    shoppingFacadeMock = mock(ShoppingFacade);
    await TestBed.configureTestingModule({
      declarations: [
        AccountCamCardListComponent,
        MockComponent(AccountCamCardDetailLineItemComponent),
        MockComponent(AccountCamCardToolbarComponent),
        MockComponent(CamCardProductCommentComponent),
        MockComponent(CamfilCamCardsSearchComponent),
        MockComponent(CamfilProductAddToBasketComponent),
        MockComponent(FaIconComponent),
        MockComponent(LoadingComponent),
        MockComponent(ModalDialogComponent),
        MockPipe(DatePipe),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) }, provideMockStore({})],
    }).compileComponents();
  });

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

  // TODO: improve, change or delete when NEW order/addToCartWay will be inProgress
  it('should trigger add product to cart with right sku', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
    component.camCards = camCardDetails;
    component.addCamCardToCart(camCardDetails[0]);

    verify(shoppingFacadeMock.addProductToBasket(anything(), anything())).once();
    expect(capture(shoppingFacadeMock.addProductToBasket).last()).toMatchInlineSnapshot(`
      Array [
        "1234",
        1,
      ]
    `);
  });

  // TODO: improve, change or delete when NEW order/addToCartWay will be inProgress
  it('should not trigger add to product if camCard doesnt have items', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
    component.camCards = camCardDetails;
    component.addCamCardToCart(camCardDetails[1]);

    verify(shoppingFacadeMock.addProductToBasket(anything(), anything())).never();
  });
});
