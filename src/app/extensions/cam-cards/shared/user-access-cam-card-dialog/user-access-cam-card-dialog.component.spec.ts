import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { MockDirective, MockPipe } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { CamfilContactSortPipe } from 'ish-core/pipes/camfil-contact-sort.pipe';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';

import { UserAccessCamCardDialogComponent } from './user-access-cam-card-dialog.component';

describe('User Access Cam Card Dialog Component', () => {
  let component: UserAccessCamCardDialogComponent;
  let fixture: ComponentFixture<UserAccessCamCardDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilErrorComponent,
        MockDirective(ServerHtmlDirective),
        MockPipe(CamfilContactSortPipe),
        UserAccessCamCardDialogComponent,
      ],
      providers: [provideMockStore({}), { provide: MAT_DIALOG_DATA, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccessCamCardDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
