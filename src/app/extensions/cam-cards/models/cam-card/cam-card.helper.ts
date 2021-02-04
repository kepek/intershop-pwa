import { CamCard } from './cam-card.model';

export type MaintenanceStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'READ_ONLY';

export class CamCardHelper {
  static maintenance(camCard: CamCard, arr: MaintenanceStatus[]) {
    return arr.includes(camCard.maintenanceStatus);
  }

  static getRealCamCards(camCards: CamCard[]) {
    return camCards.filter(camCard => !camCard.transient);
  }

  static getCamCardItemsId(camCard: CamCard) {
    const itemsId = camCard.camCardItems.map(item => item.id);
    camCard.subCamCards.forEach(sub => {
      sub.camCardItems.forEach(item => {
        itemsId.push(item.id);
      });
    });
    return itemsId;
  }
}
