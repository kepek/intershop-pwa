import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'camfil-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line: component-creation-test
export class AppComponent {}
