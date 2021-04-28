// tslint:disable: ish-ordered-imports ban-specific-imports
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import {
  NgbCarouselModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { DeferLoadModule } from '@trademe/ng-defer-load';
import { CamfilIconsModule } from 'camfil-icons';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SwiperModule } from 'ngx-swiper-wrapper';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';
import { CamfilBannerComponent } from 'ish-shared/components/camfil-banner/camfil-banner.component';
import { CamfilBulletListComponent } from 'ish-shared/components/common/camfil-bullet-list/camfil-bullet-list.component';
import { CamfilCamCardModalComponent } from 'ish-shared/components/common/camfil-cam-card-modal/camfil-cam-card-modal.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilHeaderBoxComponent } from 'ish-shared/components/common/camfil-header-box/camfil-header-box.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { CamfilProductAddToBasketModalComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket-modal/camfil-product-add-to-basket-modal.component';
import { CamfilProductGuidesComponent } from 'ish-shared/components/product/camfil-product-guides/camfil-product-guides.component';
import { MaterialModule } from 'ish-shared/material/material.module';

import { CamAccountExportsModule } from '../extensions/cam-account/exports/cam-account-exports.module';
import { CamAhuExportsModule } from '../extensions/cam-ahu/exports/cam-ahu-exports.module';
import { CamCaptchaExportsModule } from '../extensions/cam-captcha/exports/cam-captcha-exports.module';
import { CamCardsExportsModule } from '../extensions/cam-cards/exports/cam-cards-exports.module';
import { CamConfigurationExportsModule } from '../extensions/cam-configuration/exports/cam-configuration-exports.module';
import { CamDemoExportsModule } from '../extensions/cam-demo/exports/cam-demo-exports.module';
import { CamIccExportsModule } from '../extensions/cam-icc/exports/cam-icc-exports.module';
import { CamOrganizationManagementExportsModule } from '../extensions/cam-organization-management/exports/cam-organization-management-exports.module';
import { CaptchaExportsModule } from '../extensions/captcha/exports/captcha-exports.module';
import { OrderTemplatesExportsModule } from '../extensions/order-templates/exports/order-templates-exports.module';
import { QuickorderExportsModule } from '../extensions/quickorder/exports/quickorder-exports.module';
import { QuotingExportsModule } from '../extensions/quoting/exports/quoting-exports.module';
import { TactonExportsModule } from '../extensions/tacton/exports/tacton-exports.module';
import { WishlistsExportsModule } from '../extensions/wishlists/exports/wishlists-exports.module';

import { ModalAddNewProductComponent } from '../extensions/cam-cards/pages/account-cam-card-detail/modal-add-new-product/modal-add-new-product.component';
import { AddToCartModalComponent } from '../extensions/cam-cards/shared/add-to-cart-modal/add-to-cart-modal.component';
import { CamCardModalDetailsComponent } from '../extensions/cam-cards/shared/add-to-cart-modal/cam-card-modal-details/cam-card-modal-details.component';
import { CreateOrderModalComponent } from '../extensions/cam-cards/shared/add-to-cart-modal/create-order-modal/create-order-modal.component';
import { OrderFormComponent } from '../extensions/cam-cards/shared/add-to-cart-modal/create-order-modal/order-form/order-form.component';
import { CreateOrderSuccessComponent } from '../extensions/cam-cards/shared/add-to-cart-modal/create-order-success/create-order-success.component';
import { ArticleDetailsComponent } from '../extensions/cam-cards/shared/select-cam-card-modal/article-details/article-details.component';

import { AddressFormsSharedModule } from './address-forms/address-forms.module';
import { CMSModule } from './cms/cms.module';
import { CamfilCMSBigBannerWithButtonComponent } from './cms/components/camfil-cms-big-banner-with-button/camfil-cms-big-banner-with-button.component';
import { CamfilCmsCookieDisclaimerComponent } from './cms/components/camfil-cms-cookie-disclaimer/camfil-cms-cookie-disclaimer.component';
import { CamfilCmsEdpComponent } from './cms/components/camfil-cms-edp/camfil-cms-edp.component';
import { CamfilCmsFaqComponent } from './cms/components/camfil-cms-faq/camfil-cms-faq.component';
import { CamfilCMSImageTextButtonComponent } from './cms/components/camfil-cms-image-text-button/camfil-cms-image-text-button.component';
import { CamfilCMSSmallImageTextLinkComponent } from './cms/components/camfil-cms-small-image-text-link/camfil-cms-small-image-text-link.component';
import { CMSCarouselComponent } from './cms/components/cms-carousel/cms-carousel.component';
import { CMSContainerComponent } from './cms/components/cms-container/cms-container.component';
import { CMSDialogComponent } from './cms/components/cms-dialog/cms-dialog.component';
import { CMSFreestyleComponent } from './cms/components/cms-freestyle/cms-freestyle.component';
import { CMSImageEnhancedComponent } from './cms/components/cms-image-enhanced/cms-image-enhanced.component';
import { CMSImageComponent } from './cms/components/cms-image/cms-image.component';
import { CMSLandingPageComponent } from './cms/components/cms-landing-page/cms-landing-page.component';
import { CMSProductListComponent } from './cms/components/cms-product-list/cms-product-list.component';
import { CMSStandardPageComponent } from './cms/components/cms-standard-page/cms-standard-page.component';
import { CMSStaticPageComponent } from './cms/components/cms-static-page/cms-static-page.component';
import { CMSTextComponent } from './cms/components/cms-text/cms-text.component';
import { CMSVideoComponent } from './cms/components/cms-video/cms-video.component';
import { ContentIncludeComponent } from './cms/components/content-include/content-include.component';
import { ContentPageletComponent } from './cms/components/content-pagelet/content-pagelet.component';
import { ContentSlotComponent } from './cms/components/content-slot/content-slot.component';
import { ContentViewcontextComponent } from './cms/components/content-viewcontext/content-viewcontext.component';
import { AddressComponent } from './components/address/address/address.component';
import { BasketAddressSummaryComponent } from './components/basket/basket-address-summary/basket-address-summary.component';
import { BasketApprovalInfoComponent } from './components/basket/basket-approval-info/basket-approval-info.component';
import { BasketBuyerComponent } from './components/basket/basket-buyer/basket-buyer.component';
import { BasketCostSummaryComponent } from './components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketInfoComponent } from './components/basket/basket-info/basket-info.component';
import { BasketItemsSummaryComponent } from './components/basket/basket-items-summary/basket-items-summary.component';
import { BasketPromotionCodeComponent } from './components/basket/basket-promotion-code/basket-promotion-code.component';
import { BasketPromotionComponent } from './components/basket/basket-promotion/basket-promotion.component';
import { BasketValidationItemsComponent } from './components/basket/basket-validation-items/basket-validation-items.component';
import { BasketValidationProductsComponent } from './components/basket/basket-validation-products/basket-validation-products.component';
import { BasketValidationResultsComponent } from './components/basket/basket-validation-results/basket-validation-results.component';
import { CamfilBasketCostSummaryComponent } from './components/basket/camfil-basket-cost-summary/camfil-basket-cost-summary.component';
import { BasketInvoiceAddressWidgetComponent } from './components/checkout/basket-invoice-address-widget/basket-invoice-address-widget.component';
import { BasketShippingAddressWidgetComponent } from './components/checkout/basket-shipping-address-widget/basket-shipping-address-widget.component';
import { AccordionItemComponent } from './components/common/accordion-item/accordion-item.component';
import { AccordionComponent } from './components/common/accordion/accordion.component';
import { CamfilLinksBlockComponent } from './components/common/camfil-links-block/camfil-links-block.component';
import { CamfilModalDialogComponent } from './components/common/camfil-modal-dialog/camfil-modal-dialog.component';
import { CamfilQuickViewModalComponent } from './components/common/camfil-quick-view-modal/camfil-quick-view-modal.component';
import { ErrorMessageComponent } from './components/common/error-message/error-message.component';
import { InfoBoxComponent } from './components/common/info-box/info-box.component';
import { InplaceEditComponent } from './components/common/inplace-edit/inplace-edit.component';
import { LoadingComponent } from './components/common/loading/loading.component';
import { ModalDialogLinkComponent } from './components/common/modal-dialog-link/modal-dialog-link.component';
import { ModalDialogComponent } from './components/common/modal-dialog/modal-dialog.component';
import { SuccessMessageComponent } from './components/common/success-message/success-message.component';
import { CamfilFilterCollapsableComponent } from './components/filter/camfil-filter-collapsable/camfil-filter-collapsable.component';
import { CamfilFilterDropdownComponent } from './components/filter/camfil-filter-dropdown/camfil-filter-dropdown.component';
import { CamfilFilterInfoComponent } from './components/filter/camfil-filter-info/camfil-filter-info.component';
import { CamfilFilterMeasurementsComponent } from './components/filter/camfil-filter-measurements/camfil-filter-measurements.component';
import { CamfilFilterNavigationComponent } from './components/filter/camfil-filter-navigation/camfil-filter-navigation.component';
import { CamfilFilterTextComponent } from './components/filter/camfil-filter-text/camfil-filter-text.component';
import { FilterCheckboxComponent } from './components/filter/filter-checkbox/filter-checkbox.component';
import { FilterCollapsableComponent } from './components/filter/filter-collapsable/filter-collapsable.component';
import { FilterDropdownComponent } from './components/filter/filter-dropdown/filter-dropdown.component';
import { CamfilFilterNavigationBadgesComponent } from './components/filter/camfil-filter-navigation-badges/camfil-filter-navigation-badges.component';
import { FilterNavigationHorizontalComponent } from './components/filter/filter-navigation-horizontal/filter-navigation-horizontal.component';
import { FilterNavigationSidebarComponent } from './components/filter/filter-navigation-sidebar/filter-navigation-sidebar.component';
import { FilterNavigationComponent } from './components/filter/filter-navigation/filter-navigation.component';
import { FilterSwatchImagesComponent } from './components/filter/filter-swatch-images/filter-swatch-images.component';
import { FilterTextComponent } from './components/filter/filter-text/filter-text.component';
import { CamfilLineItemTableComponent } from './components/line-item/camfil-line-item-table/camfil-line-item-table.component';
import { LineItemDescriptionComponent } from './components/line-item/line-item-description/line-item-description.component';
import { LineItemEditDialogComponent } from './components/line-item/line-item-edit-dialog/line-item-edit-dialog.component';
import { LineItemEditComponent } from './components/line-item/line-item-edit/line-item-edit.component';
import { LineItemListComponent } from './components/line-item/line-item-list/line-item-list.component';
import { Auth0SigninComponent } from './components/login/auth0-signin/auth0-signin.component';
import { IdentityProviderLoginComponent } from './components/login/identity-provider-login/identity-provider-login.component';
import { LoginFormComponent } from './components/login/login-form/login-form.component';
import { LoginModalComponent } from './components/login/login-modal/login-modal.component';
import { CamfilOrderListComponent } from './components/order/camfil-order-list/camfil-order-list.component';
import { OrderListComponent } from './components/order/order-list/order-list.component';
import { OrderWidgetComponent } from './components/order/order-widget/order-widget.component';
import { CamfilProductAddToBasketComponent } from './components/product/camfil-product-add-to-basket/camfil-product-add-to-basket.component';
import { CamfilProductAddToCompareComponent } from './components/product/camfil-product-add-to-compare/camfil-product-add-to-compare.component';
import { CamfilProductAttributeComponent } from './components/product/camfil-product-attribute/camfil-product-attribute.component';
import { CamfilProductAttributesComponent } from './components/product/camfil-product-attributes/camfil-product-attributes.component';
import { CamfilProductIdComponent } from './components/product/camfil-product-id/camfil-product-id.component';
import { CamfilProductInventoryComponent } from './components/product/camfil-product-inventory/camfil-product-inventory.component';
import { CamfilProductItemBaseComponent } from './components/product/camfil-product-item-base/camfil-product-item-base.component';
import { CamfilProductItemDetailedComponent } from './components/product/camfil-product-item-detailed/camfil-product-item-detailed.component';
import { CamfilProductItemSimpleComponent } from './components/product/camfil-product-item-simple/camfil-product-item-simple.component';
import { CamfilProductItemComponent } from './components/product/camfil-product-item/camfil-product-item.component';
import { CamfilProductLabelComponent } from './components/product/camfil-product-label/camfil-product-label.component';
import { CamfilProductListToolbarComponent } from './components/product/camfil-product-list-toolbar/camfil-product-list-toolbar.component';
import { CamfilProductListComponent } from './components/product/camfil-product-list/camfil-product-list.component';
import { CamfilProductListingComponent } from './components/product/camfil-product-listing/camfil-product-listing.component';
import { CamfilProductPriceComponent } from './components/product/camfil-product-price/camfil-product-price.component';
import { CamfilProductPromotionComponent } from './components/product/camfil-product-promotion/camfil-product-promotion.component';
import { CamfilProductQuantityComponent } from './components/product/camfil-product-quantity/camfil-product-quantity.component';
import { CamfilProductQuickviewComponent } from './components/product/camfil-product-quickview/camfil-product-quickview.component';
import { CamfilProductRatingStarComponent } from './components/product/camfil-product-rating-star/camfil-product-rating-star.component';
import { CamfilProductRatingComponent } from './components/product/camfil-product-rating/camfil-product-rating.component';
import { CamfilProductShipmentComponent } from './components/product/camfil-product-shipment/camfil-product-shipment.component';
import { CamfilProductTitleComponent } from './components/product/camfil-product-title/camfil-product-title.component';
import { CamfilProductVariationSelectComponent } from './components/product/camfil-product-variation-select/camfil-product-variation-select.component';
import { ProductAddToBasketComponent } from './components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductAddToCompareComponent } from './components/product/product-add-to-compare/product-add-to-compare.component';
import { ProductAttributesComponent } from './components/product/product-attributes/product-attributes.component';
import { ProductBundleDisplayComponent } from './components/product/product-bundle-display/product-bundle-display.component';
import { ProductIdComponent } from './components/product/product-id/product-id.component';
import { ProductInventoryComponent } from './components/product/product-inventory/product-inventory.component';
import { ProductItemComponent } from './components/product/product-item/product-item.component';
import { ProductLabelComponent } from './components/product/product-label/product-label.component';
import { ProductListPagingComponent } from './components/product/product-list-paging/product-list-paging.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductPriceComponent } from './components/product/product-price/product-price.component';
import { ProductPromotionComponent } from './components/product/product-promotion/product-promotion.component';
import { ProductQuantityComponent } from './components/product/product-quantity/product-quantity.component';
import { ProductRatingStarComponent } from './components/product/product-rating-star/product-rating-star.component';
import { ProductRatingComponent } from './components/product/product-rating/product-rating.component';
import { ProductRowComponent } from './components/product/product-row/product-row.component';
import { ProductShipmentComponent } from './components/product/product-shipment/product-shipment.component';
import { ProductTileComponent } from './components/product/product-tile/product-tile.component';
import { ProductVariationDisplayComponent } from './components/product/product-variation-display/product-variation-display.component';
import { ProductVariationSelectComponent } from './components/product/product-variation-select/product-variation-select.component';
import { PromotionDetailsComponent } from './components/promotion/promotion-details/promotion-details.component';
import { PromotionRemoveComponent } from './components/promotion/promotion-remove/promotion-remove.component';
import { RecentlyViewedComponent } from './components/recently/recently-viewed/recently-viewed.component';
import { FormsDynamicModule } from './forms-dynamic/forms-dynamic.module';
import { FormsSharedModule } from './forms/forms.module';
import { CamfilProductTechnicalDocumentsComponent } from './components/common/camfil-product-technical-documents/camfil-product-technical-documents.component';
import { CamfilCategoryBoxComponent } from '../pages/camfil-category/camfil-category-box/camfil-category-box.component';
import { DATAPICKER_PROVIDERS_FORMAT } from './material/models/material.helper';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { CamfilProductImageComponent } from 'ish-shared/components/product/camfil-product-image/camfil-product-image.component';
import { DirectivesModule } from 'ish-core/directives.module';
import { ProductLinksListComponent } from '../pages/product/product-links-list/product-links-list.component';
import { CamfilProductLinksComponent } from '../pages/product/camfil-product-links/camfil-product-links.component';
import { RetailSetPartsComponent } from '../pages/product/retail-set-parts/retail-set-parts.component';
import { CamfilProductLinksCarouselComponent } from '../pages/product/camfil-product-links-carousel/camfil-product-links-carousel.component';
import { ProductMasterVariationsComponent } from '../pages/product/product-master-variations/product-master-variations.component';
import { ProductBundlePartsComponent } from '../pages/product/product-bundle-parts/product-bundle-parts.component';
import { ProductDetailActionsComponent } from '../pages/product/product-detail-actions/product-detail-actions.component';
import { ProductDetailComponent } from '../pages/product/product-detail/product-detail.component';
import { ProductImagesComponent } from '../pages/product/product-images/product-images.component';
import { ProductLinksCarouselComponent } from '../pages/product/product-links-carousel/product-links-carousel.component';
import { ProductLinksComponent } from '../pages/product/product-links/product-links.component';
import { ProductPageComponent } from '../pages/product/product-page.component';
import { CamfilMyPageHeaderComponent } from 'ish-shared/components/camfil-my-page-header/camfil-my-page-header.component';
import { CamfilAuthorizationToggleDirective } from 'ish-core/directives/camfil-authorization-toggle.directive';

const importExportModules = [
  AddressFormsSharedModule,
  AuthorizationToggleModule,
  CMSModule,
  CamAccountExportsModule,
  CamAhuExportsModule,
  CamCaptchaExportsModule,
  CamCardsExportsModule,
  CamConfigurationExportsModule,
  CamDemoExportsModule,
  CamIccExportsModule,
  CamOrganizationManagementExportsModule,
  CamfilIconsModule,
  CaptchaExportsModule,
  CommonModule,
  DeferLoadModule,
  DirectivesModule,
  FeatureToggleModule,
  FormlyModule,
  FormsDynamicModule,
  FormsModule,
  FormsSharedModule,
  IconModule,
  InfiniteScrollModule,
  MaterialModule,
  NgbCarouselModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbPopoverModule,
  OrderTemplatesExportsModule,
  PipesModule,
  QuickorderExportsModule,
  QuotingExportsModule,
  ReactiveFormsModule,
  RouterModule,
  SwiperModule,
  TactonExportsModule,
  TranslateModule,
  WishlistsExportsModule,
];

const declaredComponents = [
  AddToCartModalComponent,
  ArticleDetailsComponent,
  Auth0SigninComponent,
  BasketCostSummaryComponent,
  BasketValidationItemsComponent,
  BasketValidationProductsComponent,
  CMSCarouselComponent,
  CMSContainerComponent,
  CMSDialogComponent,
  CMSFreestyleComponent,
  CMSImageComponent,
  CMSImageEnhancedComponent,
  CMSLandingPageComponent,
  CMSProductListComponent,
  CMSStandardPageComponent,
  CMSStaticPageComponent,
  CMSTextComponent,
  CMSVideoComponent,
  CamCardModalDetailsComponent,
  CamfilAuthorizationToggleDirective,
  CamfilBannerComponent,
  CamfilBulletListComponent,
  CamfilCMSBigBannerWithButtonComponent,
  CamfilCMSImageTextButtonComponent,
  CamfilCMSSmallImageTextLinkComponent,
  CamfilCamCardModalComponent,
  CamfilCmsCookieDisclaimerComponent,
  CamfilCmsEdpComponent,
  CamfilCmsFaqComponent,
  CamfilErrorComponent,
  CamfilFilterCollapsableComponent,
  CamfilFilterDropdownComponent,
  CamfilFilterNavigationBadgesComponent,
  CamfilFilterTextComponent,
  CamfilProductAddToBasketModalComponent,
  CamfilProductAttributeComponent,
  CamfilProductAttributesComponent,
  CamfilProductGuidesComponent,
  CamfilProductIdComponent,
  CamfilProductItemBaseComponent,
  CamfilProductItemDetailedComponent,
  CamfilProductItemSimpleComponent,
  CamfilProductLabelComponent,
  CamfilProductListComponent,
  CamfilProductListToolbarComponent,
  CamfilProductQuickviewComponent,
  CamfilProductRatingStarComponent,
  CamfilProductTechnicalDocumentsComponent,
  CamfilProductTitleComponent,
  CamfilSmallCtaModalComponent,
  ContentSlotComponent,
  CreateOrderModalComponent,
  CreateOrderSuccessComponent,
  FilterCheckboxComponent,
  FilterCollapsableComponent,
  FilterDropdownComponent,
  FilterNavigationComponent,
  FilterNavigationHorizontalComponent,
  FilterNavigationSidebarComponent,
  FilterSwatchImagesComponent,
  FilterTextComponent,
  LineItemDescriptionComponent,
  LineItemEditComponent,
  LineItemEditDialogComponent,
  LineItemListComponent,
  LoginFormComponent,
  LoginModalComponent,
  ModalAddNewProductComponent,
  ModalDialogComponent,
  OrderFormComponent,
  OrderListComponent,
  ProductAddToBasketComponent,
  ProductAddToCompareComponent,
  ProductIdComponent,
  ProductInventoryComponent,
  ProductItemComponent,
  ProductLabelComponent,
  ProductListComponent,
  ProductListPagingComponent,
  ProductPriceComponent,
  ProductPromotionComponent,
  ProductQuantityComponent,
  ProductRatingComponent,
  ProductRatingStarComponent,
  ProductRowComponent,
  ProductShipmentComponent,
  ProductTileComponent,
  ProductVariationSelectComponent,
];

const exportedComponents = [
  AccordionComponent,
  AccordionItemComponent,
  AddToCartModalComponent,
  AddressComponent,
  ArticleDetailsComponent,
  BasketAddressSummaryComponent,
  BasketApprovalInfoComponent,
  BasketBuyerComponent,
  BasketCostSummaryComponent,
  BasketInfoComponent,
  BasketInvoiceAddressWidgetComponent,
  BasketItemsSummaryComponent,
  BasketPromotionCodeComponent,
  BasketPromotionComponent,
  BasketShippingAddressWidgetComponent,
  BasketValidationResultsComponent,
  CamCardModalDetailsComponent,
  CamfilAuthorizationToggleDirective,
  CamfilBannerComponent,
  CamfilBasketCostSummaryComponent,
  CamfilBulletListComponent,
  CamfilCamCardModalComponent,
  CamfilCategoryBoxComponent,
  CamfilErrorComponent,
  CamfilFilterInfoComponent,
  CamfilFilterMeasurementsComponent,
  CamfilFilterNavigationComponent,
  CamfilHeaderBoxComponent,
  CamfilLineItemTableComponent,
  CamfilLinksBlockComponent,
  CamfilModalDialogComponent,
  CamfilMyPageHeaderComponent,
  CamfilOrderListComponent,
  CamfilProductAddToBasketComponent,
  CamfilProductAddToCompareComponent,
  CamfilProductAttributeComponent,
  CamfilProductAttributesComponent,
  CamfilProductGuidesComponent,
  CamfilProductIdComponent,
  CamfilProductImageComponent,
  CamfilProductInventoryComponent,
  CamfilProductItemComponent,
  CamfilProductLabelComponent,
  CamfilProductLinksCarouselComponent,
  CamfilProductLinksComponent,
  CamfilProductListingComponent,
  CamfilProductPriceComponent,
  CamfilProductPromotionComponent,
  CamfilProductQuantityComponent,
  CamfilProductRatingComponent,
  CamfilProductShipmentComponent,
  CamfilProductTechnicalDocumentsComponent,
  CamfilProductTitleComponent,
  CamfilProductVariationSelectComponent,
  CamfilQuickViewModalComponent,
  CamfilSmallCtaModalComponent,
  ContentIncludeComponent,
  ContentPageletComponent,
  ContentViewcontextComponent,
  CreateOrderModalComponent,
  CreateOrderSuccessComponent,
  ErrorMessageComponent,
  FilterNavigationComponent,
  IdentityProviderLoginComponent,
  InfoBoxComponent,
  InplaceEditComponent,
  LineItemListComponent,
  LoadingComponent,
  LoginFormComponent,
  ModalAddNewProductComponent,
  ModalDialogComponent,
  ModalDialogLinkComponent,
  OrderFormComponent,
  OrderListComponent,
  OrderWidgetComponent,
  ProductAddToBasketComponent,
  ProductAttributesComponent,
  ProductBundleDisplayComponent,
  ProductBundlePartsComponent,
  ProductDetailActionsComponent,
  ProductDetailComponent,
  ProductIdComponent,
  ProductImageComponent,
  ProductImagesComponent,
  ProductInventoryComponent,
  ProductItemComponent,
  ProductLinksCarouselComponent,
  ProductLinksComponent,
  ProductLinksListComponent,
  ProductMasterVariationsComponent,
  ProductPageComponent,
  ProductPriceComponent,
  ProductVariationDisplayComponent,
  PromotionDetailsComponent,
  PromotionRemoveComponent,
  RecentlyViewedComponent,
  RetailSetPartsComponent,
  SuccessMessageComponent,
];

@NgModule({
  imports: [
    ...importExportModules,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
  ],
  declarations: [...declaredComponents, ...exportedComponents],
  exports: [...exportedComponents, ...importExportModules],
  providers: [...DATAPICKER_PROVIDERS_FORMAT],
})
export class SharedModule {}
