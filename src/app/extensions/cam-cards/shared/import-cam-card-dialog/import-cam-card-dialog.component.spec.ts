import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { ImportCamCardDialogComponent } from './import-cam-card-dialog.component';

describe('Import Cam Card Dialog Component', () => {
  let component: ImportCamCardDialogComponent;
  let fixture: ComponentFixture<ImportCamCardDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportCamCardDialogComponent, MockComponent(LoadingComponent), MockDirective(ServerHtmlDirective)],
      imports: [],
      providers: [{ provide: MatDialogRef, useValue: {} }, provideMockStore({})],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCamCardDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
