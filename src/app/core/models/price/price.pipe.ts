import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { PriceItemHelper } from 'ish-core/models/price-item/price-item.helper';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { AuthorizationToggleService } from 'ish-core/utils/authorization-toggle/authorization-toggle.service';

import { Price } from './price.model';
import { AppFacade } from 'ish-core/facades/app.facade';
import { whenTruthy } from 'ish-core/utils/operators';
import { Channel, ChannelCurrency } from '../channel/channel.types';

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
  isAuthorizedToViewPrices = false;
  currencyForChanel: string = 'EUR';

  private destroy$ = new Subject();

  constructor(
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef,
    private accountFacade: AccountFacade,
    private authorizationToggle: AuthorizationToggleService,
    private appFacade: AppFacade
  ) {}
  //get current locale - > currency
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  transform(data: Price | PriceItem, priceType?: 'gross' | 'net'): string {
    this.authorizationToggle
      .isAuthorizedToCheckArrAll(this.viewPricesPermissions)
      .pipe(take(1))
      .subscribe(permitted => {
        this.isAuthorizedToViewPrices = permitted;
      });

    this.appFacade.getCamfilChannel$.pipe(whenTruthy(), take(1)).subscribe(value => {
      const currentChanel = Object.entries(Channel).find(([, val]) => val === value) || [];
      const chanel = value ? currentChanel[0] : '';
      this.currencyForChanel = ChannelCurrency[chanel];
    });

    if (!this.isAuthorizedToViewPrices) {
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
