import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { PriceItemHelper } from 'ish-core/models/price-item/price-item.helper';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { Price } from 'ish-core/models/price/price.model';

@Pipe({ name: 'camfilPriceSummary', pure: true })
export class CamfilPriceSummaryPipe implements PipeTransform, OnDestroy {
  private destroy$ = new Subject();

  constructor(private accountFacade: AccountFacade) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  transform(data: Price | PriceItem, quantity = 1, priceType?: 'gross' | 'net'): Price {
    let raw: Price;

    if (!data) {
      return undefined as Price;
    }

    if (data.type === 'PriceItem') {
      raw = PriceItemHelper.selectType(data, priceType);

      this.accountFacade.userPriceDisplayType$.pipe(takeUntil(this.destroy$)).subscribe(type => {
        raw = PriceItemHelper.selectType(data, type);
      });
    } else {
      raw = data;
    }

    const price: Price = { currency: 'USD', value: raw.value || 0, ...raw };

    price.value = price.value * quantity;

    return price;
  }
}
