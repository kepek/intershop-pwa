import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickViewModalComponent } from './quick-view-modal.component';

describe('Quick View Modal Component', () => {
  let component: QuickViewModalComponent;
  let fixture: ComponentFixture<QuickViewModalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickViewModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickViewModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
