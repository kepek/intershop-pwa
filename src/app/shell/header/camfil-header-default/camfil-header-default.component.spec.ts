import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { CamfilMiniBasketComponent } from 'ish-shell/header/camfil-mini-basket/camfil-mini-basket.component';
import { CamfilProductCompareStatusComponent } from 'ish-shell/header/camfil-product-compare-status/camfil-product-compare-status.component';
import { CamfilSearchBoxComponent } from 'ish-shell/header/camfil-search-box/camfil-search-box.component';
import { HeaderNavigationComponent } from 'ish-shell/header/header-navigation/header-navigation.component';
import { LanguageSwitchComponent } from 'ish-shell/header/language-switch/language-switch.component';
import { LoginStatusComponent } from 'ish-shell/header/login-status/login-status.component';
import { UserInformationMobileComponent } from 'ish-shell/header/user-information-mobile/user-information-mobile.component';

import { LazyHeaderQuickorderComponent } from '../../../extensions/quickorder/exports/header/lazy-header-quickorder/lazy-header-quickorder.component';
import { LazyWishlistsLinkComponent } from '../../../extensions/wishlists/exports/wishlists/lazy-wishlists-link/lazy-wishlists-link.component';

import { CamfilHeaderDefaultComponent } from './camfil-header-default.component';

describe('Camfil Header Default Component', () => {
  let fixture: ComponentFixture<CamfilHeaderDefaultComponent>;
  let element: HTMLElement;
  let component: CamfilHeaderDefaultComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting('compare'), RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        CamfilHeaderDefaultComponent,
        MockComponent(CamfilMiniBasketComponent),
        MockComponent(CamfilProductCompareStatusComponent),
        MockComponent(CamfilSearchBoxComponent),
        MockComponent(FaIconComponent),
        MockComponent(HeaderNavigationComponent),
        MockComponent(LanguageSwitchComponent),
        MockComponent(LazyHeaderQuickorderComponent),
        MockComponent(LazyWishlistsLinkComponent),
        MockComponent(LoginStatusComponent),
        MockComponent(NgbCollapse),
        MockComponent(UserInformationMobileComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilHeaderDefaultComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render User Links on template', () => {
    fixture.detectChanges();
    expect(findAllIshElements(element)).toIncludeAllMembers(['ish-login-status']);
  });

  it('should render sticky header adequately for mobile devices', () => {
    component.deviceType = 'mobile';
    component.isSticky = true;
    fixture.detectChanges();

    expect(element).toMatchSnapshot();
  });

  it('should render normal header adequately for tablet devices', () => {
    component.deviceType = 'tablet';
    fixture.detectChanges();

    expect(element).toMatchSnapshot();
  });

  it('should render sticky header adequately for tablet devices', () => {
    component.deviceType = 'tablet';
    component.isSticky = true;
    fixture.detectChanges();

    expect(element).toMatchSnapshot();
  });

  it('should render normal header adequately for desktop', () => {
    component.deviceType = 'desktop';
    fixture.detectChanges();

    expect(element).toMatchSnapshot();
  });

  it('should render sticky header adequately for desktop', () => {
    component.deviceType = 'desktop';
    component.isSticky = true;
    fixture.detectChanges();

    expect(element).toMatchSnapshot();
  });
});
