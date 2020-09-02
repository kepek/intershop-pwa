import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';

import { CamfilFilterCollapsableComponent } from 'ish-shared/components/filter/camfil-filter-collapsable/camfil-filter-collapsable.component';
import { CamfilFilterInfoComponent } from 'ish-shared/components/filter/camfil-filter-info/camfil-filter-info.component';

import { CamfilFilterMeasurementsComponent } from './camfil-filter-measurements.component';

describe('Camfil Filter Measurements Component', () => {
  let component: CamfilFilterMeasurementsComponent;
  let fixture: ComponentFixture<CamfilFilterMeasurementsComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CamfilFilterMeasurementsComponent,
        MockComponent(CamfilFilterCollapsableComponent),
        MockComponent(CamfilFilterInfoComponent),
      ],
      imports: [RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilFilterMeasurementsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
