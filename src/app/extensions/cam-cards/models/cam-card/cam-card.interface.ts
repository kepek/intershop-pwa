import { MaintenanceStatus } from './cam-card.helper';
import { CamCardAddress, CamCardContact, CamCardCustomer, CamCardHeader, CamCardItem } from './cam-card.model';

export interface CamCardData extends CamCardHeader {
  id: string;
  camCardItems?: CamCardItem[];
  contacts?: CamCardContact[];
  customer?: CamCardCustomer;
  invoiceLabel?: string;
  orderLabel?: string;
  position?: number;
  creationDate?: Date;
  subCamCards?: CamCardData[];
  rootCamCard: string;
  maintenanceStatus?: MaintenanceStatus;
  deliveryAddress?: CamCardAddress;
  nextDeliveryDate?: string;
  lastDeliveryDate?: string;
  deliveryInterval?: number;
  reminderFlag?: number;
}
