import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDetailsComponent implements OnInit {
  @Input() product: Product;
  @Input() quantityForm: FormGroup;

  MEASUREMENTS = ['measurementWidth', 'measurementHeight', 'measurementDiameter'];

  maxVal: number;
  showError: boolean;
  filledMeasurements: any[];
  requiresMeasurement: boolean;
  validators = {
    boxLabel: [
      {
        error: 'maxlength',
        message: 'camfil.modal.createCamcard.input.box_label.error.maxLength',
      },
    ],
  };
  ngOnInit() {
    const attributes =
      this.product.attributeGroups?.[AttributeGroupTypes.ProductsListLabelAttributes]?.attributes ||
      this.product.attributes ||
      [];
    this.maxVal = AttributeHelper.getAttributeValueByAttributeName(attributes, 'Width') || undefined;
    this.requiresMeasurement = ProductHelper.getRequiresMeasurement(this.product);
  }

  getField(name: string) {
    return this.quantityForm.get(name);
  }

  validateVal() {
    if (this.maxVal) {
      this.filledMeasurements = this.MEASUREMENTS.map(val => this.getField(val).value).filter(val => val);
      this.showError = !this.filledMeasurements.find(val => this.maxVal > val);
    }
  }
}
