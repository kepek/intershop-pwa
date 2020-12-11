import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { CamfilCamCardModalComponent } from 'ish-shared/components/common/camfil-cam-card-modal/camfil-cam-card-modal.component';

import { CamfilModalDialogComponent } from './camfil-modal-dialog.component';

describe('Camfil Modal Dialog Component', () => {
  let component: CamfilModalDialogComponent<string>;
  let fixture: ComponentFixture<CamfilModalDialogComponent<string>>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbModalModule, TranslateModule.forRoot()],
      declarations: [CamfilCamCardModalComponent, CamfilModalDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<typeof component>(CamfilModalDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.options = {
      titleText: 'test',
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  xit('should display modal dialog when show function is called', () => {
    fixture.detectChanges();
    component.show();
    expect(component.ngbModalRef).toBeTruthy();
  });

  it('should not display modal dialog when show function is not called', () => {
    fixture.detectChanges();
    expect(component.ngbModalRef).toBeFalsy();
  });

  xit('should output input data on confirm', done => {
    let firedData;

    component.show('test');
    component.confirmed.subscribe(data => {
      firedData = data;
      done();
    });
    component.confirm();

    expect(firedData).toBe('test');
  });
});
