import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { CamfilLanguageSwitchComponent } from 'ish-shell/header/camfil-language-switch/camfil-language-switch.component';
import { CamfilLoginStatusComponent } from 'ish-shell/header/camfil-login-status/camfil-login-status.component';
import { CamfilMiniBasketComponent } from 'ish-shell/header/camfil-mini-basket/camfil-mini-basket.component';
import { CamfilProductCompareStatusComponent } from 'ish-shell/header/camfil-product-compare-status/camfil-product-compare-status.component';

import { LazyWishlistsLinkComponent } from '../../../extensions/wishlists/exports/lazy-wishlists-link/lazy-wishlists-link.component';

import { UserInformationMobileComponent } from './user-information-mobile.component';

describe('User Information Mobile Component', () => {
  let component: UserInformationMobileComponent;
  let fixture: ComponentFixture<UserInformationMobileComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(CamfilLanguageSwitchComponent),
        MockComponent(CamfilLoginStatusComponent),
        MockComponent(CamfilMiniBasketComponent),
        MockComponent(CamfilProductCompareStatusComponent),
        MockComponent(LazyWishlistsLinkComponent),
        MockDirective(FeatureToggleDirective),
        UserInformationMobileComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInformationMobileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
