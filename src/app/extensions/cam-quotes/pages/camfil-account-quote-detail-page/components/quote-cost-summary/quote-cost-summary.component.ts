import { Component, Input, OnInit } from '@angular/core';

import { Price } from 'ish-core/models/price/price.model';

import { QuoteDetails } from '../../../../models/quote-details/quote-details.model';

@Component({
  selector: 'camfil-quote-cost-summary',
  templateUrl: './quote-cost-summary.component.html',
  styleUrls: ['./quote-cost-summary.component.scss'],
})
export class QuoteCostSummaryComponent implements OnInit {
  @Input() quote: QuoteDetails;

  currency = 'N/A';

  totalQuantity: number;
  listPrice: number;
  totalPrice: number;
  volumeDiscount: number;
  totalTaxes = 0;

  ngOnInit() {
    this.totalQuantity = 0;
    this.listPrice = 0;
    this.totalPrice = 0;
    this.volumeDiscount = 0;
    this.totalTaxes = 0;

    this.quote.items.forEach(item => {
      if (item.totalPrice.currency !== 'N/A') {
        this.currency = item.totalPrice.currency;
      }

      this.totalQuantity += item.quantity.value;
      this.listPrice += item.originTotalPrice.value;
      this.totalPrice += item.totalPrice.value;
    });
  }

  handlePrice(value): Price {
    return {
      value,
      currency: this.currency,
      type: 'Money',
    };
  }
}
