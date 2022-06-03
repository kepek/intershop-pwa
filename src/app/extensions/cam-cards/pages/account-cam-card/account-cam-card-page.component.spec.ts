import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CamfilErrorMessageComponent } from 'ish-shared/components/common/camfil-error-message/camfil-error-message.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { CamfilModalDialogComponent } from 'ish-shared/components/common/camfil-modal-dialog/camfil-modal-dialog.component';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCardPreferencesDialogComponent } from '../../shared/cam-card-preferences-dialog/cam-card-preferences-dialog.component';
import { CamCardPreferencesComponent } from '../../shared/cam-card-preferences/cam-card-preferences.component';

import { AccountCamCardListComponent } from './account-cam-card-list/account-cam-card-list.component';
import { AccountCamCardPageComponent } from './account-cam-card-page.component';

describe('Account Cam Card Page Component', () => {
  let component: AccountCamCardPageComponent;
  let fixture: ComponentFixture<AccountCamCardPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const camCardsFacade = mock(CamCardsFacade);

    when(camCardsFacade.camCardAdding$).thenReturn(of(false));

    await TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), NgbPopoverModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        AccountCamCardPageComponent,
        MockComponent(AccountCamCardListComponent),
        MockComponent(CamCardPreferencesComponent),
        MockComponent(CamCardPreferencesDialogComponent),
        MockComponent(CamfilErrorMessageComponent),
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilModalDialogComponent),
        MockComponent(FaIconComponent),
      ],
      providers: [{ provide: CamCardsFacade, useFactory: () => instance(camCardsFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCamCardPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
