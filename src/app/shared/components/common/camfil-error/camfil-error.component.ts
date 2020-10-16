import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

interface ErrorValidator {
  error: string;
  message: string;
  ifNot?: string;
}

@Component({
  selector: 'camfil-error',
  templateUrl: './camfil-error.component.html',
  styleUrls: ['./camfil-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilErrorComponent {
  @Input() errorValidators: ErrorValidator[];
  @Input() touched: boolean;
  @Input() errors: {};
}
