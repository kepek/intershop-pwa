import { Injectable } from '@angular/core';
import * as camelcaseKeys from 'camelcase-keys';

import { ManufacturerData } from './manufacturer.interface';
import { Manufacturer } from './manufacturer.model';

@Injectable({ providedIn: 'root' })
export class ManufacturerMapper {
  static fromData(manufacturerData: ManufacturerData): Manufacturer {
    if (!manufacturerData) {
      throw new Error(`manufacturerData is required`);
    }

    const manufacturer = ManufacturerMapper.parseData(manufacturerData);

    if (manufacturer?.id) {
      manufacturer.id = String(manufacturer.id);
    }

    return manufacturer;
  }

  static fromListData(manufacturersData: ManufacturerData[]): Manufacturer[] {
    if (!manufacturersData) {
      throw new Error(`manufacturersData is required`);
    }

    let output = manufacturersData;

    if (!Array.isArray(output)) {
      output = [output];
    }

    return output.map(data => ManufacturerMapper.fromData(data));
  }

  static parseData(manufacturerData: ManufacturerData) {
    return (camelcaseKeys(manufacturerData, { deep: true }) as unknown) as Manufacturer;
  }
}
