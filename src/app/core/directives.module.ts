import { NgModule } from '@angular/core';

import { CamfilMaxLengthAttributeCreateDirective } from './directives/camfil-max-length-attribute-create.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { IdentityProviderCapabilityDirective } from './directives/identity-provider-capability.directive';
import { IntersectionObserverDirective } from './directives/intersection-observer.directive';
import { ServerHtmlDirective } from './directives/server-html.directive';

@NgModule({
  declarations: [
    CamfilMaxLengthAttributeCreateDirective,
    ClickOutsideDirective,
    IdentityProviderCapabilityDirective,
    IntersectionObserverDirective,
    ServerHtmlDirective,
  ],
  exports: [
    CamfilMaxLengthAttributeCreateDirective,
    ClickOutsideDirective,
    IdentityProviderCapabilityDirective,
    IntersectionObserverDirective,
    ServerHtmlDirective,
  ],
})
export class DirectivesModule {}
