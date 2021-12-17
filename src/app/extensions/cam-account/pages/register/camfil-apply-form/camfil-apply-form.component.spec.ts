import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { anything, instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { CamfilSlugifyPipe } from 'ish-core/pipes/camfil-slugify.pipe';
import { CamfilToastrService } from 'ish-core/store/core/messages/CamfilToastrService';
import { AddressFormContainerComponent } from 'ish-shared/address-forms/components/address-form-container/address-form-container.component';
import { AddressFormFactory } from 'ish-shared/address-forms/components/address-form/address-form.factory';
import { AddressFormFactoryProvider } from 'ish-shared/address-forms/configurations/address-form-factory.provider';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { CamfilCityFieldComponent } from 'ish-shared/components/common/camfil-city-field/camfil-city-field.component';
import { CamfilErrorMessageComponent } from 'ish-shared/components/common/camfil-error-message/camfil-error-message.component';
import { CamfilHeaderBoxComponent } from 'ish-shared/components/common/camfil-header-box/camfil-header-box.component';
import { CamfilModalDialogComponent } from 'ish-shared/components/common/camfil-modal-dialog/camfil-modal-dialog.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { ZipCodeComponent } from 'ish-shared/components/zip-code/zip-code.component';
import { CheckboxComponent } from 'ish-shared/forms/components/checkbox/checkbox.component';
import { TacCheckboxComponent } from 'ish-shared/forms/components/tac-checkbox/tac-checkbox.component';

import { LazyCamCaptchaComponent } from '../../../../cam-captcha/exports/lazy-cam-captcha/lazy-cam-captcha.component';

import { CamfilApplyFormComponent } from './camfil-apply-form.component';

describe('Camfil Apply Form Component', () => {
  let fixture: ComponentFixture<CamfilApplyFormComponent>;
  let component: CamfilApplyFormComponent;
  let element: HTMLElement;
  let translate: TranslateService;
  let toastrServiceMock: CamfilToastrService;
  let appFacadeMock: AppFacade;

  beforeEach(async () => {
    toastrServiceMock = mock(CamfilToastrService);
    appFacadeMock = mock(AppFacade);
    const addressFormFactoryMock = mock(AddressFormFactory);
    when(addressFormFactoryMock.getGroup(anything())).thenReturn(new FormGroup({}));

    const addressFormFactoryProviderMock = mock(AddressFormFactoryProvider);
    when(addressFormFactoryProviderMock.getFactory(anything())).thenReturn(addressFormFactoryMock);

    await TestBed.configureTestingModule({
      declarations: [
        CamfilApplyFormComponent,
        CamfilHeaderBoxComponent,
        CamfilSmallCtaModalComponent,
        MockComponent(AddressFormContainerComponent),
        MockComponent(CamfilCityFieldComponent),
        MockComponent(CamfilErrorMessageComponent),
        MockComponent(CamfilModalDialogComponent),
        MockComponent(CheckboxComponent),
        MockComponent(ContentIncludeComponent),
        MockComponent(LazyCamCaptchaComponent),
        MockComponent(ZipCodeComponent),
        MockDirective(TacCheckboxComponent),
        MockPipe(CamfilSlugifyPipe),
      ],
      providers: [
        { provide: AddressFormFactoryProvider, useFactory: () => instance(addressFormFactoryProviderMock) },
        { provide: CamfilToastrService, useFactory: () => instance(toastrServiceMock) },
        { provide: AppFacade, useFactory: () => instance(appFacadeMock) },
      ],
      imports: [
        BrowserAnimationsModule,
        FeatureToggleModule.forTesting('businessCustomerRegistration'),
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilApplyFormComponent);
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
