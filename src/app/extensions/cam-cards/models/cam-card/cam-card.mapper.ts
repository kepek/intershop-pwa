import { Injectable } from '@angular/core';

import { CamCardData } from './cam-card.interface';
import { CamCard } from './cam-card.model';

@Injectable({ providedIn: 'root' })
export class CamCardMapper {
  fromData(camCardData: CamCardData): CamCard {
    if (camCardData) {
      const itemsCountFromSubCamCard = camCardData.subCamCards.reduce(
        (result, data) => result + data.camCardItems.length,
        0
      );
      const subs = camCardData.subCamCards.map(sub => ({
        ...sub,
        title: sub.name || 'Building', // TODO: improve
      }));
      return {
        ...camCardData,
        title: camCardData.name,
        subCamCards: subs,
        delivery: {
          last: '12-01-2020', // TODO: tmp
          interval: 10, // TODO: tmp
        },
        maintenanceStatus: false, // TODO: tmp
        itemsCount: camCardData.camCardItems.length + itemsCountFromSubCamCard,
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
        id: camCardData.id,
        title: camCardData.name,
      };
    }
  }
}
