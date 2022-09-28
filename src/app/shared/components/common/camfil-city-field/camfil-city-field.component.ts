import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ZipCodeInfo } from 'ish-core/models/zip-codes/zip-codes.interface';
import { whenTruthy } from 'ish-core/utils/operators';

import { CITY_SELECT_VALIDATORS } from './validators';

@Component({
  selector: 'camfil-city-field',
  templateUrl: './camfil-city-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCityFieldComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() fieldCity: string;
  @Input() fieldSelect: string;
  @Input() fieldCode: string;
  @Input() appearance = 'fill';
  errorValidator = CITY_SELECT_VALIDATORS;

  citiesList$: Observable<ZipCodeInfo[]>;
  formSelect: AbstractControl;

  @Output() pickCityEmit = new EventEmitter();

  private destroy$ = new Subject();
  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.formSelect = this.form.controls[this.fieldSelect];
    const zip = this.form.get(this.fieldCode)?.value;
    if (zip) {
      this.citiesList$ = this.accountFacade.getZipCode$(zip).pipe(whenTruthy(), take(1));
    }

    this.form
      .get(this.fieldCode)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(code => {
        this.citiesList$ = this.accountFacade.getZipCode$(code).pipe(whenTruthy(), take(1));
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  pickCity({ value }: MatSelect) {
    if (value) {
      this.form.patchValue({ [this.fieldCity]: value });
      this.pickCityEmit.emit();
    }
  }
}
