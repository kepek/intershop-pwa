import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { CamfilProductItemComponent } from 'ish-shared/components/product/camfil-product-item/camfil-product-item.component';

import { CamfilProductListComponent } from './camfil-product-list.component';

describe('Camfil Product List Component', () => {
  let component: CamfilProductListComponent;
  let fixture: ComponentFixture<CamfilProductListComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);
    await TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        ShoppingStoreModule.forTesting('productListing'),
        TranslateModule.forRoot(),
      ],
      declarations: [
        CamfilProductListComponent,
        MockComponent(CamfilProductItemComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.products = ['sku'];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render a product-item-simple when viewType is simple', () => {
    component.viewType = 'simple';
    fixture.detectChanges();
    const productItemContainer = fixture.debugElement.query(By.css('camfil-product-item'))
      .componentInstance as CamfilProductItemComponent;
    expect(productItemContainer.configuration.displayType).toEqual('simple');
  });

  it('should render a product-item-detailed when viewType is detailed', () => {
    component.viewType = 'detailed';
    fixture.detectChanges();
    const productItemContainer = fixture.debugElement.query(By.css('camfil-product-item'))
      .componentInstance as CamfilProductItemComponent;
    expect(productItemContainer.configuration.displayType).toEqual('detailed');
  });

  it('should display loading when product list is loading', fakeAsync(() => {
    component.products = [];
    when(shoppingFacade.productListingLoading$).thenReturn(of(true));

    fixture.detectChanges();

    expect(findAllCustomElements(element)).toEqual(['ish-loading', 'ish-loading']);
  }));
});
