import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';

import { MoveCamCardDialogComponent } from './move-cam-card-dialog.component';

describe('Move Cam Card Dialog Component', () => {
  let component: MoveCamCardDialogComponent;
  let fixture: ComponentFixture<MoveCamCardDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockDirective(ServerHtmlDirective), MoveCamCardDialogComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: MAT_DIALOG_DATA, selectedCamCard: [] }, provideMockStore({})],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveCamCardDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
