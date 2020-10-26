import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'camfil-modal',
  templateUrl: './camfil-modal.component.html',
  styleUrls: ['./camfil-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilModalComponent {
  @Input() title: string;
  @Input() iconName?: string;
  @Input() subtitle?: string;
  @Input() customHeaderTemplate?: TemplateRef<any>;

  @Input() detailsTemplate?: TemplateRef<any>;

  @Input() searchTitle?: string;
  @Input() searchTemplate?: TemplateRef<any>;

  @Input() mainContentTemplate?: TemplateRef<any>;

  @Input() primaryButtonTitle?: string;
  @Input() secondaryButtonTitle?: string;
  @Input() secondaryDisabled?: boolean;

  @Output() primaryButtonClicked = new EventEmitter<any>();
  @Output() secondaryButtonClicked = new EventEmitter<any>();

  emitPrimary() {
    this.primaryButtonClicked.emit();
  }

  emitSecondary() {
    this.secondaryButtonClicked.emit();
  }
}
