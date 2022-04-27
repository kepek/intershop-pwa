import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DeferLoadModule } from '@trademe/ng-defer-load';
import { CamfilIconsModule } from 'camfil-icons';

import { DirectivesModule } from 'ish-core/directives.module';
import { ExtrasModule } from 'ish-core/extras.module';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';
import { RoleToggleModule } from 'ish-core/role-toggle.module';
import { MaterialModule } from 'ish-shared/material/material.module';
import { SharedModule } from 'ish-shared/shared.module';
import { CamfilFooterComponent } from 'ish-shell/footer/camfil-footer/camfil-footer.component';
import { CamfilBreadcrumbComponent } from 'ish-shell/header/camfil-breadcrumb/camfil-breadcrumb.component';
import { CamfilHeaderDefaultComponent } from 'ish-shell/header/camfil-header-default/camfil-header-default.component';
import { CamfilHeaderComponent } from 'ish-shell/header/camfil-header/camfil-header.component';
import { CamfilUserLinksComponent } from 'ish-shell/header/camfil-user-links/camfil-user-links.component';
import { CamfilSearchBoxComponent } from 'ish-shell/header/header/camfil-search-box/camfil-search-box.component';
import { ProductCompareStatusComponent } from 'ish-shell/header/product-compare-status/product-compare-status.component';

import { QuickorderExportsModule } from '../extensions/quickorder/exports/quickorder-exports.module';
import { WishlistsExportsModule } from '../extensions/wishlists/exports/wishlists-exports.module';

import { CookiesBannerComponent } from './application/cookies-banner/cookies-banner.component';
import { FooterComponent } from './footer/footer/footer.component';
import { CamfilHeaderNavigationComponent } from './header/camfil-header-navigation/camfil-header-navigation.component';
import { CamfilIEModalComponent } from './header/camfil-ie-modal/camfil-ie-modal.component';
import { CamfilLanguageSwitchComponent } from './header/camfil-language-switch/camfil-language-switch.component';
import { CamfilLoginStatusComponent } from './header/camfil-login-status/camfil-login-status.component';
import { CamfilMiniBasketComponent } from './header/camfil-mini-basket/camfil-mini-basket.component';
import { CamfilProductCompareStatusComponent } from './header/camfil-product-compare-status/camfil-product-compare-status.component';
import { CamfilSubCategoryNavigationComponent } from './header/camfil-sub-category-navigation/camfil-sub-category-navigation.component';
import { HeaderCheckoutComponent } from './header/header-checkout/header-checkout.component';
import { HeaderDefaultComponent } from './header/header-default/header-default.component';
import { HeaderNavigationComponent } from './header/header-navigation/header-navigation.component';
import { HeaderSimpleComponent } from './header/header-simple/header-simple.component';
import { HeaderComponent } from './header/header/header.component';
import { LanguageSwitchComponent } from './header/language-switch/language-switch.component';
import { LoginStatusComponent } from './header/login-status/login-status.component';
import { MiniBasketComponent } from './header/mini-basket/mini-basket.component';
import { SearchBoxComponent } from './header/search-box/search-box.component';
import { SubCategoryNavigationComponent } from './header/sub-category-navigation/sub-category-navigation.component';
import { UserInformationMobileComponent } from './header/user-information-mobile/user-information-mobile.component';

const importExportModules = [
  CommonModule,
  DirectivesModule,
  ExtrasModule,
  FeatureToggleModule,
  IconModule,
  NgbCollapseModule,
  NgbDropdownModule,
  PipesModule,
  QuickorderExportsModule,
  RouterModule,
  TranslateModule,
  WishlistsExportsModule,
];

const exportedComponents = [
  CamfilBreadcrumbComponent,
  CamfilFooterComponent,
  CamfilHeaderComponent,
  CamfilHeaderDefaultComponent,
  CamfilHeaderNavigationComponent,
  CamfilIEModalComponent,
  CamfilLanguageSwitchComponent,
  CamfilLoginStatusComponent,
  CamfilMiniBasketComponent,
  CamfilProductCompareStatusComponent,
  CamfilSearchBoxComponent,
  CamfilUserLinksComponent,
  CookiesBannerComponent,
  FooterComponent,
  HeaderComponent,
  HeaderSimpleComponent,
  SearchBoxComponent,
];

@NgModule({
  imports: [
    ...importExportModules,
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
    RoleToggleModule,
    RouterModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [
    ...exportedComponents,
    CamfilHeaderNavigationComponent,
    CamfilLoginStatusComponent,
    CamfilMiniBasketComponent,
    CamfilProductCompareStatusComponent,
    CamfilSubCategoryNavigationComponent,
    CookiesBannerComponent,
    FooterComponent,
    HeaderCheckoutComponent,
    HeaderComponent,
    HeaderDefaultComponent,
    HeaderNavigationComponent,
    HeaderSimpleComponent,
    LanguageSwitchComponent,
    LoginStatusComponent,
    MiniBasketComponent,
    ProductCompareStatusComponent,
    SearchBoxComponent,
    SubCategoryNavigationComponent,
    UserInformationMobileComponent,
  ],
  exports: [...exportedComponents, ...importExportModules],
})
export class ShellModule {}
