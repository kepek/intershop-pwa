import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { CamfilB2bUser } from '../../models/camfil-b2b-user/camfil-b2b-user.model';

@Component({
  selector: 'camfil-organization-user-approvers',
  templateUrl: './camfil-organization-user-approvers.component.html',
  styleUrls: ['./camfil-organization-user-approvers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CamfilOrganizationUserApproversComponent implements OnInit {

  @Input() set user(user: CamfilB2bUser) {
    this.userValue = user;
  }

  get user() {
    return this.userValue;
  }

  private userValue: CamfilB2bUser;

  @Input() approverUsers: CamfilB2bUser[];

  @Output() changeApprovers = new EventEmitter<{
    user: CamfilB2bUser;
    approvers: CamfilB2bUser[];
  }>();

  form: FormGroup;

  constructor(private fb: FormBuilder) { }

  // Methods

  private initForm() {
    this.form = this.fb.group({
      approvers: new FormControl({
        value: [],
        disabled: false,
      }),
    });
    this.form.get('approvers').valueChanges.subscribe(value => this.onSelectChange(value));
  }

  private updateForm() {
    if (!(this.form instanceof FormGroup)) {
      return;
    }

    const approvers = this.form.get('approvers');
    const needsApprovers = !!(this.user?.roleIDs?.find(r => r === 'APP_B2B_NEEDS_APPROVAL'));
    if (needsApprovers) {
      approvers.enable();
    } else {
      if (approvers.value && approvers.value.length > 0) {
        // Clear approvers
      }
      approvers.disable();
    }

    console.log(this.user, this.approverUsers);
  }

  // Handlers

  onSelectChange(approversIds: string[]) {
    console.log(approversIds);
  }

  // Hooks

  ngOnInit() {
    this.initForm();
    this.updateForm();
  }

  ngOnChanges() {
    this.updateForm();
  }
}
