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
      let items: CamCardItem[];
      if (camCardData.items && camCardData.items.length) {
        // create items object from attribute array
        const arrayToObject = attributes =>
          attributes.reduce((obj, attr) => {
            obj[attr.name] = attr.value;
            return obj;
          }, {});
        items = camCardData.items
          .map(item => arrayToObject(item.attributes))
          .map(item => ({
            sku: item.sku,
            id: item.id,
            creationDate: Number(item.creationDate),
            desiredQuantity: {
              value: item.desiredQuantity.value,
              // TBD: is the unit necessary?
              // unit: item.desiredQuantity.unit,
            },
          }));
      } else {
        items = [];
      }

      return {
        id: camCardId,
        title: camCardData.title,
        itemsCount: camCardData.itemsCount || 0,
        creationDate: camCardData.creationDate,
        items,
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
