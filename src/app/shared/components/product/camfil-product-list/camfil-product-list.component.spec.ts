import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { User } from 'ish-core/models/user/user.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { CamfilProductItemComponent } from 'ish-shared/components/product/camfil-product-item/camfil-product-item.component';

import { CamfilProductListComponent } from './camfil-product-list.component';

describe('Camfil Product List Component', () => {
  let component: CamfilProductListComponent;
  let fixture: ComponentFixture<CamfilProductListComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);
    accountFacade = mock(AccountFacade);
    await TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        RouterTestingModule,
        ShoppingStoreModule.forTesting('productListing'),
        TranslateModule.forRoot(),
      ],
      declarations: [
        CamfilProductListComponent,
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilProductItemComponent),
        PricePipe,
      ],
      providers: [
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
      ],
    }).compileComponents();

    when(accountFacade.user$).thenReturn(of({} as User));
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

    expect(findAllCustomElements(element)).toEqual(['camfil-loading']);
  }));
});
