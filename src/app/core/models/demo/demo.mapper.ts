import { Injectable } from '@angular/core';

import { DemoData } from './demo.interface';
import { Demo } from './demo.model';

@Injectable({ providedIn: 'root' })
export class DemoMapper {
  fromData(demoData: DemoData): Demo {
    if (demoData) {
      return {
        id: demoData.incomingField,
      };
    } else {
      throw new Error(`demoData is required`);
    }
  }
}
