import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilConfirmationModalComponent } from './camfil-confirmation-modal.component';

describe('Camfil Confirmation Modal Component', () => {
  let component: CamfilConfirmationModalComponent;
  let fixture: ComponentFixture<CamfilConfirmationModalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilConfirmationModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilConfirmationModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
