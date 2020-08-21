import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { CamfilFilterAppliedComponent } from './camfil-filter-applied.component';

describe('Camfil Filter Applied Component', () => {
  let component: CamfilFilterAppliedComponent;
  let fixture: ComponentFixture<CamfilFilterAppliedComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatChipsModule, MatIconModule],
      declarations: [CamfilFilterAppliedComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilFilterAppliedComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
