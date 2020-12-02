import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilQuickViewModalComponent } from './camfil-quick-view-modal.component';

describe('Camfil Quick View Modal Component', () => {
  let component: CamfilQuickViewModalComponent;
  let fixture: ComponentFixture<CamfilQuickViewModalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilQuickViewModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilQuickViewModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
