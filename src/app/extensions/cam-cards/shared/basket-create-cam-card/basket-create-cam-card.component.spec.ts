import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCardPreferencesDialogComponent } from '../cam-card-preferences-dialog/cam-card-preferences-dialog.component';
import { SelectCamCardModalComponent } from '../select-cam-card-modal/select-cam-card-modal.component';

import { BasketCreateCamCardComponent } from './basket-create-cam-card.component';

describe('Basket Create Cam Card Component', () => {
  let component: BasketCreateCamCardComponent;
  let fixture: ComponentFixture<BasketCreateCamCardComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BasketCreateCamCardComponent,
        MockComponent(CamCardPreferencesDialogComponent),
        MockComponent(SelectCamCardModalComponent),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: CamCardsFacade, useFactory: () => instance(mock(CamCardsFacade)) },
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketCreateCamCardComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
