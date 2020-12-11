import { Unit } from './unit.model';

export class UnitHelper {
  static equal(unit1: Unit, unit2: Unit): boolean {
    return !!unit1 && !!unit2 && unit1.ahu === unit2.ahu;
  }
}
