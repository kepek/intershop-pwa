// tslint:disable: ish-ordered-imports project-structure ban-specific-imports
import { Unit } from '../../models/unit/unit.model';

export const units: Unit[] = [
  {
    id: '56564',
    ahu: {
      id: '56564',
      market: ['SE', 'DK'],
      airHandlingUnitName: [
        { lang: 'EN-US', text: 'eQ MASTER® 2000 X' },
        { lang: 'SV-SE', text: 'eQ MASTER® 2000 X' },
      ],
      ahuManufacturerName: 'Fläkt Woods',
      ahuManufacturerId: '4711',
      ahuShortDescription: [
        { lang: 'EN-US', text: 'A short english description' },
        { lang: 'SV-SE', text: 'En kort svensk beskrivning' },
      ],
      ahuLongDescription: [
        { lang: 'EN-US', text: 'A long english description' },
        { lang: 'SV-SE', text: 'En lång svensk beskrivning' },
      ],
      ahuImages: [
        { image: 'https://image.url/image1.png', type: 'FrontView' },
        { image: 'https://image.url/image2.png', type: 'IsoView' },
      ],
      ahuDocuments: [
        { document: 'https://document.url/document1.pdf', type: 'Manual' },
        { document: 'https://document.url/document2.pdf', type: 'Certificate' },
      ],
    },
    ahuAirSlots: [
      {
        ahuSlotType: 'Supply',
        ahuSlotOrder: 1,
        ahuSlotId: '11147',
        ahuSlotName: '1 x 460x460x540',
        ahuSlotAmount: '1',
        ahuSlotWidthMm: '460',
        ahuSlotLengthMm: '460',
        ahuSlotDepthMm: '540',
        items: [
          { item: 'item1', sku: 'sku1' },
          { item: 'item2', sku: 'sku2' },
        ],
      },
      {
        ahuSlotType: 'Supply',
        ahuSlotOrder: 2,
        ahuSlotId: '11148',
        ahuSlotName: '2 x 200x200x320',
        ahuSlotAmount: '2',
        ahuSlotWidthMm: '200',
        ahuSlotLengthMm: '200',
        ahuSlotDepthMm: '320',
        items: [{ item: 'item1', sku: 'sku1' }],
      },
      {
        ahuSlotType: 'Exhaust',
        ahuSlotOrder: 1,
        ahuSlotId: '11149',
        ahuSlotName: '2 x 640x640x880',
        ahuSlotAmount: '2',
        ahuSlotWidthMm: '640',
        ahuSlotLengthMm: '640',
        ahuSlotDepthMm: '880',
        items: [
          { item: 'item1', sku: 'sku1' },
          { item: 'item2', sku: 'sku2' },
          { item: 'item3', sku: 'sku3' },
        ],
      },
    ],
  },
];
