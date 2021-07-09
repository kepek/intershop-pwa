import { AnimationEvent } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import bottomOutAnimation from 'ish-core/animations/bottom-out.animation';
import { COOKIE_CONSENT_VERSION } from 'ish-core/configurations/state-keys';
import { ContentViewHelper } from 'ish-core/models/content-view/content-view.helper';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CookieConsentSettings } from 'ish-core/models/cookies/cookies.model';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

@Component({
  selector: 'camfil-cookie-disclaimer',
  templateUrl: './camfil-cms-cookie-disclaimer.component.html',
  styleUrls: ['./camfil-cms-cookie-disclaimer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [bottomOutAnimation()],
})
export class CamfilCmsCookieDisclaimerComponent implements CMSComponent, OnInit {
  @Input() pagelet: ContentPageletView;
  showBanner = false;
  transitionBanner = undefined;
  isRouterLink = ContentViewHelper.isRouterLink;
  routerLink = ContentViewHelper.getRouterLink;

  private destroy$ = new Subject();

  // tslint:disable:no-intelligence-in-artifacts
  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private transferState: TransferState,
    private cookiesService: CookiesService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.hideBanner();
      });

    this.showBannerIfNecessary();
  }

  /**
   * show banner if:
   * - consent not yet given
   * - consent outdated
   */
  showBannerIfNecessary() {
    if (isPlatformBrowser(this.platformId)) {
      const cookieConsentSettings = JSON.parse(
        this.cookiesService.get('cookieConsent') || 'null'
      ) as CookieConsentSettings;
      const cookieConsentVersion = this.transferState.get<number>(COOKIE_CONSENT_VERSION, 1);
      if (!cookieConsentSettings || cookieConsentSettings.version < cookieConsentVersion) {
        this.showBanner = true;
      }
    }
  }

  hideBanner() {
    this.showBanner = false;
    this.cdr.detectChanges();
  }

  acceptAll() {
    this.transitionBanner = 'bottom-out';
  }

  acceptAllAnimationDone(event: AnimationEvent): void {
    if (event.toState === 'bottom-out') {
      this.cookiesService.setCookiesConsentForAll();
      this.hideBanner();
    }
  }
}
