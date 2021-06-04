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
import { OrderLineItem } from 'src/app/extensions/cam-account/models/orderLineItem/orderLineItem.interface';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { Price } from 'ish-core/models/price/price.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

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
  @Input() lineItems: Partial<OrderLineItem>[];
  @Input() total: Price;
  @Input() lineItemViewType?: 'simple' | 'availability';
  @Input() deviceType: DeviceType;
  @Output() updateItem = new EventEmitter<LineItemUpdate>();
  @Output() deleteItem = new EventEmitter<string>();
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'rowNumber',
    'sku',
    'articleName',
    'orderedQty',
    'deliveredQty',
    'boxLabel',
    'deliveryDate',
    'totalRowCustomerPrice',
  ];
  lineItemsProcessed: MatTableDataSource<Partial<OrderLineItem>>;
  isMobileView = false;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.isMobileView = this.isMobile();
    this.lineItemsProcessed = new MatTableDataSource(this.lineItems);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.lineItems) {
      this.lineItemsProcessed = new MatTableDataSource(this.lineItems);
    }
    this.isMobileView = this.isMobile();
  }

  ngAfterViewInit() {
    this.lineItemsProcessed.sort = this.sort;
  }

  product$(sku: string) {
    return this.shoppingFacade.product$(sku, ProductCompletenessLevel.List);
  }

  measurement({ width, hight, diameter }: OrderLineItem) {
    if (!width && !hight && !diameter) {
      return;
    }
    return [width, hight, diameter].filter(e => e).join('x');
  }

  isMobile() {
    return this.deviceType === 'mobile'; // || this.deviceType === 'tablet';
  }

  handlePrice(value, currency): Price {
    return {
      value,
      currency,
      type: 'Money',
    };
  }
}
