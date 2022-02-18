import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anyNumber, anyString, instance, mock, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Product } from 'ish-core/models/product/product.model';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCard } from '../../models/cam-card/cam-card.model';
import { AddProductToCamCardModalComponent } from '../add-product-to-cam-card-modal/add-product-to-cam-card-modal.component';

import { ProductAddToCamCardComponent } from './product-add-to-cam-card.component';

describe('Product Add To Cam Card Component', () => {
  let component: ProductAddToCamCardComponent;
  let fixture: ComponentFixture<ProductAddToCamCardComponent>;
  let element: HTMLElement;
  let camCardFacadeMock: CamCardsFacade;
  let accountFacadeMock: AccountFacade;

  const camCardDetails: CamCard[] = [
    {
      name: 'testing cam cards',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemsCount: 0,
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
    camCardFacadeMock = mock(CamCardsFacade);
    accountFacadeMock = mock(AccountFacade);

    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(AddProductToCamCardModalComponent),
        MockComponent(CamfilSmallCtaModalComponent),
        MockComponent(FaIconComponent),
        ProductAddToCamCardComponent,
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) },
        { provide: AccountFacade, useFactory: () => instance(accountFacadeMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToCamCardComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    when(camCardFacadeMock.camCard$).thenReturn(of(camCardDetails));
    when(camCardFacadeMock.camCardsLoading$).thenReturn(of(false));
    when(accountFacadeMock.isLoggedIn$).thenReturn(of(false));
    component.product = { name: 'Test Product', sku: 'test sku' } as Product;
    component.quantity = 1;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should call camCardFacade to add product to cam cards', () => {
    fixture.detectChanges();
    component.addProductToCamCard({ id: 'testid', name: 'Test Cam Card' });
    verify(camCardFacadeMock.addProductToCamCard(anyString(), anyString(), anyNumber())).once();
  });

  it('should call camCardFacade to add product to new cam cards', () => {
    fixture.detectChanges();
    component.addProductToCamCard({ id: undefined, name: 'Test Cam Card' });
    verify(camCardFacadeMock.addProductToNewCamCard(anyString(), anyString(), anyNumber())).once();
  });
});
