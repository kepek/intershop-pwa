export interface CamCardHeader {
  title: string;
}

export interface CamCard extends CamCardHeader {
  id: string;
  items?: CamCardItem[];
  itemsCount?: number;
  creationDate?: Date;
}

export interface CamCardItem {
  sku: string;
  id: string;
  creationDate: number;
  desiredQuantity: {
    value: number;
    unit?: string;
  };
}
