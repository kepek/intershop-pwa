import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { CamfilB2bUser } from '../../models/camfil-b2b-user/camfil-b2b-user.model';

@Component({
  selector: 'camfil-organization-user-approvers',
  templateUrl: './camfil-organization-user-approvers.component.html',
  styleUrls: ['./camfil-organization-user-approvers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CamfilOrganizationUserApproversComponent implements OnChanges {
  @Input() set user(user: CamfilB2bUser) {
    this.userValue = user;
  }

  get user() {
    return this.userValue;
  }

  private userValue: CamfilB2bUser;

  @Input() approverUsers: CamfilB2bUser[];

  @Output() changeApprovers = new EventEmitter<string[]>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  // Methods

  private initForm() {
    const approversValue = (this.user.approvers || [])
      .map(approver => this.approverUsers.find(user => user.login === approver || user.id === approver)?.id)
      .filter(a => !!a);
    this.form = this.fb.group({
      approvers: new FormControl({
        value: approversValue,
        disabled: false,
      }),
    });
    this.form.get('approvers').valueChanges.subscribe(value => this.onSelectChange(value));
  }

  // Handlers

  onSelectChange(approversIds: string[]) {
    this.changeApprovers.emit(approversIds);
  }

  // Hooks

  ngOnChanges() {
    this.initForm();
  }
}
