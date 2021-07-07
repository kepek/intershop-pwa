import { AnimationTriggerMetadata, animate, state, style, transition, trigger } from '@angular/animations';

export default (durationMillis = 750): AnimationTriggerMetadata =>
  trigger('bottomOut', [
    state('*', style({ transform: 'translateY(0)', opacity: 1 })),
    state('bottom-out', style({ transform: 'translateY(100%)', opacity: 0, position: 'absolute' })),
    transition('* => bottom-out', animate(`${durationMillis}ms ease-out`)),
  ]);
