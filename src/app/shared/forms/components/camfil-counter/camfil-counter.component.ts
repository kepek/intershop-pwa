import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FormElementComponent } from 'ish-shared/forms/components/form-element/form-element.component';

@Component({
  selector: 'camfil-counter',
  templateUrl: './camfil-counter.component.html',
  styleUrls: ['./camfil-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCounterComponent extends FormElementComponent implements OnInit, OnDestroy, OnChanges {
  @Input() min: number;
  @Input() max: number;
  @Input() isInLineItem = false;
  @Input() lineItemId?: string;
  @Input() stepQuantityValue = 1;
  value$ = new ReplaySubject<number>(1);
  cannotDecrease$: Observable<boolean>;
  cannotIncrease$: Observable<boolean>;

  private destroy$ = new Subject();

  constructor(protected translate: TranslateService, private checkoutFacade: CheckoutFacade) {
    super(translate);
  }

  handleInput(event) {
    if (event.target.value > this.max) {
      this.formControl.setValue(this.max);
    }
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      event.preventDefault();
      event.target.blur();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private get value(): number {
    return +this.formControl.value;
  }

  ngOnChanges() {
    this.value$.next(this.value);
  }

  ngOnInit() {
    super.init();
    this.cannotDecrease$ = this.value$.pipe(map(value => this.min !== undefined && value <= this.min));
    this.cannotIncrease$ = this.value$.pipe(map(value => this.max !== undefined && value >= this.max));

    this.formControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(this.value$);
  }

  increase() {
    (this.formControl as FormControl).setValue(
      this.value + (isNaN(this.stepQuantityValue) ? 1 : this.stepQuantityValue),
      {
        emitEvent: true,
      }
    );
  }

  decrease() {
    (this.formControl as FormControl).setValue(
      this.value - (isNaN(this.stepQuantityValue) ? 1 : this.stepQuantityValue),
      {
        emitEvent: true,
      }
    );
  }

  get displayLabel(): boolean {
    return !!this.label && !!this.label.trim();
  }

  setFocusedElement(target: HTMLDataElement) {
    this.checkoutFacade.setCheckoutFocusedElement(target.id);
  }
}
