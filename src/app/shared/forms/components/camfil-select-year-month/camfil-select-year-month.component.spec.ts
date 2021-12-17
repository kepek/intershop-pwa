import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { CamfilFormControlFeedbackComponent } from 'ish-shared/forms/components/camfil-form-control-feedback/camfil-form-control-feedback.component';
import { ShowFormFeedbackDirective } from 'ish-shared/forms/directives/show-form-feedback.directive';

import { CamfilSelectYearMonthComponent } from './camfil-select-year-month.component';

describe('Camfil Select Year Month Component', () => {
  let component: CamfilSelectYearMonthComponent;
  let fixture: ComponentFixture<CamfilSelectYearMonthComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilSelectYearMonthComponent,
        MockComponent(CamfilFormControlFeedbackComponent),
        MockDirective(ShowFormFeedbackDirective),
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilSelectYearMonthComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const form = new FormGroup({
      month: new FormControl(''),
      year: new FormControl('', [Validators.required]),
    });
    component.form = form;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should set default values properly on creation', () => {
    fixture.detectChanges();
    expect(component.controlName[0]).toEqual('month');
    expect(component.controlName[1]).toEqual('year');
    expect(component.label).toEqual('checkout.credit_card.expiration_date.label');
  });

  it('should display a month and a year select box after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=month]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=year]')).toBeTruthy();
  });
});
