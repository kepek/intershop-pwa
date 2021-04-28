import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';
import { User } from 'ish-core/models/user/user.model';
import { CategoryRoutePipe } from 'ish-core/routing/category/category-route.pipe';
import { CamfilSubCategoryNavigationComponent } from 'ish-shell/header/camfil-sub-category-navigation/camfil-sub-category-navigation.component';

import { CamfilHeaderNavigationComponent } from './camfil-header-navigation.component';

describe('Camfil Header Navigation Component', () => {
  let component: CamfilHeaderNavigationComponent;
  let fixture: ComponentFixture<CamfilHeaderNavigationComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;
  let accountFacade: AccountFacade;
  let translate: TranslateService;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);
    accountFacade = mock(AccountFacade);

    await TestBed.configureTestingModule({
      imports: [
        AuthorizationToggleModule.forTesting('APP_B2B_MANAGE_ALL_ORDERS'),
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        CamfilHeaderNavigationComponent,
        CategoryRoutePipe,
        MockComponent(CamfilSubCategoryNavigationComponent),
        MockComponent(FaIconComponent),
      ],
      providers: [
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
      ],
    }).compileComponents();
  });

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

    const userData = {
      firstName: 'Patricia',
      lastName: 'Miller',
    } as User;

    when(shoppingFacade.navigationCategories$()).thenReturn(of(categories));
    when(accountFacade.user$).thenReturn(of(userData));
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
              data-mat-icon-type="font"
              >arrow_right</mat-icon
            ></a
          ><camfil-sub-category-navigation
            ng-reflect-view="auto"
            ng-reflect-category-unique-id="A"
            ng-reflect-sub-categories-depth="1"
            ng-reflect-url="/cat/A"
          ></camfil-sub-category-navigation>
        </li>
        <li class="dropdown">
          <a style="width: 100%" ng-reflect-router-link="/cat/B" data-testing-id="B-link" href="/cat/B">
            CAT_B
          </a>
        </li>
        <li class="dropdown">
          <a style="width: 100%" ng-reflect-router-link="/cat/C" data-testing-id="C-link" href="/cat/C">
            CAT_C
          </a>
        </li>
        <li class="dropdown with-separator"><a ng-reflect-router-link="/demo" href="/demo">Demo</a></li>
        <li class="dropdown with-separator">
          <a ng-reflect-router-link="/air-handling-unit-guide" href="/air-handling-unit-guide"
            >camfil.ahu.link</a
          >
        </li>
        <li class="dropdown with-separator">
          <a ng-reflect-router-link="/account/camcards" href="/account/camcards"
            >camfil.account.cam_card.link</a
          >
        </li>
        <li class="dropdown with-separator">
          <a ng-reflect-router-link="/account/orders" href="/account/orders"
            >account.order_history.link</a
          >
        </li>
      </ul>
    `);
  });
});
