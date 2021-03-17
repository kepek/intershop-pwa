import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { Product } from 'ish-core/models/product/product.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CamfilCamCardModalComponent } from 'ish-shared/components/common/camfil-cam-card-modal/camfil-cam-card-modal.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { CamfilCounterComponent } from 'ish-shared/forms/components/camfil-counter/camfil-counter.component';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { ArticleDetailsComponent } from '../article-details/article-details.component';

import { CreateCamCardModalComponent } from './create-cam-card-modal.component';

describe('Create Cam Card Modal Component', () => {
  let component: CreateCamCardModalComponent;
  let fixture: ComponentFixture<CreateCamCardModalComponent>;
  let element: HTMLElement;
  let camCardFacadeMock: CamCardsFacade;

  beforeEach(async () => {
    camCardFacadeMock = mock(CamCardsFacade);

    await TestBed.configureTestingModule({
      declarations: [
        ArticleDetailsComponent,
        CamfilCamCardModalComponent,
        CamfilCounterComponent,
        CamfilErrorComponent,
        CamfilProductQuantityComponent,
        CreateCamCardModalComponent,
        MockComponent(LoadingComponent),
      ],
      imports: [CoreStoreModule.forTesting(), RouterTestingModule],
      providers: [{ provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCamCardModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.product = { name: 'Test Product', sku: 'test sku', minOrderQuantity: 1 } as Product;
    when(camCardFacadeMock.customers$).thenReturn(of([]));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
