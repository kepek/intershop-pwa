export interface ManufacturerData {
  Name: string;
  Id: number;
  Market: string[];
  Description: ManufacturerDataDescription[];
  Images: ManufacturerDataImage[];
}

export interface ManufacturerDataDescription {
  lang: string;
  ShortDescription?: string;
  LongDescription?: string;
}

export interface ManufacturerDataImage {
  uri: string;
  type: string;
}
