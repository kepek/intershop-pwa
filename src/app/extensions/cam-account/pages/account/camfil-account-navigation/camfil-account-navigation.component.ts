import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { checkPermission } from 'ish-core/utils/authorization-toggle/authorization-toggle.service';
import { whenTruthy } from 'ish-core/utils/operators';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAccountNavigationComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() deviceType: DeviceType;

  isMobileView = false;
  loading = true;
  /**
   * Manages the Account Navigation items.
   */
  navigationItems: NavigationItems = {
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
  permissions: string[] = [];

  private destroy$ = new Subject();
  constructor(private router: Router, private cdr: ChangeDetectorRef, private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.isMobileView = this.deviceType === 'tablet' || this.deviceType === 'mobile';
    this.accountFacade.userPermissions$.pipe(whenTruthy()).subscribe(permissions => {
      this.permissions = permissions;
      if (permissions) {
        this.loading = false;
        this.refreshLinkList();
      }
    });
  }

  ngOnChanges() {
    this.isMobileView = this.deviceType === 'tablet' || this.deviceType === 'mobile';
    this.refreshLinkList();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cdr.markForCheck();
    }, 500);
  }

  refreshLinkList() {
    this.cdr.detectChanges();
  }

  checkUserPermissionToLink(permission: string): boolean {
    // const permObservable = toObservable(permission)
    if (permission === 'always' || permission === 'never') {
      return checkPermission([], permission);
    }
    return checkPermission(this.permissions, permission);
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
