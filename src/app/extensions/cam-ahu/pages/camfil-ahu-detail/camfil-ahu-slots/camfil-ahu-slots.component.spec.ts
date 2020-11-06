import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

import { CamfilAhuSlotsComponent } from './camfil-ahu-slots.component';

describe('Camfil AHU Slots Component', () => {
  let component: CamfilAhuSlotsComponent;
  let fixture: ComponentFixture<CamfilAhuSlotsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilAhuSlotsComponent],
      imports: [TranslateModule.forRoot()],
      providers: [provideMockStore()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilAhuSlotsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
