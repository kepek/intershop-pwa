import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamCardModalDetailsComponent } from './cam-card-modal-details.component';

describe('Cam Card Modal Details Component', () => {
  let component: CamCardModalDetailsComponent;
  let fixture: ComponentFixture<CamCardModalDetailsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamCardModalDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamCardModalDetailsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
