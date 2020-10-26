import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilModalComponent } from './camfil-modal.component';

describe('Camfil Modal Component', () => {
  let component: CamfilModalComponent;
  let fixture: ComponentFixture<CamfilModalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
