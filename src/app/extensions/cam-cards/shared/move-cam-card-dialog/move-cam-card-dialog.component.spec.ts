import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { MockDirective, MockPipe } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { CamfilContactSortPipe } from 'ish-core/pipes/camfil-contact-sort.pipe';

import { MoveCamCardDialogComponent } from './move-cam-card-dialog.component';

describe('Move Cam Card Dialog Component', () => {
  let component: MoveCamCardDialogComponent;
  let fixture: ComponentFixture<MoveCamCardDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockDirective(ServerHtmlDirective), MockPipe(CamfilContactSortPipe), MoveCamCardDialogComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: MatDialogRef, useValue: {} },
        provideMockStore({}),
      ],
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
