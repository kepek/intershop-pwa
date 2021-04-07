import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CamfilB2bRole } from '../../models/camfil-b2b-role/camfil-b2b-role.model';

@Component({
  selector: 'camfil-organization-user-roles-form',
  templateUrl: './camfil-organization-user-roles-form.component.html',
  styleUrls: ['./camfil-organization-user-roles-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CamfilOrganizationUserRolesFormComponent implements OnInit {
  @Input() roles: CamfilB2bRole[];
  @Input() selectedRoles: CamfilB2bRole[];
  @Input() staticRoles: CamfilB2bRole[];

  @Output() selectCustomerUserRoles = new EventEmitter<{ roleIDs: string[] }>();

  options: (CamfilB2bRole & { disabled: boolean })[] = [];
  selectedOptions: string[] = [];

  ngOnInit() {
    this.selectedOptions = this.selectedRoles?.map(role => role.id);
    this.options = this.roles?.map(role => ({
      ...role,
      disabled: role.fixed || this.staticRoles?.map(r => r.id)?.includes(role.id),
    }));
  }

  onCustomerUserRolesChange() {
    this.selectCustomerUserRoles.emit({ roleIDs: this.selectedOptions });
  }
}
