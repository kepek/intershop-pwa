import { CamfilOrderLineItem } from 'camfil-pwa/models/camfil-order-line-item/camfil-order-line-item.model';

import { LineItem, LineItemView } from 'ish-core/models/line-item/line-item.model';

import { CamCamProductChecked, CamCardItem } from '../../../extensions/cam-cards/models/cam-card/cam-card.model';

import { Attribute } from './attribute.model';

export class AttributeHelper {
  /**
   * Get a specific product attribute by attribute name.
   * @param product       The Product for which to get the attribute
   * @param attributeName The attribute name of the attribute to get
   * @returns              The matching product attribute
   */
  static getAttributeByAttributeName(attributes: Attribute[], attributeName: string): Attribute {
    if (!attributes) {
      return;
    }
    return attributes.find(attribute => attribute.name === attributeName);
  }

  /**
   * check if attribute is available and return value, otherwise undefined
   */
  static getAttributeValueByAttributeName<T>(attributes: Attribute[], attributeName: string) {
    const attribute = AttributeHelper.getAttributeByAttributeName(attributes, attributeName);
    return attribute ? (attribute.value as T) : undefined;
  }

  // CAMFIL

  static formatDeliveryDate(value: Date) {
    const month = `0 ${value.getMonth() + 1}`.slice(-3).replace(/\s/g, '');
    const day = `0 ${value.getDate()}`.slice(-3);
    const year = value.getFullYear();
    return [year, month, day].join('-').replace(/\s/g, '');
  }

  static getAttrsBeforeAddToCart(measurements, boxLabel) {
    const measurementsObj = measurements
      ? Object.entries(measurements)
          .map(([key, value]) => ({
            name: key,
            type: 'Double',
            value,
          }))
          .filter(({ value }) => value && typeof value === 'number')
      : [];

    const lineItemAttributes = [...measurementsObj] as Attribute[];
    if (boxLabel) {
      lineItemAttributes.push({ name: 'boxLabel', type: 'String', value: boxLabel });
    }

    return lineItemAttributes;
  }

  static calculateAttrsToAddFromForm(form) {
    const boxLabel = form.get('boxLabel').value;
    const measurements = {
      width: form.get('measurementWidth')?.value,
      height: form.get('measurementHeight')?.value,
      diameter: form.get('measurementDiameter')?.value,
      depth: form.get('measurementDepth')?.value,
    };
    return AttributeHelper.getAttrsBeforeAddToCart(measurements, boxLabel);
  }

  static calculateAttrsToAddFromCC(product: CamCamProductChecked) {
    const boxLabel = product.boxLabel;
    const measurements = product.measurement;
    return AttributeHelper.getAttrsBeforeAddToCart(measurements, boxLabel);
  }

  static determineLineItemType(lineItem: CamfilOrderLineItem | LineItemView | CamCardItem) {
    const isLineItem = (item: any): item is LineItem => 'attributes' in item;

    return isLineItem(lineItem);
  }

  static determineIfCamCardItem(lineItem: CamfilOrderLineItem | LineItemView | CamCardItem) {
    const isCamCardItem = (item: any): item is CamCardItem => 'measurement' in item;

    return isCamCardItem(lineItem);
  }

  static getMeasurementsText(lineItem) {
    if (AttributeHelper.determineLineItemType(lineItem)) {
      const measurementsNames = ['width', 'height', 'diameter', 'depth'];
      const measurementValues = lineItem?.attributes.map(att => {
        if (measurementsNames.includes(att.name) && att.value) {
          return att.value;
        }
      });
      return measurementValues.length
        ? measurementValues
            .filter(e => e)
            .reverse()
            .join('x')
        : '';
    } else if (AttributeHelper.determineIfCamCardItem(lineItem)) {
      const measurementsNames = ['width', 'height', 'diameter', 'depth'];
      const measurementValues = [];

      Object.keys(lineItem?.measurement).map(key => {
        if (measurementsNames.includes(key)) {
          measurementValues.push(lineItem.measurement[key]);
        }
      });

      return measurementValues.length
        ? measurementValues
            .filter(e => e)
            .reverse()
            .join('x')
        : '';
    } else {
      const { width, height, diameter, depth } = lineItem;
      if (!width && !height && !diameter && !depth) {
        return '---';
      }
      return [width, height, diameter, depth].filter(e => e).join('x');
    }
  }
}
