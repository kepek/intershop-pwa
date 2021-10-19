import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';

import { CamfilGuestFormComponent } from './camfil-guest-form.component';

describe('Camfil Guest Form Component', () => {
  let component: CamfilGuestFormComponent;
  let fixture: ComponentFixture<CamfilGuestFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilGuestFormComponent, CamfilMaxLengthAttributeCreateDirective],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilGuestFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
