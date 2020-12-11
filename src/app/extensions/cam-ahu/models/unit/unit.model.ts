export interface Unit {
  id: string; // TODO (extMlk): Verify with Integration Team if missing `id` field is 100% okay... cuz it does not make sense...
  ahu: UnitAhu;
  ahuAirSlots: UnitAHUAirSlot[];
}

export interface UnitAhu {
  id?: string; // TODO (extMlk): Verify with Integration Team if `id` field is 100% "optional" cuz it does not make sense...
  market?: string[];
  airHandlingUnitName: UnitAhuLongDescription[];
  ahuManufacturerName?: string;
  ahuManufacturerId?: string;
  ahuShortDescription: UnitAhuLongDescription[];
  ahuLongDescription: UnitAhuLongDescription[];
  ahUimages: UnitAHUImage[];
  ahUdocuments: UnitAHUDocument[];
}

export interface UnitAHUDocument {
  document: string;
  type: string;
}

export interface UnitAHUImage {
  image: string;
  type: string;
}

export interface UnitAhuLongDescription {
  lang: string;
  text: string;
}

export interface UnitAHUAirSlot {
  ahuSlotType: string;
  ahuSlotOrder: number;
  ahuSlotId: string;
  ahuSlotName: string;
  ahuSlotAmount: string;
  ahuSlotWidthMm: string;
  ahuSlotLengthMm: string;
  ahuSlotDepthMm: string;
  items: UnitAHUAirSlotItem[];
}

export interface UnitAHUAirSlotItem {
  item: string;
}
