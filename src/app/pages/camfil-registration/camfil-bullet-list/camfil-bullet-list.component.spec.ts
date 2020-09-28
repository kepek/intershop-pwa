import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilBulletListComponent } from './camfil-bullet-list.component';

describe('CamfilBulletListComponent', () => {
  let component: CamfilBulletListComponent;
  let fixture: ComponentFixture<CamfilBulletListComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilBulletListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilBulletListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
