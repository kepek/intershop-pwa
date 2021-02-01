import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CamfilCamCardModalComponent } from './camfil-cam-card-modal.component';

describe('Camfil Cam Card Modal Component', () => {
  let component: CamfilCamCardModalComponent;
  let fixture: ComponentFixture<CamfilCamCardModalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilCamCardModalComponent, MockComponent(LoadingComponent)],
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
