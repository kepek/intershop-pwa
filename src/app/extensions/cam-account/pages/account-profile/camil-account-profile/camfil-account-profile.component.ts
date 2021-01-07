import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';

@Component({
  selector: 'camfil-account-profile',
  templateUrl: './camfil-account-profile.component.html',
  styleUrls: ['./camfil-account-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAccountProfileComponent {
  @Input() user: User;
  @Input() customer: Customer;
}
