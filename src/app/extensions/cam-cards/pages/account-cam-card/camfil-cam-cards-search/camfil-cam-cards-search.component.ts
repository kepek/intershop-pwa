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
import { Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip, takeUntil } from 'rxjs/operators';

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
  @Output() queryChanged = new EventEmitter<{ query: string; customer?: CamCardCustomer }>();

  customers: CamCardCustomer[];

  private destroy$ = new Subject();
  private searchInput$ = new Subject<string>();
  private selectInput$ = new Subject<CamCardCustomer>();

  ngOnInit() {
    combineLatest([this.searchInput$.pipe(distinctUntilChanged()), this.selectInput$.pipe(distinctUntilChanged())])
      .pipe(debounceTime(500), skip(1), takeUntil(this.destroy$))
      .subscribe(([query, customer]) => {
        this.queryChanged.emit({
          query,
          customer,
        });
      });

    this.searchInput$.next(undefined);
    this.selectInput$.next(undefined);
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

  searchInputChanged({ value }) {
    this.searchInput$.next(value);
  }

  selectInputChanged({ value }) {
    this.selectInput$.next(value);
  }
}
