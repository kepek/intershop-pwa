import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DirectivesModule } from 'ish-core/directives.module';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';
import { MaterialModule } from 'ish-shared/material/material.module';

import { CamfilCounterComponent } from './components/camfil-counter/camfil-counter.component';
import { CamfilFormControlFeedbackComponent } from './components/camfil-form-control-feedback/camfil-form-control-feedback.component';
import { CamfilSelectYearMonthComponent } from './components/camfil-select-year-month/camfil-select-year-month.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { CounterComponent } from './components/counter/counter.component';
import { FormControlFeedbackComponent } from './components/form-control-feedback/form-control-feedback.component';
import { InputBirthdayComponent } from './components/input-birthday/input-birthday.component';
import { InputComponent } from './components/input/input.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { SelectAddressComponent } from './components/select-address/select-address.component';
import { SelectCountryComponent } from './components/select-country/select-country.component';
import { SelectRegionComponent } from './components/select-region/select-region.component';
import { SelectTitleComponent } from './components/select-title/select-title.component';
import { SelectYearMonthComponent } from './components/select-year-month/select-year-month.component';
import { SelectComponent } from './components/select/select.component';
import { TacCheckboxComponent } from './components/tac-checkbox/tac-checkbox.component';
import { TextareaComponent } from './components/textarea/textarea.component';
import { ShowFormFeedbackDirective } from './directives/show-form-feedback.directive';

const exportedComponents = [
  CamfilCounterComponent,
  CamfilFormControlFeedbackComponent,
  CamfilSelectYearMonthComponent,
  CheckboxComponent,
  CounterComponent,
  FormControlFeedbackComponent,
  InputBirthdayComponent,
  InputComponent,
  SearchInputComponent,
  SelectAddressComponent,
  SelectComponent,
  SelectCountryComponent,
  SelectRegionComponent,
  SelectTitleComponent,
  SelectYearMonthComponent,
  ShowFormFeedbackDirective,
  TacCheckboxComponent,
  TextareaComponent,
];

@NgModule({
  imports: [
    CommonModule,
    DirectivesModule,
    FeatureToggleModule,
    IconModule,
    MaterialModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
  ],
  declarations: [...exportedComponents],
  exports: [...exportedComponents],
})
export class FormsSharedModule { }
