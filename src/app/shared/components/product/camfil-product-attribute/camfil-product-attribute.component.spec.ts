import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { AttributeToStringPipe } from 'ish-core/models/attribute/attribute.pipe';

import { CamfilProductAttributeComponent } from './camfil-product-attribute.component';

describe('Camfil Product Attribute Component', () => {
  let component: CamfilProductAttributeComponent;
  let fixture: ComponentFixture<CamfilProductAttributeComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilProductAttributeComponent, MockPipe(AttributeToStringPipe)],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductAttributeComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
