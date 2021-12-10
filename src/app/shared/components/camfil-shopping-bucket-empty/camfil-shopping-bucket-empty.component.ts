import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

@Component({
  selector: 'camfil-shopping-bucket-empty',
  templateUrl: './camfil-shopping-bucket-empty.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilShoppingBucketEmptyComponent {
  @Input() error: HttpError;
}
