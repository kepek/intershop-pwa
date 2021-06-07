import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Product } from 'ish-core/models/product/product.model';
import { AddressSortPipe } from 'ish-core/pipes/camfil-address-sort.pipe';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CamfilCamCardModalComponent } from 'ish-shared/components/common/camfil-cam-card-modal/camfil-cam-card-modal.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { ZipCodeComponent } from 'ish-shared/components/zip-code/zip-code.component';
import { CamfilCounterComponent } from 'ish-shared/forms/components/camfil-counter/camfil-counter.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { CamCardsFacade } from '../../facades/cam-cards.facade';

import { ArticleDetailsComponent } from './article-details/article-details.component';
import { CreateCamCardModalComponent } from './create-cam-card-modal/create-cam-card-modal.component';
import { SelectCamCardModalComponent } from './select-cam-card-modal.component';

describe('Select Cam Card Modal Component', () => {
  let component: SelectCamCardModalComponent;
  let fixture: ComponentFixture<SelectCamCardModalComponent>;
  let element: HTMLElement;
  let camCardFacadeMock: CamCardsFacade;
  let shoppingFacadeMock: ShoppingFacade;
  const camCardDetails = {
    name: 'testing cam cards',
    id: '.SKsEQAE4FIAAAFuNiUBWx0d',
    itemsCount: 0,
  };

  beforeEach(async () => {
    camCardFacadeMock = mock(CamCardsFacade);
    shoppingFacadeMock = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [
        ArticleDetailsComponent,
        CamfilCamCardModalComponent,
        CamfilCounterComponent,
        CamfilErrorComponent,
        CamfilProductQuantityComponent,
        CreateCamCardModalComponent,
        MockComponent(InputComponent),
        MockComponent(LoadingComponent),
        MockComponent(ZipCodeComponent),
        MockDirective(ServerHtmlDirective),
        MockPipe(AddressSortPipe),
        SelectCamCardModalComponent,
      ],
      imports: [
        CoreStoreModule.forTesting(),
        NgbModalModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCamCardModalComponent);

    component = fixture.componentInstance;
    element = fixture.nativeElement;
    when(camCardFacadeMock.currentCamCard$).thenReturn(of(camCardDetails));
    when(camCardFacadeMock.camCard$).thenReturn(of([camCardDetails]));
    when(camCardFacadeMock.customers$).thenReturn(of([]));

    component.product = { name: 'Test Product', sku: 'test sku', minOrderQuantity: 1 } as Product;

    fixture.detectChanges();
    component.show();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
