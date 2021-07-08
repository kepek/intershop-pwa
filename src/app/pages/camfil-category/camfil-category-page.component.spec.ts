import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';

import { CategoryCategoriesComponent } from '../category/category-categories/category-categories.component';

import { CamfilCategoryCategoriesComponent } from './camfil-category-categories/camfil-category-categories.component';
import { CamfilCategoryPageComponent } from './camfil-category-page.component';
import { CamfilCategoryProductsComponent } from './camfil-category-products/camfil-category-products.component';

describe('Camfil Category Page Component', () => {
  let component: CamfilCategoryPageComponent;
  let fixture: ComponentFixture<CamfilCategoryPageComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);
    await TestBed.configureTestingModule({
      declarations: [
        CamfilCategoryPageComponent,
        MockComponent(CamfilCategoryCategoriesComponent),
        MockComponent(CamfilCategoryProductsComponent),
        MockComponent(CamfilLoadingComponent),
        MockComponent(CategoryCategoriesComponent),
      ],
      providers: [
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
        { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCategoryPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display anything when neither category nor loading is set', () => {
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toBeEmpty();
  });
});
