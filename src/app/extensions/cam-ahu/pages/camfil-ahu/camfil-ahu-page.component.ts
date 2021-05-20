import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { CamAhuFacade } from '../../facades/cam-ahu.facade';
import { CamAhuAbstractComponent } from '../camfil-ahu-abstract/camfil-ahu-abstract-page.component';
import { UnitHelper } from '../../models/unit/unit.helper';

@Component({
  selector: 'camfil-ahu-page',
  styleUrls: ['./camfil-ahu-page.component.scss'],
  templateUrl: './camfil-ahu-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAHUPageComponent extends CamAhuAbstractComponent implements OnInit {
  constructor(protected router: Router, protected ahuFacade: CamAhuFacade, protected fb: FormBuilder) {
    super(router, fb, ahuFacade);
  }

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
