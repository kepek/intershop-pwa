import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { PriceItemHelper } from 'ish-core/models/price-item/price-item.helper';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { AuthorizationToggleService } from 'ish-core/utils/authorization-toggle/authorization-toggle.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { CamConfigurationFacade } from '../../../extensions/cam-configuration/facades/cam-configuration.facade';

import { Price } from './price.model';

export function formatPrice(price: Price, lang: string, currencyForChanel?: string): string {
  const symbol = currencyForChanel
    ? getCurrencySymbol(currencyForChanel, 'wide', lang)
    : getCurrencySymbol(price.currency, 'wide', lang);
  return formatCurrency(price.value, lang, symbol);
}

@Pipe({ name: 'ishPrice', pure: false })
export class PricePipe implements PipeTransform, OnDestroy {
  displayText: string;
  viewPricesPermissions = ['APP_B2B_VIEW_PRICES'];
  isViewPrices = false;
  logIn = false;
  currencyForChanel = 'USD';

  private destroy$ = new Subject();

  constructor(
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef,
    private accountFacade: AccountFacade,
    private authorizationToggle: AuthorizationToggleService,
    private appFacade: AppFacade,
    private camConfFacade: CamConfigurationFacade
  ) {}
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  transform(data: Price | PriceItem, priceType?: 'gross' | 'net'): string {
    this.authorizationToggle
      .isAuthorizedToCheckArrAll(this.viewPricesPermissions)
      .pipe(take(1))
      .subscribe(permitted => {
        this.isViewPrices = permitted;
        this.logIn = true;
        this.cdRef.markForCheck();
      });

    if (!this.logIn) {
      this.camConfFacade.showPricesForNonLoggedInUser$.pipe(take(1)).subscribe(val => {
        this.isViewPrices = val;
      });
    }

    this.appFacade.getCurrencyByChannel$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(currencyForChanel => {
      this.currencyForChanel = currencyForChanel;
    });

    const checkIfZeroPrice = priceData =>
      ('value' in priceData && priceData.value === 0) ||
      ('gross' in priceData && priceData.gross === 0 && 'net' in priceData && priceData.net === 0);

    if (!this.isViewPrices || !data || checkIfZeroPrice(data)) {
      return '-';
    }

    if (!data) {
      return this.translateService.instant('product.price.na.text');
    }

    if (!this.translateService.currentLang) {
      return 'N/A';
    }

    switch (data.type) {
      case 'PriceItem':
        if (priceType) {
          return formatPrice(PriceItemHelper.selectType(data, priceType), this.translateService.currentLang);
        }
        this.accountFacade.userPriceDisplayType$.pipe(takeUntil(this.destroy$)).subscribe(type => {
          this.displayText = formatPrice(PriceItemHelper.selectType(data, type), this.translateService.currentLang);
          this.cdRef.markForCheck();
        });
        return this.displayText;
      default:
        return data.value <= 0
          ? formatPrice(data as Price, this.translateService.currentLang, this.currencyForChanel)
          : formatPrice(data as Price, this.translateService.currentLang);
    }
  }
}
