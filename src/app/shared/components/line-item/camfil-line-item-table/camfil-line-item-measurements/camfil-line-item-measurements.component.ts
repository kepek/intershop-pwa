import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { OrderLineItem } from 'src/app/extensions/cam-account/models/orderLineItem/orderLineItem.interface';

@Component({
  selector: 'camfil-line-item-measurements',
  templateUrl: './camfil-line-item-measurements.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilLineItemMeasurementsComponent implements OnInit {
  @Input() linetItem: OrderLineItem;
  measurementText: string;

  ngOnInit() {
    if (this.linetItem) {
      this.measurementText = this.setMeasurementText(this.linetItem);
    }
  }

  setMeasurementText({ width, height, diameter }: OrderLineItem) {
    if (!width && !height && !diameter) {
      return '---';
    }
    return [width, height, diameter].filter(e => e).join('x');
  }
}
