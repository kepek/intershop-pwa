import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { CamfilHeaderNavigationComponent } from 'ish-shell/header/camfil-header-navigation/camfil-header-navigation.component';
import { CamfilLanguageSwitchComponent } from 'ish-shell/header/camfil-language-switch/camfil-language-switch.component';
import { CamfilLoginStatusComponent } from 'ish-shell/header/camfil-login-status/camfil-login-status.component';
import { CamfilMiniBasketComponent } from 'ish-shell/header/camfil-mini-basket/camfil-mini-basket.component';
import { CamfilProductCompareStatusComponent } from 'ish-shell/header/camfil-product-compare-status/camfil-product-compare-status.component';
import { CamfilSearchBoxComponent } from 'ish-shell/header/camfil-search-box/camfil-search-box.component';
import { UserInformationMobileComponent } from 'ish-shell/header/user-information-mobile/user-information-mobile.component';

import { LazyHeaderQuickorderComponent } from '../../../extensions/quickorder/exports/lazy-header-quickorder/lazy-header-quickorder.component';
import { LazyWishlistsLinkComponent } from '../../../extensions/wishlists/exports/lazy-wishlists-link/lazy-wishlists-link.component';

import { HeaderDefaultComponent } from './header-default.component';

describe('Header Default Component', () => {
  let fixture: ComponentFixture<HeaderDefaultComponent>;
  let element: HTMLElement;
  let component: HeaderDefaultComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting('compare'), RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        HeaderDefaultComponent,
        MockComponent(CamfilHeaderNavigationComponent),
        MockComponent(CamfilLanguageSwitchComponent),
        MockComponent(CamfilLoginStatusComponent),
        MockComponent(CamfilMiniBasketComponent),
        MockComponent(CamfilProductCompareStatusComponent),
        MockComponent(CamfilSearchBoxComponent),
        MockComponent(FaIconComponent),
        MockComponent(LazyHeaderQuickorderComponent),
        MockComponent(LazyWishlistsLinkComponent),
        MockComponent(NgbCollapse),
        MockComponent(UserInformationMobileComponent),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderDefaultComponent);
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
    expect(findAllCustomElements(element)).toIncludeAllMembers([
      'camfil-login-status',
      'camfil-product-compare-status',
      'camfil-language-switch',
      'camfil-mini-basket',
      'camfil-mini-basket',
      'ish-lazy-header-quickorder',
      'camfil-search-box',
      'camfil-header-navigation',
      'ish-user-information-mobile',
    ]);
  });
  it('should render Language Switch on template', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toContain('camfil-language-switch');
  });

  it('should render Search Box on template', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toIncludeAllMembers([
      'camfil-login-status',
      'camfil-product-compare-status',
      'camfil-language-switch',
      'camfil-mini-basket',
      'camfil-mini-basket',
      'ish-lazy-header-quickorder',
      'camfil-search-box',
      'camfil-header-navigation',
      'ish-user-information-mobile',
    ]);
  });

  it('should render Header Navigation on template', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toContain('camfil-header-navigation');
  });

  it('should render normal header adequately for mobile devices', () => {
    component.deviceType = 'mobile';
    fixture.detectChanges();

    expect(element).toMatchSnapshot();
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
