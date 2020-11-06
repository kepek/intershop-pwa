import { Product } from 'ish-core/models/product/product.model';

export const PRODUCT: Product = {
  name: 'Air Handling Unit Name',
  shortDescription:
    'Short description our high-quality, energy-saving filters help protect people, processes and products from particulate matter (PM). Choose from a wide variety of filters designs and classes – ePM10 to ePM1.',
  longDescription: 'Lorem ipsum',
  availability: true,
  inStock: true,
  minOrderQuantity: 1,
  maxOrderQuantity: 2,
  attributes: [
    {
      name: 'Attribute 1',
      value: '1',
    },
    {
      name: 'Attribute 2',
      value: '6',
    },
    {
      name: 'Attribute 3',
      value: '8',
    },
  ],
  images: [
    {
      name: 'Product image',
      type: 'Image',
      imageActualHeight: 1024,
      imageActualWidth: 683,
      viewID: 'front',
      effectiveUrl: 'https://www.acetec.se/thumb/1111/1024x0/85573be13ec7eeb479afb2277d458c53.jpg?q=50',
      typeID: 'S',
      primaryImage: true,
    },
  ],
  salePrice: { value: 3, currency: 'EUR', type: 'Money' },
  listPrice: { value: 4, currency: 'EUR', type: 'Money' },
  manufacturer: 'Manufacturer',
  roundedAverageRating: 1,
  readyForShipmentMin: 1,
  readyForShipmentMax: 3,
  sku: 'd23s',
  packingUnit: 'pcs.',
  completenessLevel: 0,
  failed: false,
  promotionIds: [],
  type: 'Product',
};
