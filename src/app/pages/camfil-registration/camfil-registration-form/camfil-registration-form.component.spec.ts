import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { anything, instance, mock, when } from 'ts-mockito';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { AddressFormContainerComponent } from 'ish-shared/address-forms/components/address-form-container/address-form-container.component';
import { AddressFormFactory } from 'ish-shared/address-forms/components/address-form/address-form.factory';
import { AddressFormFactoryProvider } from 'ish-shared/address-forms/configurations/address-form-factory.provider';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { CheckboxComponent } from 'ish-shared/forms/components/checkbox/checkbox.component';
import { TacCheckboxComponent } from 'ish-shared/forms/components/tac-checkbox/tac-checkbox.component';

import { LazyCaptchaComponent } from '../../../extensions/captcha/exports/lazy-captcha/lazy-captcha.component';
import { CamfilIntroComponent } from '../camfil-intro/camfil-intro.component';
import { CamfilRegistrationCompanyFormComponent } from '../camfil-registration-company-form/camfil-registration-company-form.component';
import { CamfilRegistrationCredentialsFormComponent } from '../camfil-registration-credentials-form/camfil-registration-credentials-form.component';

import { CamfilRegistrationFormComponent } from './camfil-registration-form.component';

describe('Camfil Registration Form Component', () => {
  let fixture: ComponentFixture<CamfilRegistrationFormComponent>;
  let component: CamfilRegistrationFormComponent;
  let element: HTMLElement;
  let translate: TranslateService;

  beforeEach(async () => {
    const addressFormFactoryMock = mock(AddressFormFactory);
    when(addressFormFactoryMock.getGroup(anything())).thenReturn(new FormGroup({}));

    const addressFormFactoryProviderMock = mock(AddressFormFactoryProvider);
    when(addressFormFactoryProviderMock.getFactory(anything())).thenReturn(addressFormFactoryMock);

    await TestBed.configureTestingModule({
      declarations: [
        CamfilIntroComponent,
        CamfilRegistrationFormComponent,
        MockComponent(AddressFormContainerComponent),
        MockComponent(CamfilRegistrationCompanyFormComponent),
        MockComponent(CamfilRegistrationCredentialsFormComponent),
        MockComponent(CheckboxComponent),
        MockComponent(ContentIncludeComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(LazyCaptchaComponent),
        MockComponent(ModalDialogComponent),
        MockDirective(TacCheckboxComponent),
      ],
      providers: [{ provide: AddressFormFactoryProvider, useFactory: () => instance(addressFormFactoryProviderMock) }],
      imports: [
        BrowserAnimationsModule,
        FeatureToggleModule.forTesting('businessCustomerRegistration'),
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilRegistrationFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
