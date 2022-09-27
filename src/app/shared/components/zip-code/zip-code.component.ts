import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { ZipCodeInfo } from 'ish-core/models/zip-codes/zip-codes.interface';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'camfil-zip-code',
  templateUrl: './zip-code.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZipCodeComponent implements OnInit, OnDestroy {
  @Input() fieldName: string;
  @Input() fieldCity: string;
  @Input() classes?: string;
  @Input() fixedLoader?: string;
  @Input() checkOnInitObj: any;
  @Input() form: FormGroup;
  @Input() errorValidator: any[];
  @Input() appearance = 'fill';

  @Output() submitEmitter = new EventEmitter();

  zipCodesLoading$: Observable<boolean>;
  zipCodesError = false;
  formField: AbstractControl;
  countryByChannel: string;
  checkOnInit = false;
  private destroy$ = new Subject();

  constructor(private accountFacade: AccountFacade, private appFacade: AppFacade, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.zipCodesLoading$ = this.accountFacade.zipCodesLoading$;
    this.appFacade.getCountryCodeByChannel$
      .pipe(takeUntil(this.destroy$))
      .subscribe(code => (this.countryByChannel = code));

    this.formField = this.form.controls[this.fieldName];

    if (this.checkOnInitObj) {
      this.checkOnInit = true;
      this.checkZipCode();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  currentCityOnList(list: ZipCodeInfo[]) {
    return list.find(({ city }) => city === this.form.get([this.fieldCity]).value);
  }

  checkZipCode() {
    const code = this.form.get(this.fieldName).value;
    const countryCode = this.form.get('countryCode')?.value || this.countryByChannel;

    if (code && countryCode) {
      this.accountFacade.loadZipCode$(code, countryCode);
      this.accountFacade
        .getZipCode$(code)
        .pipe(whenTruthy(), distinctUntilChanged(), take(1))
        .subscribe(data => {
          const cityAtAll = data?.[0].city || data?.[0].id;
          if (cityAtAll) {
            const cityOnList = this.currentCityOnList(data);
            const city = cityOnList?.city || cityOnList?.id || cityAtAll;

            if (data?.length > 1) {
              if (cityOnList) {
                this.form.patchValue({ citySelect: city, [this.fieldCity]: city });
                if (!this.checkOnInit) {
                  this.submitEmitter.emit();
                }
              } else {
                this.form.patchValue({ citySelect: '', [this.fieldCity]: '' });
              }
            } else {
              const ccCity = this.form.get(this.fieldCity).value;
              const citySelect = data?.length === 1 ? city : '';
              this.form.patchValue({ citySelect, [this.fieldCity]: city });
              if (!this.checkOnInit || ccCity !== city) {
                this.submitEmitter.emit();
              }
            }
            this.cdRef.detectChanges();
          } else {
            this.zipCodesLoading$.pipe(take(1)).subscribe(loading => {
              if (!loading) {
                this.form.patchValue({ citySelect: '', [this.fieldCity]: '' });
                this.formField.setErrors({ incorrect: true });
                this.form.updateValueAndValidity();
              }
            });
          }
          this.checkOnInit = false;
        });
    } else {
      this.checkOnInit = false;
    }
  }
}
