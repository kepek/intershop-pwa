import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LineItem, LineItemView } from 'ish-core/models/line-item/line-item.model';

@Component({
  selector: 'camfil-requisition-line-item-box-label',
  templateUrl: './camfil-requisition-line-item-box-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilRequisitionLineItemBoxLabelComponent implements OnInit {
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @Input() lineItem: LineItemView;
  boxLabelForm: FormGroup;
  boxLabel: string;

  constructor() {}
  ngOnInit() {
    this.boxLabelForm = new FormGroup({
      boxLabel: new FormControl(''),
    });

    this.applyLineItemParameters(this.lineItem);
  }

  private applyLineItemParameters(lineItem: LineItem) {
    const boxLabel = (this.getValFromAttrs(lineItem, 'boxLabel') as string) || '';

    this.boxLabel = boxLabel;

    this.boxLabelForm?.get('boxLabel').setValue(boxLabel);
  }

  private getValFromAttrs(lineItem: LineItem, name: string) {
    return lineItem?.attributes?.find(att => att.name === name)?.value;
  }
}
