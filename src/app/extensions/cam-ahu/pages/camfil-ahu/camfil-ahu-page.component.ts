import { PlatformLocation, ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { CamAhuFacade } from '../../facades/cam-ahu.facade';
import { UnitHelper } from '../../models/unit/unit.helper';
import { CamAhuAbstractComponent } from '../camfil-ahu-abstract/camfil-ahu-abstract-page.component';

@Component({
  selector: 'camfil-ahu-page',
  styleUrls: ['./camfil-ahu-page.component.scss'],
  templateUrl: './camfil-ahu-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CamfilAHUPageComponent extends CamAhuAbstractComponent implements OnInit {
  constructor(
    private platformLocation: PlatformLocation,
    protected router: Router,
    protected fb: FormBuilder,
    protected scroller: ViewportScroller,
    protected ahuFacade: CamAhuFacade,
    protected accountFacade: AccountFacade
  ) {
    super(router, fb, scroller, ahuFacade, accountFacade);
  }
  showComingSoon = true;
  ngOnInit(): void {
    if ((this.platformLocation as any).location.hostname !== 'shop.camfil.com') {
      this.showComingSoon = false;
    }
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
