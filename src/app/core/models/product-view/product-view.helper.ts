import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

export class ProductViewHelper {
  static getDeliveryDateDays(res: ProductView) {
    const groupName = AttributeGroupTypes.ProductsListLabelAttributes;
    const attributeGroups = res.attributeGroups && res.attributeGroups[groupName];
    const deliveryDaysAttribute = attributeGroups?.attributes.find(a => a.name?.toLowerCase() === 'deliverydays');

    return Number(deliveryDaysAttribute?.value || 7);
  }
}
