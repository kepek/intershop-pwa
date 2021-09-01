import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { MessageFacade } from 'ish-core/facades/message.facade';

import { CamfilErrorMessageComponent } from './camfil-error-message.component';

describe('Camfil Error Message Component', () => {
  let component: CamfilErrorMessageComponent;
  let fixture: ComponentFixture<CamfilErrorMessageComponent>;
  let element: HTMLElement;
  let messageFacade: MessageFacade;

  beforeEach(async () => {
    messageFacade = mock(MessageFacade);
    await TestBed.configureTestingModule({
      declarations: [CamfilErrorMessageComponent, ServerHtmlDirective],
      providers: [{ provide: MessageFacade, useFactory: () => instance(messageFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilErrorMessageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
