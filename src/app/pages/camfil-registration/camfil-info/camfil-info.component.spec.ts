import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CamfilInfoComponent } from './camfil-info.component';

describe('Camfil Info Component', () => {
  let component: CamfilInfoComponent;
  let fixture: ComponentFixture<CamfilInfoComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CamfilInfoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilInfoComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
