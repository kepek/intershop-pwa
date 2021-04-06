import { Injectable } from '@angular/core';

import { CamCardData } from './cam-card.interface';
import { CamCard, CamCardAddress } from './cam-card.model';

@Injectable({ providedIn: 'root' })
export class CamCardMapper {
  /**
   * Cleanup Delivery Address
   * Just to make sure that we get rid of deprecated property from the payload since the ICM API still supports it.
   * @param deprecatedDeliveryAddress
   */
  static cleanupDeliveryAddress(
    deprecatedDeliveryAddress: CamCardAddress & { company?: string; street2?: string }
  ): CamCardAddress {
    if (!deprecatedDeliveryAddress) {
      return;
    }
    // tslint:disable-next-line:no-unused
    const { company, street2, ...deliveryAddress } = deprecatedDeliveryAddress;
    return deliveryAddress as CamCardAddress;
  }

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

      const deliveryAddress = CamCardMapper.cleanupDeliveryAddress(camCardData.deliveryAddress);

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

  fromListData(camCards: CamCardData[]): CamCard[] {
    return camCards.map(this.fromData);
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

      const deliveryAddress = CamCardMapper.cleanupDeliveryAddress(camCard.deliveryAddress);

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
}
