import { Image } from 'ish-core/models/image/image.model';
import { Price } from 'ish-core/models/price/price.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';

export interface Unit {
  id: string; // TODO (extMlk): Verify with Integration Team if missing `id` field is 100% okay... cuz it does not make sense...
  ahu: UnitAhu;
  ahuAirSlots: UnitAHUAirSlot[];
}

export interface UnitAhu {
  // API Props
  id?: string; // TODO (extMlk): Verify with Integration Team if `id` field is 100% "optional" cuz it does not make sense...
  market?: string[];
  airHandlingUnitName: UnitAhuLongDescription[];
  ahuManufacturerName?: string;
  ahuManufacturerId?: string;
  ahuShortDescription: UnitAhuLongDescription[];
  ahuLongDescription: UnitAhuLongDescription[];
  ahuImages: UnitAHUImage[];
  ahuDocuments: UnitAHUDocument[];
}

export interface UnitAHUDocument {
  document: string;
  type: string;
}

export interface UnitAHUImage extends Partial<Image> {
  image: string;
  type: string;
}

export interface UnitAhuLongDescription {
  lang: string;
  text: string;
}

export interface UnitAHUAirSlot {
  // API Props
  ahuSlotType: string;
  ahuSlotOrder: number;
  ahuSlotId: string;
  ahuSlotName: string;
  ahuSlotAmount: string;
  ahuSlotWidthMm: string;
  ahuSlotLengthMm: string;
  ahuSlotDepthMm: string;
  items: UnitAHUAirSlotItem[];
  // Internal Props
  ahuSlotTypeId?: number;
  ahuSlotTypeName?: string;
  ahuSlotTypeSlug?: string;

  ahuSlotDimensions?: string;
}

export interface UnitAHUAirSlotItem {
  item: string;
  sku: string;
}

// Internal Models

export interface UnitAHUBasketItem extends UnitAHUAirSlotItem {
  quantity: number;
}

export interface UnitAHUBasket extends UnitAHUAirSlot {
  items: UnitAHUBasketItem[];
  ahuSlotRemainingAmount?: string;
}

export interface UnitAHUBasketSummary {
  total: Price;
}

export interface UnitAHUAirSlotType {
  type: string;
  name: string;
  count: number;
  dimensions: string[];
}

export interface UnitAHUAirSlotParams {
  manufacturerId: string;
  unitId: string;
  slotId: string;
}

export interface UnitAHUAirSlotItemParams {
  manufacturerId: string;
  unitId: string;
  slotId: string;
  sku: string;
}

export interface UnitAHUAirSlotItemQueryParam {
  [key: string]: string[];
}

export type UnitAhuAirSlotProductView = ProductView | VariationProductView | VariationProductMasterView;
