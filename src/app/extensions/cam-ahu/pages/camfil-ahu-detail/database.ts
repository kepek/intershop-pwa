import { Product } from 'ish-core/models/product/product.model';

export const PRODUCT: Product = {
  name: 'Air Handling Unit Name',
  shortDescription:
    'Short description our high-quality, energy-saving filters help protect people, processes and products from particulate matter (PM). Choose from a wide variety of filters designs and classes – ePM10 to ePM1.',
  longDescription:
    ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut eros aliquet, rutrum nibh vitae, feugiat mauris. Vivamus fermentum risus et odio accumsan, nec posuere elit commodo. In eget pharetra urna. Nunc quam ex, egestas sit amet interdum et, facilisis et augue. Etiam nisl odio, sollicitudin nec elementum ac, pretium nec risus. Proin ac dignissim risus. In maximus sapien a semper interdum. Donec porttitor urna nisi, vel rhoncus libero tristique vel. Proin et eros nec nulla aliquet sagittis.\n' +
    '\n' +
    'Sed vulputate tellus at erat placerat posuere. Ut ullamcorper ut quam eu vestibulum. Suspendisse potenti. Nulla facilisi. Suspendisse potenti. Aliquam erat volutpat. Curabitur ut nunc id ipsum vestibulum suscipit eget non elit. Morbi ac dolor est. In at est ac quam euismod convallis eget eu nisl. Donec vitae ex ornare, ornare arcu et, gravida mauris. Vivamus iaculis vestibulum condimentum. Maecenas varius commodo nisl in consectetur. ',
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
