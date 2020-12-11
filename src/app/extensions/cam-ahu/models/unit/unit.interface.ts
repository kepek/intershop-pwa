export interface UnitData {
  AHU: UnitDataAhu;
  AHUAirSlots: UnitDataAHUAirSlot[];
}

export interface UnitDataAhu {
  Id?: number;
  Market?: string[];
  AirHandlingUnitName: UnitDataAhuLongDescription[];
  AHUManufacturerName?: string;
  AHUManufacturerId?: number;
  AHUShortDescription: UnitDataAhuLongDescription[];
  AHULongDescription: UnitDataAhuLongDescription[];
  AHUimages: UnitDataAHUImage[];
  AHUdocuments: UnitDataAHUDocument[];
}

export interface UnitDataAhuLongDescription {
  lang: string;
  text: string;
}

export interface UnitDataAHUDocument {
  document: string;
  type: string;
}

export interface UnitDataAHUImage {
  image: string;
  type: string;
}

export interface UnitDataAHUAirSlot {
  AHUSlotType: string;
  AHUSlotOrder: number;
  AHUSlotId: number;
  AHUSlotName: string;
  AHUSlotAmount: string;
  AHUSlotWidthMM: string;
  AHUSlotLengthMM: string;
  AHUSlotDepthMM: string;
  items: UnitDataAHUAirSlotItem[];
}

export interface UnitDataAHUAirSlotItem {
  item: string;
}
