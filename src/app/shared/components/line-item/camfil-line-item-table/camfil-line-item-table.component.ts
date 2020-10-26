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
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { OrderLineItem } from 'ish-core/models/order/order.model';
import { Price } from 'ish-core/models/price/price.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';

/**
 * The Line Item table Component displays a line items.
 * It provides optional delete and edit functionality
 * It provides optional lineItemView (string 'simple')
 * It provides optional total cost output
 *
 * @example
 * <camfil-line-item-table
 *   [lineItems]="lineItems"
 *   [total]="total"
 *   lineItemViewType="simple"  // simple = no edit-button, inventory, shipment
 *   (updateItem)="onUpdateItem($event)"
 *   (deleteItem)="onDeleteItem($event)"
 * ></camfil-line-item-table>
 */
@Component({
  selector: 'camfil-line-item-table',
  templateUrl: './camfil-line-item-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-line-item-table.component.scss'],
})
export class CamfilLineItemTableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() lineItems: Partial<LineItemView & OrderLineItem>[];
  @Input() total: Price;
  @Input() lineItemViewType?: 'simple' | 'availability';
  @Output() updateItem = new EventEmitter<LineItemUpdate>();
  @Output() deleteItem = new EventEmitter<string>();
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'productSKU',
    'name',
    'orderedQty',
    'deliveredQty',
    'boxLabel',
    'deliveryDate',
    'price',
  ];
  lineItemsProcessed: MatTableDataSource<Partial<LineItemView & OrderLineItem>>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.lineItemsProcessed = new MatTableDataSource(this.lineItems);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.lineItems) {
      this.lineItemsProcessed = new MatTableDataSource(this.lineItems);
    }
  }

  ngAfterViewInit() {
    this.lineItemsProcessed.sort = this.sort;
  }

  product$(sku: string) {
    return this.shoppingFacade.product$(sku, ProductCompletenessLevel.List);
  }
}
