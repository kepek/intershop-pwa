import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

@Component({
  selector: 'camfil-shopping-basket-empty',
  templateUrl: './camfil-shopping-basket-empty.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilShoppingBasketEmptyComponent {
  @Input() error: HttpError;
}
