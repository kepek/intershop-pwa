import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from 'ish-core/configurations/injection-keys';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';
import { SubCategoryNavigationComponent } from 'ish-shell/header/sub-category-navigation/sub-category-navigation.component';

import { CamfilSubCategoryNavigationComponent } from './camfil-sub-category-navigation.component';

describe('Camfil Sub Category Navigation Component', () => {
  let fixture: ComponentFixture<CamfilSubCategoryNavigationComponent>;
  let component: CamfilSubCategoryNavigationComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    const shoppingFacade = mock(ShoppingFacade);

    when(shoppingFacade.navigationCategories$('A')).thenReturn(
      of([
        { uniqueId: 'A.1', name: 'CAT_A1', url: '/CAT_A1-catA.1', hasChildren: true },
        { uniqueId: 'A.2', name: 'CAT_A2', url: '/CAT_A2-catA.2' },
      ] as NavigationCategory[])
    );
    when(shoppingFacade.navigationCategories$('A.1')).thenReturn(
      of([{ uniqueId: 'A.1.a', name: 'CAT_A1a', url: '/CAT_A1a-catA.1.a', hasChildren: true }] as NavigationCategory[])
    );
    when(shoppingFacade.navigationCategories$('A.1.a')).thenReturn(
      of([
        { uniqueId: 'A.1.a.alpha', name: 'CAT_A1aAlpha', url: '/CAT_A1aAlpha-catA.1.a.alpha' },
      ] as NavigationCategory[])
    );

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        CamfilSubCategoryNavigationComponent,
        MockComponent(FaIconComponent),
        MockComponent(SubCategoryNavigationComponent),
      ],
      providers: [
        { provide: MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH, useValue: 2 },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilSubCategoryNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.categoryUniqueId = 'A';
    component.subCategoriesDepth = 1;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
      <ul class="category-level1 dropdown-menu all-filters-menu">
        <li class="main-navigation-btn-item">
          <a
            class="mat-focus-indicator mat-stroked-button mat-button-base _mat-animation-noopable"
            mat-stroked-button=""
            tabindex="0"
            aria-disabled="false"
            href="/"
            ><span class="mat-button-wrapper"> camfil.navigation.see.all.airFilters </span
            ><span
              class="mat-button-ripple mat-ripple"
              matripple=""
              ng-reflect-centered="false"
              ng-reflect-disabled="false"
              ng-reflect-trigger="http://localhost/"
            ></span
            ><span class="mat-button-focus-overlay"></span
          ></a>
        </li>
        <li class="main-navigation-level1-item">
          <a ng-reflect-router-link="/CAT_A1-catA.1" href="/CAT_A1-catA.1">CAT_A1</a
          ><a class="dropdown-toggle"><fa-icon ng-reflect-icon="fas,plus"></fa-icon></a
          ><ish-sub-category-navigation
            ng-reflect-category-unique-id="A.1"
            ng-reflect-sub-categories-depth="2"
          ></ish-sub-category-navigation>
        </li>
        <li class="main-navigation-level1-item">
          <a style="width: 100%" ng-reflect-router-link="/CAT_A2-catA.2" href="/CAT_A2-catA.2">CAT_A2</a>
        </li>
      </ul>
    `);
  });
});
