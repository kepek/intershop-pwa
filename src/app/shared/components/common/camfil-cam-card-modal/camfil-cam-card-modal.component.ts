import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'camfil-cam-card-modal',
  templateUrl: './camfil-cam-card-modal.component.html',
  styleUrls: ['./camfil-cam-card-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCamCardModalComponent implements AfterViewInit {
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
  @Input() secondaryTabIndex = 0;
  @Input() primaryTabIndex = 0;

  @Output() primaryButtonClicked = new EventEmitter<any>();
  @Output() secondaryButtonClicked = new EventEmitter<any>();
  @Output() hiddenClicked = new EventEmitter<any>();
  @Output() resetQuantityValue = new EventEmitter<void>();

  @Input() loading?: boolean;
  @Input() focus?: 'secondaryButton' | 'primaryButton';

  @ViewChild('secondaryButton') secondaryButton: MatButton;
  @ViewChild('primaryButton') primaryButton: MatButton;

  ngAfterViewInit() {
    if (this.focus) {
      const label = this.focus;
      this[label]?.focus();
    }
  }

  emitPrimary() {
    this.primaryButtonClicked.emit();
  }

  emitSecondary() {
    this.secondaryButtonClicked.emit();
  }

  emitHidden() {
    this.hiddenClicked.emit();
  }

  resetFormValues() {
    this.resetQuantityValue.emit();
  }
}
