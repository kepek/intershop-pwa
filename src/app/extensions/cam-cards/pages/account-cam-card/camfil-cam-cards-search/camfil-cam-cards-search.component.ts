import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { CamCard, CamCardCustomer } from '../../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-cam-cards-search',
  templateUrl: './camfil-cam-cards-search.component.html',
  styleUrls: ['./camfil-cam-cards-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCamCardsSearchComponent implements OnInit, OnChanges {
  @Input() count: number;
  @Input() camCards: CamCard[];
  @Output() queryChanged = new EventEmitter<string>();

  searchInput: string;
  selectInput: string;
  customers: CamCardCustomer[];

  ngOnInit() {
    this.searchInput = '';
    this.selectInput = '';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.camCards) {
      this.customers =
        this.camCards?.reduce((result, { customer }) => {
          if (!result.find(({ id }) => id === customer.id)) {
            result.push(customer);
          }
          return result;
        }, []) || [];
    }
  }

  submit(value) {
    this.queryChanged.emit(value);
  }
}
