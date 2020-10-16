import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilErrorComponent } from './camfil-error.component';

describe('Camfil Error Component', () => {
  let component: CamfilErrorComponent;
  let fixture: ComponentFixture<CamfilErrorComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilErrorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilErrorComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
