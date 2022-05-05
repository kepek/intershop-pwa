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
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { CamfilRequisitionHelper } from '../../models/camfil-requisition/camfil-requisition.helper';
import { CamfilRequisition } from '../../models/camfil-requisition/camfil-requisition.model';

@Component({
  selector: 'camfil-requisition-line-item-table',
  templateUrl: './camfil-requisition-line-item-table.component.html',
  styleUrls: ['./camfil-requisition-line-item-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilRequisitionLineItemTableComponent implements OnInit, OnChanges {
  @Input() requisition: CamfilRequisition;
  @Input() lineItems: LineItem[];
  @Input() lineItemsChecked: string[];
  @Input() deviceType: DeviceType;
  @Output() checkAllLineItems = new EventEmitter<string[]>();
  @Output() removeSelectedProducts = new EventEmitter();
  @Output() removeSelectedProduct = new EventEmitter<string>();
  todayDate = new Date();
  lineItemsProcessed: MatTableDataSource<LineItem>;
  lineItemIdToDelete: string;
  displayedColumns: string[] = [
    'checkbox',
    'rowNumber',
    'image',
    'articleName',
    'sku',
    'quickView',
    'inventory',
    'boxLabel',
    'earliestDeliveryDate',
    'deleteRow',
    'quantity',
    'listPrice',
    'yourPrice',
  ];
  isMobileView = false;
  editable = true;
  getIsCamfilRequisitionEditable = CamfilRequisitionHelper.getIsCamfilRequisitionEditable;

  constructor(private shoppingFacade: ShoppingFacade, public dialog: MatDialog) {}

  ngOnInit() {
    this.isMobileView = this.deviceType === 'tablet' || this.deviceType === 'mobile';
    this.lineItemsProcessed = new MatTableDataSource(this.lineItems);
    this.editable = this.getIsCamfilRequisitionEditable(this.requisition?.approval);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.lineItems) {
      this.lineItemsProcessed = new MatTableDataSource(this.lineItems);
      console.log('this.lineItemsProcessed ', this.lineItemsProcessed);
    }
    this.isMobileView = this.deviceType === 'tablet' || this.deviceType === 'mobile';
  }

  product$(sku: string) {
    return this.shoppingFacade.product$(sku, ProductCompletenessLevel.List);
  }

  toggleAllLineItems(event: MatCheckboxChange) {
    if (event.checked) {
      const lineItemsChecked = this.lineItems
        .filter(li => li.requisitionLineItemStatus !== 'APPROVED')
        .map(lineItem => lineItem.id);
      this.checkAllLineItems.emit([...lineItemsChecked]);
    } else {
      this.checkAllLineItems.emit([]);
    }
  }

  toggleLineItemCheck(lineItem: LineItem, event: MatCheckboxChange) {
    if (event.checked) {
      this.checkAllLineItems.emit([...new Set([...this.lineItemsChecked, lineItem.id])]);
    } else {
      this.checkAllLineItems.emit([...this.lineItemsChecked].filter(el => el !== lineItem.id));
    }
  }

  isLineItemchecked(id: string) {
    return this.lineItemsChecked.findIndex(item => item === id) > -1;
  }

  areAllLineItemsChecked() {
    return this.lineItemsProcessed.data.length === this.lineItemsChecked.length;
  }

  openDeleteModal(modal: CamfilSmallCtaModalComponent, lineItemId) {
    if (this.getIsCamfilRequisitionEditable(this.requisition.approval)) {
      this.dialog.open(modal.show());
      modal.hide = () => this.dialog.closeAll();
      this.lineItemIdToDelete = lineItemId;
    }
  }

  removeProduct(modal: CamfilSmallCtaModalComponent) {
    if (this.getIsCamfilRequisitionEditable(this.requisition.approval)) {
      this.removeSelectedProduct.emit(this.lineItemIdToDelete);
      modal.hide();
    }
  }
}
