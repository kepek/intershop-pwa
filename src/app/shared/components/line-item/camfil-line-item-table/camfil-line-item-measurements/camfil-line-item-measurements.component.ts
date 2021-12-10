import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { LineItem } from 'ish-core/models/line-item/line-item.model';

import { OrderLineItem } from '../../../../../extensions/cam-account/models/order-line-item/order-line-item.model';

@Component({
  selector: 'camfil-line-item-measurements',
  templateUrl: './camfil-line-item-measurements.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilLineItemMeasurementsComponent implements OnInit {
  @Input() linetItem: Pick<OrderLineItem, 'width' | 'height' | 'diameter' | 'depth'> | Pick<LineItem, 'attributes'>;
  measurementText: string;

  ngOnInit() {
    if (this.linetItem) {
      this.measurementText = AttributeHelper.getMeasurementsText(this.linetItem);
    }
  }
}
