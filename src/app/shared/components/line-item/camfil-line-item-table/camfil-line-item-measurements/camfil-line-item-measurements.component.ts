import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { OrderLineItem } from 'src/app/extensions/cam-account/models/orderLineItem/orderLineItem.interface';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { LineItem } from 'ish-core/models/line-item/line-item.model';

@Component({
  selector: 'camfil-line-item-measurements',
  templateUrl: './camfil-line-item-measurements.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilLineItemMeasurementsComponent implements OnInit {
  @Input() linetItem: Pick<OrderLineItem, 'width' | 'height' | 'diameter'> | Pick<LineItem, 'attributes'>;
  measurementText: string;

  ngOnInit() {
    if (this.linetItem) {
      this.measurementText = AttributeHelper.getMeasurementsText(this.linetItem);
    }
  }
}
