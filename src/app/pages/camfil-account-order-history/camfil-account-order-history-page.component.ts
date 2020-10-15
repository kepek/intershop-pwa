import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The Order History Page Container Component renders the account history page of a logged in user using the {@link OrderHistoryPageComponent}
 *
 */
@Component({
  templateUrl: './camfil-account-order-history-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-account-order-history-page.scss'],
})
export class CamfilAccountOrderHistoryPageComponent { }
