import { CamCard } from './cam-card.model';

export type MaintenanceStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'READ_ONLY';

export class CamCardHelper {
  static maintenance(camCard: CamCard, arr: MaintenanceStatus[]) {
    return arr.includes(camCard.maintenanceStatus);
  }

  static getRealCamCards(camCards: CamCard[]) {
    return camCards.filter(camCard => !camCard.transient);
  }
}
