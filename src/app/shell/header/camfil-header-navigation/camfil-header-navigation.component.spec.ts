import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';
import { CategoryRoutePipe } from 'ish-core/routing/category/category-route.pipe';
import { SubCategoryNavigationComponent } from 'ish-shell/header/sub-category-navigation/sub-category-navigation.component';

import { CamfilHeaderNavigationComponent } from './camfil-header-navigation.component';

describe('Camfil Header Navigation Component', () => {
  let component: CamfilHeaderNavigationComponent;
  let fixture: ComponentFixture<CamfilHeaderNavigationComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;
  let translate: TranslateService;

  beforeEach(async(() => {
    shoppingFacade = mock(ShoppingFacade);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        CamfilHeaderNavigationComponent,
        CategoryRoutePipe,
        MockComponent(FaIconComponent),
        MockComponent(SubCategoryNavigationComponent),
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilHeaderNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    element = fixture.nativeElement;

    const categories = [
      { uniqueId: 'A', name: 'CAT_A', url: '/cat/A', hasChildren: true },
      { uniqueId: 'B', name: 'CAT_B', url: '/cat/B' },
      { uniqueId: 'C', name: 'CAT_C', url: '/cat/C' },
    ] as NavigationCategory[];
    when(shoppingFacade.navigationCategories$()).thenReturn(of(categories));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
      <ul class="navbar-nav main-navigation-list">
        <li class="dropdown">
          <a ng-reflect-router-link="/cat/A" data-testing-id="A-link" href="/cat/A"> CAT_A </a
          ><a class="dropdown-toggle"
            ><mat-icon
              class="mat-icon notranslate material-icons mat-icon-no-color"
              role="img"
              aria-hidden="true"
              >arrow_right</mat-icon
            ></a
          ><ish-sub-category-navigation
            ng-reflect-view="auto"
            ng-reflect-category-unique-id="A"
            ng-reflect-sub-categories-depth="1"
          ></ish-sub-category-navigation>
        </li>
        <li class="dropdown">
          <a style="width: 100%;" ng-reflect-router-link="/cat/B" data-testing-id="B-link" href="/cat/B">
            CAT_B
          </a>
        </li>
        <li class="dropdown">
          <a style="width: 100%;" ng-reflect-router-link="/cat/C" data-testing-id="C-link" href="/cat/C">
            CAT_C
          </a>
        </li>
        <li>
          <a ng-reflect-router-link="/my-camcards" href="/my-camcards">camfil.navigation.camcards.text</a>
        </li>
      </ul>
    `);
  });
});
