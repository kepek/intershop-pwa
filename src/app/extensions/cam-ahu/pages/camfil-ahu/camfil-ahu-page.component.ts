import { ChangeDetectionStrategy, Component } from '@angular/core';

import { UnitHelper } from '../../models/unit/unit.helper';
import { CamAhuAbstractComponent } from '../camfil-ahu-abstract/camfil-ahu-abstract-page.component';

@Component({
  selector: 'camfil-ahu-page',
  styleUrls: ['./camfil-ahu-page.component.scss'],
  templateUrl: './camfil-ahu-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CamfilAHUPageComponent extends CamAhuAbstractComponent {
  selectAhuUnit(event) {
    const unitId = event.value;
    const slots = undefined;

    this.router.navigate(['/air-handling-unit-guide/detail'], {
      queryParamsHandling: 'merge',
      queryParams: {
        [UnitHelper.UNIT_ID_QUERY_PARAM_NAME]: unitId,
        [UnitHelper.SLOTS_QUERY_PARAM_NAME]: slots,
      },
    });
  }
}
