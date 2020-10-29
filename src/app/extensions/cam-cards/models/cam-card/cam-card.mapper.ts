import { Injectable } from '@angular/core';

import { CamCardData } from './cam-card.interface';
import { CamCard } from './cam-card.model';

@Injectable({ providedIn: 'root' })
export class CamCardMapper {
  fromData(camCardData: CamCardData): CamCard {
    if (camCardData) {
      const items = camCardData.camCardItems ? camCardData.camCardItems.length : 0;
      const itemsFromSubCamCard = camCardData.subCamCards
        ? camCardData.subCamCards.reduce((result, data) => result + data.camCardItems.length, 0)
        : 0;
      const subs = camCardData.subCamCards
        ? camCardData.subCamCards.map(sub => ({
            ...sub,
            name: sub.name || 'Building', // TODO: improve
            itemsCount: sub.camCardItems ? sub.camCardItems.length : 0,
          }))
        : [];
      return {
        ...camCardData,
        name: camCardData.name,
        subCamCards: subs,
        delivery: {
          last: '12-01-2020', // TODO: tmp
          interval: 10, // TODO: tmp
        },
        itemsCount: items + itemsFromSubCamCard,
      };
    } else {
      throw new Error(`camCardData is required`);
    }
  }

  fromUpdate(camCard: CamCard, id: string): CamCard {
    if (camCard && id) {
      const { name, creationDate, customer, orderLabel, invoiceLabel, deliveryAddress } = camCard;

      return {
        id,
        name,
        creationDate,
        orderLabel,
        invoiceLabel,
        customer,
        deliveryAddress,
      };
    }
  }
}
