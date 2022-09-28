import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';

import { CamfilCityFieldComponent } from './camfil-city-field.component';

describe('Camfil City Field Component', () => {
  let component: CamfilCityFieldComponent;
  let fixture: ComponentFixture<CamfilCityFieldComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);

    await TestBed.configureTestingModule({
      declarations: [CamfilCityFieldComponent, CamfilErrorComponent],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(CamfilCityFieldComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.fieldCity = 'fieldCity';
    component.fieldSelect = 'fieldSelect';
    component.fieldCode = 'fieldCode';
    component.form = fb.group({
      fieldCity: ['123', [Validators.required]],
      fieldSelect: ['', [Validators.required]],
    });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
