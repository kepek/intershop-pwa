import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'camfil-pwa-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class AppComponent {
  title = 'camfil-pwa';
}
