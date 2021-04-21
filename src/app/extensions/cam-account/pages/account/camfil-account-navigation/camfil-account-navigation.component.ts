import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

interface NavigationItems {
  [link: string]: {
    localizationKey: string;
    dataTestingId?: string;
    feature?: string;
    permissions?: string[];
    children?: NavigationItems;
  };
}

@Component({
  selector: 'camfil-account-navigation',
  templateUrl: './camfil-account-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CamfilAccountNavigationComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() deviceType: DeviceType;

  isMobileView = false;

  /**
   * Manages the Account Navigation items.
   */
  navigationItems: NavigationItems = {
    '/account': { localizationKey: 'account.my_account.link' },
    '/account/profile': { localizationKey: 'camfil.account.profile.link' },
    '/account/camcards': {
      localizationKey: 'camfil.account.cam_card.link',
      feature: 'camCards',
      dataTestingId: 'cam-cards-link',
    },
    '/account/orders': {
      localizationKey: 'account.order_history.link',
      permissions: ['APP_B2B_MANAGE_ALL_ORDERS', 'APP_B2B_MANAGE_OWN_ORDERS'],
    },
    '/account/organization': {
      localizationKey: 'camfil.account.organization.user_management',
      feature: 'camOrganizationManagement',
      permissions: ['APP_B2B_MANAGE_USERS'],
    },
    '/logout': { localizationKey: 'account.navigation.logout.link' },
  };

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.isMobileView = this.deviceType === 'tablet' || this.deviceType === 'mobile';
  }

  ngOnChanges() {
    this.isMobileView = this.deviceType === 'tablet' || this.deviceType === 'mobile';
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cdr.markForCheck();
    }, 500);
  }

  get currentPath() {
    return location.pathname;
  }

  navigateTo(link) {
    if (link) {
      this.router.navigate([link]);
    }
  }

  get unsorted() {
    return () => 0;
  }
}
