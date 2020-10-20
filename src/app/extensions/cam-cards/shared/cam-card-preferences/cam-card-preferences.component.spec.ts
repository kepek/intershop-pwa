import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamCardPreferencesComponent } from './cam-card-preferences.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('Cam Card Preferences Component', () => {
  let component: CamCardPreferencesComponent;
  let fixture: ComponentFixture<CamCardPreferencesComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamCardPreferencesComponent],
      providers: [provideMockStore({})],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamCardPreferencesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
