import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DeferLoadModule } from '@trademe/ng-defer-load';
import { CamfilIconsModule } from 'camfil-icons';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { DirectivesModule } from 'ish-core/directives.module';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';
import { MaterialModule } from 'ish-shared/material/material.module';
import { LazyContentIncludeComponent } from 'ish-shell/shared/lazy-content-include/lazy-content-include.component';

import { CamAccountExportsModule } from '../extensions/cam-account/exports/cam-account-exports.module';
import { CamAhuExportsModule } from '../extensions/cam-ahu/exports/cam-ahu-exports.module';
import { CamCaptchaExportsModule } from '../extensions/cam-captcha/exports/cam-captcha-exports.module';
import { CamCardsExportsModule } from '../extensions/cam-cards/exports/cam-cards-exports.module';
import { CamConfigurationExportsModule } from '../extensions/cam-configuration/exports/cam-configuration-exports.module';
import { CamDemoExportsModule } from '../extensions/cam-demo/exports/cam-demo-exports.module';
import { CamIccExportsModule } from '../extensions/cam-icc/exports/cam-icc-exports.module';
import { CaptchaExportsModule } from '../extensions/captcha/exports/captcha-exports.module';
import { OrderTemplatesExportsModule } from '../extensions/order-templates/exports/order-templates-exports.module';
import { QuickorderExportsModule } from '../extensions/quickorder/exports/quickorder-exports.module';
import { QuotingExportsModule } from '../extensions/quoting/exports/quoting-exports.module';
import { TactonExportsModule } from '../extensions/tacton/exports/tacton-exports.module';
import { WishlistsExportsModule } from '../extensions/wishlists/exports/wishlists-exports.module';

import { CookiesBannerComponent } from './application/cookies-banner/cookies-banner.component';
import { FooterComponent } from './footer/footer/footer.component';
import { CamfilHeaderNavigationComponent } from './header/camfil-header-navigation/camfil-header-navigation.component';
import { CamfilLanguageSwitchComponent } from './header/camfil-language-switch/camfil-language-switch.component';
import { CamfilLoginStatusComponent } from './header/camfil-login-status/camfil-login-status.component';
import { CamfilMiniBasketComponent } from './header/camfil-mini-basket/camfil-mini-basket.component';
import { CamfilProductCompareStatusComponent } from './header/camfil-product-compare-status/camfil-product-compare-status.component';
import { CamfilProductImageComponent } from './header/camfil-product-image/camfil-product-image.component';
import { CamfilSearchBoxComponent } from './header/camfil-search-box/camfil-search-box.component';
import { CamfilSubCategoryNavigationComponent } from './header/camfil-sub-category-navigation/camfil-sub-category-navigation.component';
import { CamfilUserLinksComponent } from './header/camfil-user-links/camfil-user-links.component';
import { HeaderCheckoutComponent } from './header/header-checkout/header-checkout.component';
import { HeaderDefaultComponent } from './header/header-default/header-default.component';
import { HeaderNavigationComponent } from './header/header-navigation/header-navigation.component';
import { HeaderSimpleComponent } from './header/header-simple/header-simple.component';
import { HeaderComponent } from './header/header/header.component';
import { LanguageSwitchComponent } from './header/language-switch/language-switch.component';
import { LoginStatusComponent } from './header/login-status/login-status.component';
import { MiniBasketComponent } from './header/mini-basket/mini-basket.component';
import { ProductCompareStatusComponent } from './header/product-compare-status/product-compare-status.component';
import { ProductImageComponent } from './header/product-image/product-image.component';
import { SearchBoxComponent } from './header/search-box/search-box.component';
import { SubCategoryNavigationComponent } from './header/sub-category-navigation/sub-category-navigation.component';
import { UserInformationMobileComponent } from './header/user-information-mobile/user-information-mobile.component';

const importExportModules = [
  CamAccountExportsModule,
  CamAhuExportsModule,
  CamCaptchaExportsModule,
  CamCardsExportsModule,
  CamConfigurationExportsModule,
  CamDemoExportsModule,
  CamIccExportsModule,
  CaptchaExportsModule,
  DirectivesModule,
  OrderTemplatesExportsModule,
  QuickorderExportsModule,
  QuotingExportsModule,
  TactonExportsModule,
  WishlistsExportsModule,
];

const exportedComponents = [
  CamfilHeaderNavigationComponent,
  CamfilLanguageSwitchComponent,
  CamfilLoginStatusComponent,
  CamfilMiniBasketComponent,
  CamfilProductCompareStatusComponent,
  CamfilProductImageComponent,
  CamfilSearchBoxComponent,
  CamfilUserLinksComponent,
  CookiesBannerComponent,
  FooterComponent,
  HeaderComponent,
  HeaderSimpleComponent,
  ProductImageComponent,
  SearchBoxComponent,
];

@NgModule({
  imports: [
    ...importExportModules,
    AuthorizationToggleModule,
    CamfilIconsModule,
    CommonModule,
    DeferLoadModule,
    FeatureToggleModule,
    IconModule,
    MatButtonModule,
    MatIconModule,
    MaterialModule,
    NgbCollapseModule,
    NgbDropdownModule,
    PipesModule.forRoot(),
    RouterModule,
    TranslateModule,
  ],
  declarations: [
    ...exportedComponents,
    CamfilHeaderNavigationComponent,
    CamfilLanguageSwitchComponent,
    CamfilLoginStatusComponent,
    CamfilMiniBasketComponent,
    CamfilProductCompareStatusComponent,
    CamfilSubCategoryNavigationComponent,
    CamfilUserLinksComponent,
    CookiesBannerComponent,
    FooterComponent,
    HeaderCheckoutComponent,
    HeaderComponent,
    HeaderDefaultComponent,
    HeaderNavigationComponent,
    HeaderSimpleComponent,
    LanguageSwitchComponent,
    LazyContentIncludeComponent,
    LoginStatusComponent,
    MiniBasketComponent,
    ProductCompareStatusComponent,
    ProductImageComponent,
    SearchBoxComponent,
    SubCategoryNavigationComponent,
    UserInformationMobileComponent,
  ],
  exports: [...exportedComponents, ...importExportModules],
})
export class ShellModule {}
