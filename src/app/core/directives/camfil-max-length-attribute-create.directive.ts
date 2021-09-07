import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MaxLengthFieldsValues } from 'ish-core/models/max-length-validator/max-length-fields-values';

@Directive({
  selector: '[camfilMaxLength]',
})
export class CamfilMaxLengthAttributeCreateDirective implements OnInit, AfterViewInit {
  private maxLengthValues = MaxLengthFieldsValues;
  private maxLength: number;
  private errorElement: HTMLElement;

  constructor(private element: ElementRef, private translateService: TranslateService, private renderer2: Renderer2) {}

  @Input() set camfilMaxLength(fieldName: keyof typeof MaxLengthFieldsValues) {
    this.maxLength = this.maxLengthValues[fieldName];
  }

  @HostListener('input', ['$event']) onKeyDown(event) {
    const input = event.target;
    this.checkIfMaxLengthReached(input);
  }

  @HostListener('focusin', ['$event']) onFocus(event) {
    const input = event.target;
    this.checkIfMaxLengthReached(input);
  }

  @HostListener('focusout', ['$event'])
  onBlur() {
    this.toggleMaxLengthWarning(false);
  }

  ngOnInit() {
    this.element.nativeElement.setAttribute('maxLength', this.maxLength);
  }

  ngAfterViewInit() {
    const formField = this.element.nativeElement.closest('.mat-form-field');
    this.errorElement = this.renderer2.createElement('mat-error');
    this.errorElement.classList.add('mat-error');
    this.errorElement.style.display = 'none';
    this.errorElement.textContent = `${this.translateService.instant(`camfil.form.error.maxLength`, {
      0: this.maxLength,
    })}`;
    this.renderer2.appendChild(formField, this.errorElement);
  }

  private toggleMaxLengthWarning(showMessage = false) {
    if (showMessage) {
      this.errorElement.style.display = 'block';
    } else {
      this.errorElement.style.display = 'none';
    }
  }

  private checkIfMaxLengthReached(input) {
    if (input?.value.length >= this.maxLength) {
      this.toggleMaxLengthWarning(true);
    } else {
      this.toggleMaxLengthWarning(false);
    }
  }
}
