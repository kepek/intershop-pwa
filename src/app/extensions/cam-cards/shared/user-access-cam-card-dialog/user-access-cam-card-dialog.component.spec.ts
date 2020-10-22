import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';

import { UserAccessCamCardDialogComponent } from './user-access-cam-card-dialog.component';

describe('User Access Cam Card Dialog Component', () => {
  let component: UserAccessCamCardDialogComponent;
  let fixture: ComponentFixture<UserAccessCamCardDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockDirective(ServerHtmlDirective), UserAccessCamCardDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccessCamCardDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  xit('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
