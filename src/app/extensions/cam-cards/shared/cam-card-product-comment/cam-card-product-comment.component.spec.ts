import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { CamCardProductCommentComponent } from './cam-card-product-comment.component';

describe('Cam Card Product Comment Component', () => {
  let component: CamCardProductCommentComponent;
  let fixture: ComponentFixture<CamCardProductCommentComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamCardProductCommentComponent],
      providers: [provideMockStore({})],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamCardProductCommentComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  xit('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
