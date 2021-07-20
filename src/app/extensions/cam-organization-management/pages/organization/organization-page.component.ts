import { ChangeDetectionStrategy, Component } from '@angular/core';

import { OrganizationPageDataSourceComponent } from './orgniazation-page.data-source';

@Component({
  selector: 'camfil-users-page',
  templateUrl: './organization-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class OrganizationPageComponent extends OrganizationPageDataSourceComponent {}
