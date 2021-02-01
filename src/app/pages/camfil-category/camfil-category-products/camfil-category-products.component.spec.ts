import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { CategoryView, createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { ContentViewcontextComponent } from 'ish-shared/cms/components/content-viewcontext/content-viewcontext.component';
import { CamfilLinksBlockComponent } from 'ish-shared/components/common/camfil-links-block/camfil-links-block.component';
import { CamfilFilterMeasurementsComponent } from 'ish-shared/components/filter/camfil-filter-measurements/camfil-filter-measurements.component';
import { CamfilFilterNavigationComponent } from 'ish-shared/components/filter/camfil-filter-navigation/camfil-filter-navigation.component';
import { CamfilProductListingComponent } from 'ish-shared/components/product/camfil-product-listing/camfil-product-listing.component';

import { CamfilCategoryNavigationComponent } from '../camfil-category-navigation/camfil-category-navigation.component';

import { CamfilCategoryProductsComponent } from './camfil-category-products.component';

describe('Camfil Category Products Component', () => {
  let component: CamfilCategoryProductsComponent;
  let fixture: ComponentFixture<CamfilCategoryProductsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, TranslateModule.forRoot()],
      declarations: [
        CamfilCategoryProductsComponent,
        MockComponent(CamfilCategoryNavigationComponent),
        MockComponent(CamfilFilterMeasurementsComponent),
        MockComponent(CamfilFilterNavigationComponent),
        MockComponent(CamfilLinksBlockComponent),
        MockComponent(CamfilProductListingComponent),
        MockComponent(ContentIncludeComponent),
        MockComponent(ContentViewcontextComponent),
        MockComponent(FaIconComponent),
        MockComponent(NgbCollapse),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const category = {
      uniqueId: 'dummy',
    } as CategoryView;

    fixture = TestBed.createComponent(CamfilCategoryProductsComponent);
    component = fixture.componentInstance;
    component.category = category;
    element = fixture.nativeElement;
    const cat = { uniqueId: 'A', categoryPath: ['A'], description: 'A' } as Category;
    component.category = createCategoryView(categoryTree([cat]), 'A');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display all components on the page', () => {
    expect(findAllCustomElements(element)).toIncludeAllMembers(['camfil-product-listing', 'camfil-filter-navigation']);
  });
});
