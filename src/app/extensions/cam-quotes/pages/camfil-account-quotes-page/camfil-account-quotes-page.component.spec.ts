import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { SharedModule } from 'ish-shared/shared.module';

import { CamQuotesStoreModule } from '../../store/cam-quotes-store.module';

import { CamfilAccountQuotesPageComponent } from './camfil-account-quotes-page.component';

describe('Camfil Account Quotes Page Component', () => {
  let component: CamfilAccountQuotesPageComponent;
  let fixture: ComponentFixture<CamfilAccountQuotesPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilAccountQuotesPageComponent],
      imports: [
        CamQuotesStoreModule.forTesting(),
        CoreStoreModule.forTesting(),
        NgbModalModule,
        RouterTestingModule,
        SharedModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilAccountQuotesPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
