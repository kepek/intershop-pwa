import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { CamCardPreferencesDialogComponent } from '../../../shared/cam-card-preferences-dialog/cam-card-preferences-dialog.component';

import { AccountCamCardDetailToolbarComponent } from './account-cam-card-detail-toolbar.component';

describe('Account Cam Card Detail Toolbar Component', () => {
  let component: AccountCamCardDetailToolbarComponent;
  let fixture: ComponentFixture<AccountCamCardDetailToolbarComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountCamCardDetailToolbarComponent, MockComponent(CamCardPreferencesDialogComponent)],
      imports: [TranslateModule.forRoot()],
      providers: [provideMockStore()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCamCardDetailToolbarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
