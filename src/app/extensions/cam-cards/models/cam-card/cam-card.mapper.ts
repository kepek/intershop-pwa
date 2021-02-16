import { Injectable } from '@angular/core';

import { CamCardData } from './cam-card.interface';
import { CamCard, CamCardAddress } from './cam-card.model';

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
      const deliveryAddress = this.removeCompanyField(camCardData.deliveryAddress);
      return {
        ...camCardData,
        name: camCardData.name,
        subCamCards: subs,
        itemsCount: items + itemsFromSubCamCard,
        deliveryAddress,
      };
    } else {
      throw new Error(`camCardData is required`);
    }
  }

  fromUpdate(camCard: CamCard, id: string): CamCard {
    if (camCard && id) {
      const {
        name,
        creationDate,
        customer,
        orderLabel,
        invoiceLabel,
        nextDeliveryDate,
        lastDeliveryDate,
        deliveryInterval,
        reminderFlag,
      } = camCard;

      const deliveryAddress = this.removeCompanyField(camCard.deliveryAddress);

      return {
        id,
        name,
        creationDate,
        orderLabel,
        invoiceLabel,
        customer,
        deliveryAddress,
        nextDeliveryDate,
        lastDeliveryDate,
        deliveryInterval,
        reminderFlag,
      };
    }
  }

  // because of API support the deprecated fields
  removeCompanyField(data): CamCardAddress {
    const keys = Object.keys(data).filter(key => key !== 'company');
    const deliveryAddress = {};
    keys.forEach(key => {
      deliveryAddress[key] = data[key];
    });
    return deliveryAddress as CamCardAddress;
  }
}
