import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CreatePageDataSourceComponent } from './create-page.data-source';

@Component({
  selector: 'camfil-user-detail-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
// tslint:disable-next-line:component-creation-test
export class CreatePageComponent extends CreatePageDataSourceComponent {}
