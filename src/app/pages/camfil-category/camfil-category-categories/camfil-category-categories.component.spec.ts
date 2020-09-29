import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';
import { CamfilBreadcrumbComponent } from 'ish-shared/components/common/camfil-breadcrumb/camfil-breadcrumb.component';
import { CamfilFilterMeasurementsComponent } from 'ish-shared/components/filter/camfil-filter-measurements/camfil-filter-measurements.component';

import { CategoryListComponent } from '../../category/category-list/category-list.component';
import { CamfilCategoryBoxesComponent } from '../camfil-category-boxes/camfil-category-boxes.component';
import { CamfilCategoryFaqComponent } from '../camfil-category-faq/camfil-category-faq.component';
import { CamfilCategoryNavigationComponent } from '../camfil-category-navigation/camfil-category-navigation.component';

import { CamfilCategoryCategoriesComponent } from './camfil-category-categories.component';

describe('Camfil Category Categories Component', () => {
  let component: CamfilCategoryCategoriesComponent;
  let fixture: ComponentFixture<CamfilCategoryCategoriesComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        CamfilCategoryCategoriesComponent,
        MockComponent(CamfilBreadcrumbComponent),
        MockComponent(CamfilCategoryBoxesComponent),
        MockComponent(CamfilCategoryFaqComponent),
        MockComponent(CamfilCategoryNavigationComponent),
        MockComponent(CamfilFilterMeasurementsComponent),
        MockComponent(CategoryListComponent),
        MockComponent(FaIconComponent),
        MockComponent(NgbCollapse),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCategoryCategoriesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const tree = categoryTree([
      { uniqueId: 'A', categoryPath: ['A'] },
      { uniqueId: 'A.1', categoryPath: ['A', 'A.1'] },
      { uniqueId: 'A.2', categoryPath: ['A', 'A.2'] },
      {
        uniqueId: 'A.1.a',
        categoryPath: ['A', 'A.1', 'A.1.a'],
      },
    ] as Category[]);

    component.category = createCategoryView(tree, 'A');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display all components on the page', () => {
    expect(findAllCustomElements(element)).toIncludeAllMembers(['ish-category-list']);
    expect(findAllCustomElements(element)).toIncludeAllMembers(['camfil-breadcrumb', 'camfil-category-navigation']);
  });
});
