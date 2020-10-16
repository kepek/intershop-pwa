import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoBottomSheetComponent } from './demo-bottom-sheet.component';

describe('Demo Bottom Sheet Component', () => {
  let component: DemoBottomSheetComponent;
  let fixture: ComponentFixture<DemoBottomSheetComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DemoBottomSheetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoBottomSheetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
