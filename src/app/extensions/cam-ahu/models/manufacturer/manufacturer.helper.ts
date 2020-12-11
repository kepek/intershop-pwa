import { Manufacturer } from './manufacturer.model';

export class ManufacturerHelper {
  static equal(manufacturer1: Manufacturer, manufacturer2: Manufacturer): boolean {
    return !!manufacturer1 && !!manufacturer2 && manufacturer1.id === manufacturer2.id;
  }
}
