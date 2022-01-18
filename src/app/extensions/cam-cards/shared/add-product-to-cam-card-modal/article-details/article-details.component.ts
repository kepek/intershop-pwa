import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDetailsComponent implements OnInit, OnChanges {
  @Input() product: Product;
  @Input() quantityForm: FormGroup;
  @Input() showProductName?: boolean;
  @Input() isInAddNewProductModal?: boolean;
  @Input() showMeasurementsForm?: boolean;
  MEASUREMENTS = ['measurementWidth', 'measurementHeight', 'measurementDiameter'];
  validateFilterArea = ProductHelper.validateFilterArea;
  maxVal: number;
  showError: boolean;
  measurementGlobalError$: Observable<boolean>;
  filledMeasurements: any[];
  requiresMeasurement: boolean;
  filterArea: number;
  depth: number;
  filterAreaValidated = true;
  validators = {
    boxLabel: [
      {
        error: 'maxlength',
        message: 'camfil.modal.createCamcard.input.box_label.error.maxLength',
      },
    ],
  };
  attributes: Attribute<unknown>[];

  private patchAttributes(product: Product) {
    return product.attributeGroups?.[AttributeGroupTypes.ProductsListLabelAttributes]?.attributes || product.attributes;
  }

  private patchMaxVal() {
    const maxVal = AttributeHelper.getAttributeValueByAttributeName(this.attributes, 'Width');
    return maxVal ? (maxVal as number) : undefined;
  }

  private patchRequiresMeasurement(product) {
    return ProductHelper.getRequiresMeasurement(product);
  }

  private patchFilterArea(product) {
    return ProductHelper.getFilterArea(product);
  }

  private patchDepth(attributes) {
    const depth = AttributeHelper.getAttributeValueByAttributeName(attributes, 'MediaDepth');
    return depth ? (depth as number) : undefined;
  }

  ngOnInit() {
    this.measurementGlobalError$ = this.quantityForm.get('measurementErrorInfo')?.valueChanges;
  }

  ngOnChanges(): void {
    this.attributes = this.patchAttributes(this.product);
    this.maxVal = this.patchMaxVal();
    this.requiresMeasurement = this.patchRequiresMeasurement(this.product);
    this.filterArea = this.patchFilterArea(this.product);
    this.depth = this.patchDepth(this.attributes);
    this.quantityForm?.patchValue({ measurementDepth: this.depth });
  }

  get diameterDisabled() {
    return !!this.quantityForm.get('measurementWidth')?.value || !!this.quantityForm.get('measurementHeight')?.value;
  }

  get widthAndHeightFilled() {
    return !!this.quantityForm.get('measurementWidth')?.value && !!this.quantityForm.get('measurementHeight')?.value;
  }

  get widthAndHeightDisabled() {
    return !!this.quantityForm.get('measurementDiameter')?.value;
  }

  getField(name: string) {
    return this.quantityForm.get(name);
  }

  validateVal() {
    this.filledMeasurements = this.MEASUREMENTS.map(val => this.getField(val).value).filter(val => val);
    if (this.filterArea && this.filledMeasurements?.length > 1 && this.diameterDisabled) {
      this.filterAreaValidated = this.validateFilterArea(this.product, this.quantityForm);
    }
    this.showError =
      this.filledMeasurements.length && this.maxVal
        ? !this.filledMeasurements.find(val => this.maxVal > val)
        : undefined;
    const showGlobalError = !this.filledMeasurements.length || (this.diameterDisabled && !this.widthAndHeightFilled);
    this.quantityForm?.patchValue({ measurementErrorInfo: showGlobalError });
    if (!this.diameterDisabled && !this.widthAndHeightDisabled && this.filterAreaValidated) {
      this.enableFields();
    } else if (this.diameterDisabled) {
      this.disableField(['measurementDiameter']);
    } else {
      this.disableField(['measurementWidth', 'measurementHeight']);
    }
  }

  disableField(fieldNames: string[]) {
    fieldNames?.forEach(field => this.quantityForm.controls[field].disable());
  }

  enableFields() {
    this.MEASUREMENTS?.forEach(m => this.quantityForm.controls[m].enable());
  }
}
