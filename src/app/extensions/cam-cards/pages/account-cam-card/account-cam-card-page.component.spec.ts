import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCardPreferencesDialogComponent } from '../../shared/cam-card-preferences-dialog/cam-card-preferences-dialog.component';

import { AccountCamCardListComponent } from './account-cam-card-list/account-cam-card-list.component';
import { AccountCamCardPageComponent } from './account-cam-card-page.component';

describe('Account Cam Card Page Component', () => {
  let component: AccountCamCardPageComponent;
  let fixture: ComponentFixture<AccountCamCardPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const camCardsFacade = mock(CamCardsFacade);

    TestBed.configureTestingModule({
      imports: [NgbPopoverModule, TranslateModule.forRoot()],
      declarations: [
        AccountCamCardPageComponent,
        MockComponent(AccountCamCardListComponent),
        MockComponent(CamCardPreferencesDialogComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(FaIconComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [{ provide: CamCardsFacade, useFactory: () => instance(camCardsFacade) }],
    }).compileComponents();
  }));

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
