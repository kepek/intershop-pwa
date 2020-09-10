import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'camfil-demo-bottom-sheet',
  templateUrl: './demo-bottom-sheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoBottomSheetComponent {
  constructor(private bottomSheetRef: MatBottomSheetRef<DemoBottomSheetComponent>) {}

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
