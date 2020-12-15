// tslint:disable: ish-ordered-imports project-structure ban-specific-imports
import { Manufacturer } from '../../models/manufacturer/manufacturer.model';

export const manufacturers: Manufacturer[] = [
  {
    name: 'Fläktwoods',
    id: '4711',
    market: ['SE', 'DK'],
    description: [
      {
        lang: 'EN-US',
        shortDescription: 'Flaektwoods',
      },
      {
        lang: 'SV-SE',
        shortDescription: 'Fläktwoods',
      },
      {
        lang: 'EN-US',
        longDescription:
          'Flaektwoods is the bla bla bla and something more as a mouse-over text or whatever you would like.',
      },
      {
        lang: 'SV-SE',
        longDescription:
          'Fläktwoods är den bla bla bla och något ytterligare som kan visas som en mouse-over/popup text eller vad man nu önskar.',
      },
    ],
    images: [
      {
        uri: 'https://camfil.com/some/CDN/uri/flaktwoods.png',
        type: 'logotype',
      },
    ],
  },
  {
    name: 'Fläktmetals',
    id: '4712',
    market: ['SE', 'FI'],
    description: [
      {
        lang: 'EN-US',
        shortDescription: 'Flaektmetals',
      },
      {
        lang: 'SV-SE',
        shortDescription: 'Fläktmetals',
      },
      {
        lang: 'EN-US',
        longDescription:
          'Flaektmetals is the bla bla bla and something more as a mouse-over text or whatever you would like.',
      },
      {
        lang: 'SV-SE',
        longDescription:
          'Fläktmetals är den bla bla bla och något ytterligare som kan visas som en mouse-over/popup text eller vad man nu önskar.',
      },
    ],
    images: [
      {
        uri: 'https://camfil.com/some/CDN/uri/flaktmetals.png',
        type: 'logotype',
      },
    ],
  },
];
