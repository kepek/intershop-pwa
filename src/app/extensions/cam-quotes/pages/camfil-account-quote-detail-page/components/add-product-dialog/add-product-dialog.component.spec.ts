import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { CamfilCounterComponent } from 'ish-shared/forms/components/camfil-counter/camfil-counter.component';

import { AddProductDialogComponent } from './add-product-dialog.component';

describe('Add Product Dialog Component', () => {
  let component: AddProductDialogComponent;
  let fixture: ComponentFixture<AddProductDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddProductDialogComponent, MockComponent(CamfilCounterComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
