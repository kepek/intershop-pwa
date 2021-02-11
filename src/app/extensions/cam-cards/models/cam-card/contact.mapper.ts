import { CamCardContact } from './cam-card.model';

export class ContactMapper {
  static fromData(payload: CamCardContact[]): CamCardContact[] {
    return payload.map(ContactMapper.handleFullName);
  }

  static handleFullName(contact: CamCardContact): CamCardContact {
    const { firstName, lastName } = contact;
    return {
      ...contact,
      fullName: `${firstName} ${lastName}`,
    };
  }
}
