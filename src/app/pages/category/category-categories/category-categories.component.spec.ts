import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilBreadcrumbComponent } from 'ish-shared/components/common/camfil-breadcrumb/camfil-breadcrumb.component';
import { CamfilCategoryNavigationComponent } from '../../camfil-category/camfil-category-navigation/camfil-category-navigation.component';
import { Category } from 'ish-core/models/category/category.model';
import { CategoryCategoriesComponent } from './category-categories.component';
import { CategoryListComponent } from '../category-list/category-list.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent } from 'ng-mocks';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';
import { createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';

describe('Category Categories Component', () => {
  let component: CategoryCategoriesComponent;
  let fixture: ComponentFixture<CategoryCategoriesComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        CategoryCategoriesComponent,
        MockComponent(CamfilBreadcrumbComponent),
        MockComponent(CamfilCategoryNavigationComponent),
        MockComponent(CategoryListComponent),
        MockComponent(FaIconComponent),
        MockComponent(NgbCollapse),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryCategoriesComponent);
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
    expect(findAllCustomElements(element)).toIncludeAllMembers(['camfil-breadcrumb']);
  });
});
