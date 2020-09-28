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
}

export interface CamCardItem {
  // had sku: string;
  id: string;
  count: number; // was desiredQuantity.value
  position?: number;
  product?: CamCardProduct;
  creationDate: number;
}

export interface CamCardProduct {
  sku: string;
  name?: string;
  shortDescription?: string;
  longDescription?: string;
  available?: boolean;
}

export interface CamCardCustomer {
  // TODO
  name?: string;
}

export interface CamCardContact {
  profileId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  camCardId?: string;
}
