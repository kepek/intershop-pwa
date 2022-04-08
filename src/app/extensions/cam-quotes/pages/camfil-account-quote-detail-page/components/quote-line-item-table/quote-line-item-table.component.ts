import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { Price } from 'ish-core/models/price/price.model';
import { CamfilQuickViewModalComponent } from '../../../../../../shared/components/common/camfil-quick-view-modal/camfil-quick-view-modal.component';
import { QuoteLineItem } from '../../../../models/quote-details/quote-details.model';

@Component({
  selector: 'camfil-quote-line-item-table',
  templateUrl: './quote-line-item-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./quote-line-item-table.component.scss'],
})
export class QuoteLineItemTableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() lineItems: Partial<QuoteLineItem>[];
  @Input() isMobileView: boolean = false;
  @Output() updateItem = new EventEmitter<LineItemUpdate>();
  @Output() deleteItem = new EventEmitter<string>();
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'rowNumber',
    'thumbnail',
    'sku',
    'articleName',
    'originPrice',
    'customerPrice',
    'qty',
    'totalPrice'
  ];
  lineItemsProcessed: MatTableDataSource<Partial<QuoteLineItem>>;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.lineItemsProcessed = new MatTableDataSource(this.lineItems);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.lineItems) {
      this.lineItemsProcessed = new MatTableDataSource(this.lineItems);
      this.lineItemsProcessed.sort = this.sort;
    }
  }

  ngAfterViewInit() {
    this.lineItemsProcessed.sort = this.sort;
  }

  handlePrice(value, currency): Price {
    return {
      value,
      currency,
      type: 'Money',
    };
  }

  getRowNumber(item: QuoteLineItem) {
    return this.lineItems.findIndex(i => i.lineItemId === item.lineItemId) + 1;
  }

  openQuickViewDialog(sku: string) {
    this.dialog.open(CamfilQuickViewModalComponent, {
      width: '768px',
      autoFocus: false,
      data: { sku },
    });
  }
}
