import { ChangeDetectionStrategy, Component } from '@angular/core';

// tslint:disable-next-line: component-creation-test
@Component({
  selector: 'ish-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
