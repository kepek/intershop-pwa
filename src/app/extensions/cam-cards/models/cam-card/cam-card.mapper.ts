import { Injectable } from '@angular/core';

import { CamCardData } from './cam-card.interface';
import { CamCard, CamCardItem } from './cam-card.model';

@Injectable({ providedIn: 'root' })
export class CamCardMapper {
  private static parseIdFromURI(uri: string): string {
    const match = /wishlists[^\/]*\/([^\?]*)/.exec(uri);
    if (match) {
      return match[1];
    } else {
      console.warn(`could not find id in uri '${uri}'`);
      return;
    }
  }
  fromData(camCardData: CamCardData, camCardId: string): CamCard {
    if (camCardData) {
      let camCardItems: CamCardItem[];
      if (camCardData.items && camCardData.items.length) {
        // create items object from attribute array
        const arrayToObject = attributes =>
          attributes.reduce((obj, attr) => {
            obj[attr.name] = attr.value;
            return obj;
          }, {});
        camCardItems = camCardData.items
          .map(item => arrayToObject(item.attributes))
          .map(item => ({
            id: item.id,
            count: item.desiredQuantity.value,
            position: 0,
            product: {
              sku: item.sku,
              // name:
              // shortDescription:
              // longDescription:
              // available:
            },
            creationDate: Number(item.creationDate),
          }));
      } else {
        camCardItems = [];
      }

      // tmp
      const subCamCardItems = camCardItems.length
        ? camCardItems.map(item => ({
            id: item.id + 'sub',
            count: item.count,
            position: item.position,
            product: item.product,
            creationDate: item.creationDate,
          }))
        : [];
      // EOF tmp

      return {
        id: camCardId,
        title: camCardData.title,
        itemsCount: camCardData.itemsCount || 0,
        creationDate: camCardData.creationDate,
        camCardItems,
        // contacts:

        // tmp default values
        rootCamCard: '',
        subCamCards: [
          {
            id: camCardId + 'SUB',
            title: 'SUB CamCard - ' + camCardData.title,
            customer: {},
            itemsCount: camCardData.itemsCount || 0,
            creationDate: camCardData.creationDate,
            rootCamCard: camCardId,
            subCamCards: [],
            camCardItems: subCamCardItems,
          },
        ],
        customer: {
          name: 'customerName ' + camCardId,
        },
      };
    } else {
      throw new Error(`camCardData is required`);
    }
  }

  fromUpdate(camCard: CamCard, id: string): CamCard {
    if (camCard && id) {
      return {
        id,
        title: camCard.title,
        creationDate: camCard.creationDate,
      };
    }
  }

  /**
   * extract ID from URI
   */
  fromDataToIds(camCardData: CamCardData): CamCard {
    if (camCardData) {
      return {
        id: CamCardMapper.parseIdFromURI(camCardData.uri),
        title: camCardData.title,
      };
    }
  }
}
