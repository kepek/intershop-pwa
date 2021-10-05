// tslint:disable: ish-ordered-imports project-structure ban-specific-imports

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { PriceItemData } from 'ish-core/models/price-item/price-item.interface';
import { PriceData } from 'ish-core/models/price/price.interface';
import { ProductData } from 'ish-core/models/product/product.interface';

import { CamCardMeasurement } from '../../../extensions/cam-cards/models/cam-card/cam-card.model';

export interface LineItemData {
  id: string;
  calculated: boolean;
  position: number;
  quantity: {
    value: number;
    unit?: string;
  };
  product: string;

  surcharges?: [
    {
      amount: PriceItemData;
      description?: string;
      name?: string;
    }
  ];
  discounts?: string[];
  pricing: {
    salesTaxTotal?: PriceData;
    shippingTaxTotal?: PriceData;
    shippingTotal: PriceItemData;
    total: PriceItemData;
    valueRebatesTotal?: PriceItemData;
    price: PriceItemData;
    undiscountedPrice: PriceItemData;
    singleBasePrice: PriceItemData;
  };
  hiddenGift: boolean;
  freeGift: boolean;
  quantityFixed?: boolean;
  shipToAddress?: string;
  attributes?: Attribute[];
}

export interface CamfilLineItemData
  extends Pick<
    LineItemData,
    'calculated' | 'freeGift' | 'hiddenGift' | 'id' | 'position' | 'product' | 'quantity' | 'shipToAddress'
  > {
  basket: string;
  pricing: CamfilLineItemPricingData;
  product: string;
  productInfo: CamfilLineItemProductData;
  shippingMethod: string;
}

export interface CamfilLineItemPricingData {
  giftingTotal: PriceItemData;
  price: PriceItemData;
  salesTaxTotal: PriceData;
  shippingRebatesTotal: PriceItemData;
  shippingTaxTotal: PriceData;
  singleBasePrice: PriceItemData;
  undiscountedPrice: PriceItemData;
  undiscountedShippingTotal: PriceItemData;
  undiscountedSingleBasePrice: PriceItemData;
  valueRebatesTotal: PriceItemData;
  salePrice: PriceItemData;
  listPrice: PriceItemData;
}

export interface CamfilLineItemMeasurementData extends CamCardMeasurement {
  height: number;
  width: number;
  depth: number;
}

export interface CamfilLineItemProductData
  extends Pick<ProductData, 'inStock' | 'availability' | 'productBundle' | 'shortDescription' | 'sku'> {
  arrigoCode: string;
  available: boolean;
  earliestDeliveryDate: string;
  lineItemId: string;
  measurement: CamfilLineItemMeasurementData;
  name: string;
  thumbnailUrl: string;
  variationProduct: boolean;
}
