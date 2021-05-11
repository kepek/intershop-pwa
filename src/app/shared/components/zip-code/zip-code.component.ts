import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';

@Component({
  selector: 'camfil-zip-code',
  templateUrl: './zip-code.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZipCodeComponent implements OnInit, OnDestroy {
  @Input() fieldName: string;
  @Input() fieldCity: string;
  @Input() classes?: string;
  @Input() checkOnInitObj: any;
  @Input() form: FormGroup;
  @Input() errorValidator: any[];
  @Input() countryChangeDetect: Subject<boolean>;
  @Input() appearance = 'fill';

  @Output() submitEmitter = new EventEmitter();
  @Output() zipCodeErrorEmit = new EventEmitter<{}>();

  zipCodesLoading$: Observable<boolean>;
  zipCodesError = false;
  formField;
  countryByChannel: string;

  private destroy$ = new Subject();

  constructor(private accountFacade: AccountFacade, private appFacade: AppFacade) {}

  ngOnInit() {
    this.appFacade.getCountryByChannel$
      .pipe(takeUntil(this.destroy$))
      .subscribe(code => (this.countryByChannel = code));

    this.zipCodesLoading$ = this.accountFacade.zipCodesLoading$;
    this.countryChangeDetect.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.checkZipCode();
    });

    if (this.checkOnInitObj) {
      this.checkZipCode();
    }

    this.formField = this.form.controls[this.fieldName];
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkZipCode() {
    const code = this.form.get(this.fieldName).value;
    const countryCode = this.form.get('countryCode')?.value || this.countryByChannel;

    if (code && countryCode) {
      this.accountFacade
        .getZipCode$(code, countryCode)
        .pipe(distinctUntilChanged())
        .subscribe(data => {
          const city = data?.city || data?.id;
          if (city) {

            //TODO porównanie wartości ze wczesniejszą
            this.form.patchValue({ [this.fieldCity]: city });
            this.submitEmitter.emit();
          } else {
            this.zipCodesLoading$.pipe(take(1)).subscribe(loading => {
              if (!loading) {
                this.form.patchValue({ [this.fieldCity]: '' });
                this.zipCodeErrorEmit.emit({ incorrect: true });
              }
            });
          }
        });
    }
  }
}
