import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

import { CamfilAhuFiltersComponent } from './camfil-ahu-filters.component';

describe('Camfil Ahu Filters Component', () => {
  let component: CamfilAhuFiltersComponent;
  let fixture: ComponentFixture<CamfilAhuFiltersComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilAhuFiltersComponent],
      imports: [TranslateModule.forRoot()],
      providers: [provideMockStore()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilAhuFiltersComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
