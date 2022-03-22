import { Component, Input, OnInit } from '@angular/core';

import { QuoteDetails } from '../../../../models/quote-details/quote-details.model';

@Component({
  selector: 'camfil-quote-details',
  templateUrl: './quote-details.component.html',
  styleUrls: ['./quote-details.component.scss'],
})
export class QuoteDetailsComponent implements OnInit {
  @Input() details: QuoteDetails;

  constructor() {}

  ngOnInit(): void {}
}
