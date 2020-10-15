import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { CamfilOrderListComponent } from 'ish-shared/components/order/camfil-order-list/camfil-order-list.component';

import { CamfilAccountOrderHistoryPageComponent } from './camfil-account-order-history-page.component';

describe('Camfil Account Order History Page Component', () => {
  let component: CamfilAccountOrderHistoryPageComponent;
  let fixture: ComponentFixture<CamfilAccountOrderHistoryPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilAccountOrderHistoryPageComponent,
        MockComponent(CamfilOrderListComponent),
        MockComponent(LoadingComponent),
        MockDirective(ServerHtmlDirective),
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilAccountOrderHistoryPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render order list component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('camfil-order-list')).toBeTruthy();
  });
});
