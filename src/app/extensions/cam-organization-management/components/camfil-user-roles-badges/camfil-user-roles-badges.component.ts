// tslint:disable: ish-ordered-imports project-structure ban-specific-imports
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { CamfilB2bRole } from '../../models/camfil-b2b-role/camfil-b2b-role.model';

@Component({
  selector: 'camfil-user-roles-badges',
  templateUrl: './camfil-user-roles-badges.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CamfilUserRolesBadgesComponent {
  @Input() roleIDs: string[];

  roles$: Observable<CamfilB2bRole[]>;
}
