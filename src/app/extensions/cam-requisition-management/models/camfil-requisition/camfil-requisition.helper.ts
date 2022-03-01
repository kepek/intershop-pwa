import { CamfilRequisitionApproval } from './camfil-requisition.model';

export class CamfilRequisitionHelper {
  static getIsCamfilRequisitionEditable(requisitionApproval: CamfilRequisitionApproval) {
    const { statusCode } = requisitionApproval || {};
    return statusCode === 'PENDING';
  }
}
