import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'camfil-cam-card-modal',
  templateUrl: './camfil-cam-card-modal.component.html',
  styleUrls: ['./camfil-cam-card-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCamCardModalComponent {
  @Input() title?: string;
  @Input() iconName?: string;
  @Input() svgIcon?: string;
  @Input() subtitle?: string;
  @Input() customHeaderTemplate?: TemplateRef<any>;

  @Input() detailsTemplate?: TemplateRef<any>;

  @Input() searchTitle?: string;
  @Input() searchTemplate?: TemplateRef<any>;

  @Input() mainContentTemplate?: TemplateRef<any>;

  @Input() primaryButtonTitle?: string;
  @Input() secondaryButtonTitle?: string;
  @Input() secondaryDisabled?: boolean;
  @Input() primaryDisabled?: boolean;

  @Output() primaryButtonClicked = new EventEmitter<any>();
  @Output() secondaryButtonClicked = new EventEmitter<any>();
  @Output() hiddenClicked = new EventEmitter<any>();

  @Input() loading?: boolean;

  emitPrimary() {
    this.primaryButtonClicked.emit();
  }

  emitSecondary() {
    this.secondaryButtonClicked.emit();
  }

  emitHidden() {
    this.hiddenClicked.emit();
  }
}
