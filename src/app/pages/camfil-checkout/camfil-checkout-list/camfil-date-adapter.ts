import { NativeDateAdapter } from '@angular/material/core';

export class CamfilDateAdapter extends NativeDateAdapter {
  getFirstDayOfWeek(): number {
    return 1;
  }
}
