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
  volumeDiscount: number;

  ngOnInit() {
    this.volumeDiscount = 0;
  }

  handlePrice(value): Price {
    return {
      value,
      currency: this.currency,
      type: 'Money',
    };
  }
}
