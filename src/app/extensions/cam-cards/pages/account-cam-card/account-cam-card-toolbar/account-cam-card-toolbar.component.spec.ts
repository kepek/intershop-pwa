import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { CamCardPreferencesDialogComponent } from '../../../shared/cam-card-preferences-dialog/cam-card-preferences-dialog.component';

import { AccountCamCardToolbarComponent } from './account-cam-card-toolbar.component';

describe('Account Cam Card Toolbar Component', () => {
  let component: AccountCamCardToolbarComponent;
  let fixture: ComponentFixture<AccountCamCardToolbarComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountCamCardToolbarComponent, MockComponent(CamCardPreferencesDialogComponent)],
      imports: [TranslateModule.forRoot()],
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
