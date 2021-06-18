import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CamfilIconsModule } from 'camfil-icons';

import { IconModule } from 'ish-core/icon.module';

import { CamfilCMSBigBannerWithButtonComponent } from './components/camfil-cms-big-banner-with-button/camfil-cms-big-banner-with-button.component';
import { CamfilCmsCookieDisclaimerComponent } from './components/camfil-cms-cookie-disclaimer/camfil-cms-cookie-disclaimer.component';
import { CamfilCmsEdpComponent } from './components/camfil-cms-edp/camfil-cms-edp.component';
import { CamfilCmsFaqComponent } from './components/camfil-cms-faq/camfil-cms-faq.component';
import { CamfilCMSImageTextButtonComponent } from './components/camfil-cms-image-text-button/camfil-cms-image-text-button.component';
import {
  CamfilCmsLightboxLinkArticleComponent,
  CamfilCmsLightboxLinkComponent,
} from './components/camfil-cms-lightbox-link/camfil-cms-lightbox-link.component';
import { CamfilCMSSmallImageTextLinkComponent } from './components/camfil-cms-small-image-text-link/camfil-cms-small-image-text-link.component';
import { CMSCarouselComponent } from './components/cms-carousel/cms-carousel.component';
import { CMSContainerComponent } from './components/cms-container/cms-container.component';
import { CMSDialogComponent } from './components/cms-dialog/cms-dialog.component';
import { CMSFreestyleComponent } from './components/cms-freestyle/cms-freestyle.component';
import { CMSImageEnhancedComponent } from './components/cms-image-enhanced/cms-image-enhanced.component';
import { CMSImageComponent } from './components/cms-image/cms-image.component';
import { CMSLandingPageComponent } from './components/cms-landing-page/cms-landing-page.component';
import { CMSProductListComponent } from './components/cms-product-list/cms-product-list.component';
import { CMSStandardPageComponent } from './components/cms-standard-page/cms-standard-page.component';
import { CMSStaticPageComponent } from './components/cms-static-page/cms-static-page.component';
import { CMSTextComponent } from './components/cms-text/cms-text.component';
import { CMSVideoComponent } from './components/cms-video/cms-video.component';
import { CMS_COMPONENT } from './configurations/injection-keys';
import { SfeAdapterService } from './sfe-adapter/sfe-adapter.service';

@NgModule({
  providers: [
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.text.pagelet2-Component',
        class: CMSTextComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.freeStyle.pagelet2-Component',
        class: CMSFreestyleComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.container.pagelet2-Component',
        class: CMSContainerComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.image.pagelet2-Component',
        class: CMSImageComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.imageEnhanced.pagelet2-Component',
        class: CMSImageEnhancedComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.carousel.pagelet2-Component',
        class: CMSCarouselComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.productListManual.pagelet2-Component',
        class: CMSProductListComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.video.pagelet2-Component',
        class: CMSVideoComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.shopping.landingPage.pagelet2-Component',
        class: CMSLandingPageComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.shopping.staticPage.pagelet2-Component',
        class: CMSStaticPageComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:pagevariant.standard.pagelet2-Pagevariant',
        class: CMSStandardPageComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'app_sf_base_cm:component.common.dialog.pagelet2-Component',
        class: CMSDialogComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'camfil_app_sf_base_cm:camfil.component.imageTextButton.pagelet2-Component',
        class: CamfilCMSImageTextButtonComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'camfil_app_sf_base_cm:camfil.component.smallImageTextLink.pagelet2-Component',
        class: CamfilCMSSmallImageTextLinkComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'camfil_app_sf_base_cm:camfil.component.bigBannerWithButton.pagelet2-Component',
        class: CamfilCMSBigBannerWithButtonComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'camfil_app_sf_base_cm:camfil.component.edp.pagelet2-Component',
        class: CamfilCmsEdpComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'camfil_app_sf_base_cm:camfil.component.faq.pagelet2-Component',
        class: CamfilCmsFaqComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'camfil_app_sf_base_cm:camfil.component.cookieDisclaimer.pagelet2-Component',
        class: CamfilCmsCookieDisclaimerComponent,
      },
      multi: true,
    },
    {
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: 'camfil_app_sf_base_cm:camfil.component.lightboxLink.pagelet2-Component',
        class: CamfilCmsLightboxLinkComponent,
      },
      multi: true,
    },
  ],
  declarations: [CamfilCmsLightboxLinkArticleComponent, CamfilCmsLightboxLinkComponent],
  imports: [CamfilIconsModule, CommonModule, IconModule, MatIconModule],
})
export class CMSModule {
  constructor(sfeAdapter: SfeAdapterService) {
    sfeAdapter.init();
  }
}
