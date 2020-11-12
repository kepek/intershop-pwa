import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilCamCardModalComponent } from './camfil-cam-card-modal.component';

describe('Camfil Modal Component', () => {
  let component: CamfilCamCardModalComponent;
  let fixture: ComponentFixture<CamfilCamCardModalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilCamCardModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCamCardModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
