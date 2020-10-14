export interface CamCardHeader {
  title: string;
}

export interface CamCard extends CamCardHeader {
  id: string;
  customer?: CamCardCustomer;
  rootCamCard?: string; // TODO: id from root
  subCamCards?: CamCard[];
  camCardItems?: CamCardItem[]; // was items
  itemsCount?: number;
  creationDate?: Date;
  contacts?: CamCardContact[];
  delivery?: CamCardDelivery;
  maintenanceStatus?: boolean;
}

export interface CamCardItem {
  id?: string;
  count: number; // was desiredQuantity.value
  position?: number;
  product: CamCardProduct;
  creationDate?: number;
  comment?: CamCardItemComment; // Talk bubble on view
}

export interface CamCardProduct {
  sku: string;
  name?: string;
  shortDescription?: string;
  longDescription?: string;
  available?: boolean;
}

export interface CamCardCustomer {
  id?: string;
  name?: string;
  deliveryAddress?: string; // will be some { } // or in CamCardDelivery
  email?: string;
  contactPerson?: string; // will be some { }
}

export interface CamCardContact {
  profileId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  camCardId?: string;
}

export interface CamCardItemComment {
  label: string;
  text: string;
}

export interface CamCardDelivery {
  last: string;
  interval: number;
  // maybe deliveryAddress: { } also
}
