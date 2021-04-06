import { ChangeDetectionStrategy, Component } from '@angular/core';

import { UserPageDataSourceComponent } from './user-page.data-source';

@Component({
  selector: 'camfil-user-detail-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
// tslint:disable-next-line:component-creation-test
export class UserPageComponent extends UserPageDataSourceComponent {}
