import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anyNumber, anyString, instance, mock, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Product } from 'ish-core/models/product/product.model';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { SelectCamCardModalComponent } from '../select-cam-card-modal/select-cam-card-modal.component';

import { ProductAddToCamCardComponent } from './product-add-to-cam-card.component';

describe('Product Add To Cam Card Component', () => {
  let component: ProductAddToCamCardComponent;
  let fixture: ComponentFixture<ProductAddToCamCardComponent>;
  let element: HTMLElement;
  let camCardFacadeMock: CamCardsFacade;
  let accountFacadeMock: AccountFacade;

  const camCardDetails = [
    {
      title: 'testing cam cards',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemsCount: 0,
      public: false,
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
    camCardFacadeMock = mock(CamCardsFacade);
    accountFacadeMock = mock(AccountFacade);

    TestBed.configureTestingModule({
      declarations: [
        MockComponent(FaIconComponent),
        MockComponent(SelectCamCardModalComponent),
        ProductAddToCamCardComponent,
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) },
        { provide: AccountFacade, useFactory: () => instance(accountFacadeMock) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToCamCardComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    when(camCardFacadeMock.camCard$).thenReturn(of(camCardDetails));
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
    component.addProductToCamCard({ id: 'testid', title: 'Test Cam Card' });
    verify(camCardFacadeMock.addProductToCamCard(anyString(), anyString(), anyNumber())).once();
  });

  it('should call camCardFacade to add product to new cam cards', () => {
    fixture.detectChanges();
    component.addProductToCamCard({ id: undefined, title: 'Test Cam Card' });
    verify(camCardFacadeMock.addProductToNewCamCard(anyString(), anyString(), anyNumber())).once();
  });
});
