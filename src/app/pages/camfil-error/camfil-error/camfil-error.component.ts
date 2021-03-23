import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The Error Page Component informs the user that the server returned an error.
 * It uses the {@link SearchBoxContainerComponent}.
 *
 * @example
 * <ish-error-page></ish-error-page>
 */
@Component({
  selector: 'camfil-error-text',
  templateUrl: './camfil-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilErrorComponent {}
