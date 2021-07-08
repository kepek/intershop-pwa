import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

/**
 * The Loading Component
 *
 * Displayes a loading animation overlay by default, but is useable as standalone loading animation too.
 *
 * @example
 * <camfil-loading></camfil-loading>
 */
@Component({
  selector: 'camfil-loading',
  templateUrl: './camfil-loading.component.html',
  styleUrls: ['./camfil-loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilLoadingComponent extends LoadingComponent {}
