import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';

import { ZipCodeComponent } from './zip-code.component';

describe('Zip Code Component', () => {
  let component: ZipCodeComponent;
  let fixture: ComponentFixture<ZipCodeComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;
  let appFacade: AppFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    appFacade = mock(AppFacade);

    await TestBed.configureTestingModule({
      declarations: [CamfilErrorComponent, MockComponent(CamfilLoadingComponent), ZipCodeComponent],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(ZipCodeComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.fieldName = 'zipCode';
    component.fieldCity = 'city';
    component.form = fb.group({
      zipCode: ['123', [Validators.required]],
    });

    when(accountFacade.zipCodesLoading$).thenReturn(of(false));
    when(appFacade.getChannel$).thenReturn(of('SE'));
    when(appFacade.getCountryCodeByChannel$).thenReturn(of('SE'));
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
