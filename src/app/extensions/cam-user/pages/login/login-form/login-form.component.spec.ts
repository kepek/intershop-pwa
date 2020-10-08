import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CamfilHeaderBoxComponent } from 'ish-shared/components/common/camfil-header-box/camfil-header-box.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

import { LoginFormComponent } from './login-form.component';

describe('Login Form Component', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let element: HTMLElement;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilHeaderBoxComponent, LoginFormComponent, MockComponent(ErrorMessageComponent)],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [{ provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
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
