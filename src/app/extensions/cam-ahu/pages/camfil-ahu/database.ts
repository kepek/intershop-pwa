// tslint:disable-next-line:force-jsdoc-comments
// TODO: move to correct location

export interface AHUBanner {
  url: string;
}

export interface AHUManufacturer {
  id: number;
  title: string;
}

export interface AHUModel {
  id: number;
  title: string;
}

export const IMAGE: AHUBanner = {
  url:
    'https://assets.new.siemens.com/siemens/assets/api/uuid:4b8847bc-99a5-4ee2-b3d0-ebdc64f8e91c/width:1266/quality:high/cnc-system-for-machine-tools.jpg',
};

export const MANUFACTURERS: AHUManufacturer[] = [
  {
    id: 1,
    title: 'Manufacturer 1',
  },
  {
    id: 2,
    title: 'Manufacturer 2',
  },
  {
    id: 3,
    title: 'Manufacturer 3',
  },
];

export const MODELS: AHUModel[] = [
  {
    id: 1,
    title: 'Model 1',
  },
  {
    id: 2,
    title: 'Model 2',
  },
  {
    id: 3,
    title: 'Model 3',
  },
];
