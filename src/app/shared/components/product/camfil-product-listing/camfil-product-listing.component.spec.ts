import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { of } from 'rxjs';
import { deepEqual, instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Category } from 'ish-core/models/category/category.model';
import { ProductListingView } from 'ish-core/models/product-listing/product-listing.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { CamfilProductListToolbarComponent } from 'ish-shared/components/product/camfil-product-list-toolbar/camfil-product-list-toolbar.component';
import { CamfilProductListComponent } from 'ish-shared/components/product/camfil-product-list/camfil-product-list.component';
import { ProductListPagingComponent } from 'ish-shared/components/product/product-list-paging/product-list-paging.component';

import { CamfilProductListingComponent } from './camfil-product-listing.component';

describe('Camfil Product Listing Component', () => {
  const TEST_ID = { type: 'test', value: 'dummy' };
  const category = {
    uniqueId: 'A',
    categoryPath: ['A'],
    images: [
      {
        type: 'Image',
        effectiveUrl: '/assets/product_img/a.jpg',
        primaryImage: false,
      },
    ],
    name: 'A',
  } as Category;
  let component: CamfilProductListingComponent;
  let fixture: ComponentFixture<CamfilProductListingComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.productListingViewType$).thenReturn(of('simple'));
    when(shoppingFacade.productListingView$(deepEqual(TEST_ID))).thenReturn(
      of({
        allPagesAvailable: () => false,
        empty: () => false,
        itemCount: 30,
        products: () => ['A', 'B', 'C'],
        productsOfPage: _ => ['A', 'B', 'C'],
        pageIndices: _ => [{ value: 1, display: '1' }],
      } as ProductListingView)
    );

    await TestBed.configureTestingModule({
      imports: [InfiniteScrollModule, RouterTestingModule],
      declarations: [
        CamfilProductListingComponent,
        MockComponent(CamfilProductListComponent),
        MockComponent(CamfilProductListToolbarComponent),
        MockComponent(LoadingComponent),
        MockComponent(ProductListPagingComponent),
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductListingComponent);
    component = fixture.componentInstance;
    component.id = TEST_ID;
    component.category = category;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges({})).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('display modes', () => {
    beforeEach(() => {
      component.ngOnChanges({ id: new SimpleChange(undefined, TEST_ID, true) });
    });

    it('should display components with paging on the page if available and mode is paging', () => {
      component.mode = 'paging';
      fixture.detectChanges();

      expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
        Array [
          "camfil-product-list-toolbar",
          "camfil-product-list",
          "camfil-product-list-toolbar",
        ]
      `);
    });
  });
});
