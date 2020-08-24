import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { findAllCamfilElements } from 'camfil-core/utils/dev/html-query-utils';
import { MockComponent } from 'ng-mocks';
import { MatToolbarModule } from '@angular/material/toolbar';
import { createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';
import { CamfilBreadcrumbComponent } from 'ish-shared/components/common/camfil-breadcrumb/camfil-breadcrumb.component';
import { CamfilFilterNavigationComponent } from 'ish-shared/components/filter/camfil-filter-navigation/camfil-filter-navigation.component';
import { CamfilLinksBlockComponent } from 'ish-shared/components/common/camfil-links-block/camfil-links-block.component';
import { CamfilProductListingComponent } from 'ish-shared/components/product/camfil-product-listing/camfil-product-listing.component';

import { CamfilCategoryNavigationComponent } from '../camfil-category-navigation/camfil-category-navigation.component';

import { CamfilCategoryProductsComponent } from './camfil-category-products.component';

describe('Camfil Category Products Component', () => {
  let component: CamfilCategoryProductsComponent;
  let fixture: ComponentFixture<CamfilCategoryProductsComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatExpansionModule, MatToolbarModule, TranslateModule.forRoot()],
      declarations: [
        CamfilCategoryProductsComponent,
        MockComponent(CamfilBreadcrumbComponent),
        MockComponent(CamfilCategoryNavigationComponent),
        MockComponent(CamfilLinksBlockComponent),
        MockComponent(CamfilProductListingComponent),
        MockComponent(FaIconComponent),
        MockComponent(CamfilFilterNavigationComponent),
        MockComponent(NgbCollapse),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCategoryProductsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const cat = { uniqueId: 'A', categoryPath: ['A'] } as Category;
    component.category = createCategoryView(categoryTree([cat]), 'A');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display all components on the page', () => {
    expect(findAllCamfilElements(element)).toIncludeAllMembers([
      'camfil-breadcrumb',
      'camfil-product-listing',
      'camfil-links-block',
      'camfil-filter-navigation',
    ]);
  });
});
