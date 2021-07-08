import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilLoadingComponent } from './camfil-loading.component';

describe('Camfil Loading Component', () => {
  let component: CamfilLoadingComponent;
  let fixture: ComponentFixture<CamfilLoadingComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilLoadingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilLoadingComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
