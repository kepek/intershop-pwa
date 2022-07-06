import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CamfilChannelToggleDirective } from 'camfil-pwa/directives/camfil-channel-toggle.directive';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { Product } from 'ish-core/models/product/product.model';
import { User } from 'ish-core/models/user/user.model';
import { AddressSortPipe } from 'ish-core/pipes/camfil-address-sort.pipe';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CamfilCamCardModalComponent } from 'ish-shared/components/common/camfil-cam-card-modal/camfil-cam-card-modal.component';
import { CamfilCityFieldComponent } from 'ish-shared/components/common/camfil-city-field/camfil-city-field.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { ZipCodeComponent } from 'ish-shared/components/zip-code/zip-code.component';
import { CamfilCounterComponent } from 'ish-shared/forms/components/camfil-counter/camfil-counter.component';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { ArticleDetailsComponent } from '../article-details/article-details.component';

import { CreateProductCamCardModalComponent } from './create-product-cam-card-modal.component';

describe('Create Product Cam Card Modal Component', () => {
  let component: CreateProductCamCardModalComponent;
  let fixture: ComponentFixture<CreateProductCamCardModalComponent>;
  let element: HTMLElement;
  let camCardFacadeMock: CamCardsFacade;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    camCardFacadeMock = mock(CamCardsFacade);
    accountFacade = mock(AccountFacade);

    await TestBed.configureTestingModule({
      declarations: [
        ArticleDetailsComponent,
        CamfilCamCardModalComponent,
        CamfilCounterComponent,
        CamfilErrorComponent,
        CamfilMaxLengthAttributeCreateDirective,
        CamfilProductQuantityComponent,
        CreateProductCamCardModalComponent,
        MockComponent(CamfilCityFieldComponent),
        MockComponent(CamfilLoadingComponent),
        MockComponent(ZipCodeComponent),
        MockDirective(CamfilChannelToggleDirective),
        MockPipe(AddressSortPipe),
      ],
      imports: [CoreStoreModule.forTesting(), RouterTestingModule],
      providers: [{ provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductCamCardModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.product = { name: 'Test Product', sku: 'test sku', minOrderQuantity: 1 } as Product;
    when(accountFacade.user$).thenReturn(of({} as User));
    when(camCardFacadeMock.customers$).thenReturn(of([]));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
