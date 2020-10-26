import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCamCardModalComponent } from './create-cam-card-modal.component';

describe('Create Cam Card Modal Component', () => {
  let component: CreateCamCardModalComponent;
  let fixture: ComponentFixture<CreateCamCardModalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCamCardModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCamCardModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
