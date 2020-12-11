export interface Manufacturer {
  name: string;
  id: string;
  market: string[];
  description: ManufacturerDescription[];
  images: ManufacturerImage[];
}

export interface ManufacturerDescription {
  lang: string;
  shortDescription?: string;
  longDescription?: string;
}

export interface ManufacturerImage {
  uri: string;
  type: string;
}
