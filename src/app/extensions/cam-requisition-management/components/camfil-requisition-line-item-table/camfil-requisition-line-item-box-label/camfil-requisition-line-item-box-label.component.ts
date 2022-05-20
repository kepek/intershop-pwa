import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { LineItem, LineItemView } from 'ish-core/models/line-item/line-item.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamRequisitionManagementFacade } from '../../../facades/cam-requisition-management.facade';
import { CamfilRequisition } from '../../../models/camfil-requisition/camfil-requisition.model';

@Component({
  selector: 'camfil-requisition-line-item-box-label',
  templateUrl: './camfil-requisition-line-item-box-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilRequisitionLineItemBoxLabelComponent implements OnInit {
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @Input() lineItem: LineItemView;
  @Input() requisition: CamfilRequisition;
  @Input() isEditable = false;
  boxLabelForm: FormGroup;
  boxLabel: string;

  constructor(private camRequisitionManagementFacade: CamRequisitionManagementFacade) {}
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

  onBlur(target: HTMLDataElement, form: FormGroup) {
    if (form.invalid) {
      markAsDirtyRecursive(form);
      return;
    }

    let value: string = target.value;

    this.camRequisitionManagementFacade.updateCamfilRequisitionLineItem(this.requisition.id, {
      lineItemId: this.lineItem.id,
      boxLabel: value,
    });
  }
}
