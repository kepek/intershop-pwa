import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';

import { CamCardPreferencesDialogComponent } from '../../../shared/cam-card-preferences-dialog/cam-card-preferences-dialog.component';
import { AccountCamCardPdfComponent } from '../account-cam-card-pdf/account-cam-card-pdf.component';

import { AccountCamCardToolbarComponent } from './account-cam-card-toolbar.component';

describe('Account Cam Card Toolbar Component', () => {
  let component: AccountCamCardToolbarComponent;
  let fixture: ComponentFixture<AccountCamCardToolbarComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AccountCamCardToolbarComponent,
        MockComponent(AccountCamCardPdfComponent),
        MockComponent(CamCardPreferencesDialogComponent),
        MockComponent(CamfilLoadingComponent),
      ],
      imports: [AuthorizationToggleModule.forTesting('APP_B2B_MANAGE_USERS'), TranslateModule.forRoot()],
      providers: [provideMockStore()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCamCardToolbarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
