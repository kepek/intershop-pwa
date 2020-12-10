import {CamCardContact} from "./cam-card.model";

export class ContactMapper {
  static fromData(payload: CamCardContact[]): CamCardContact[] {

    return payload.map(contact => ({
      ...contact,
      fullName: contact.firstName + ' ' + contact.lastName
    }))
  }
}
