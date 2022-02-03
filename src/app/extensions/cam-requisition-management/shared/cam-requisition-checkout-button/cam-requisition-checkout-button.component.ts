import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { whenTruthy } from 'ish-core/utils/operators';

import { CamRequisitionManagementFacade } from '../../facades/cam-requisition-management.facade';

@Component({
  selector: 'camfil-cam-requisition-checkout-button',
  templateUrl: './cam-requisition-checkout-button.component.html',
  styleUrls: ['./cam-requisition-checkout-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class CamRequisitionCheckoutButtonComponent implements OnInit {
  @Input() disabledButton$: Observable<boolean>;
  permissions: string[];
  approvalRequired = false;
  constructor(
    private accountFacade: AccountFacade,
    private camRequisitionManagementFacade: CamRequisitionManagementFacade
  ) {}
  ngOnInit() {
    this.accountFacade.userPermissions$?.pipe(whenTruthy()).subscribe(permissions => {
      this.permissions = permissions;
      if (permissions?.includes('APP_B2B_MAKE_REQUISITION')) {
        this.approvalRequired = true;
      }
    });
  }

  submit() {
    if (this.approvalRequired) {
      this.camRequisitionManagementFacade.createRequisition();
    }
  }
}
