import { CamRequisitionStatusValues } from './camfil-requisition-status-values';
import { CamfilRequisitionApproval } from './camfil-requisition.model';

export class CamfilRequisitionHelper {
  static getIsCamfilRequisitionEditable(requisitionApproval: CamfilRequisitionApproval) {
    const { statusCode } = requisitionApproval || {};
    return (
      statusCode === CamRequisitionStatusValues.Pending || statusCode === CamRequisitionStatusValues.PartlyApproved
    );
  }

  static getIsCamfilRequisitionApproved(requisitionApproval: CamfilRequisitionApproval) {
    const { statusCode } = requisitionApproval || {};
    return statusCode === CamRequisitionStatusValues.Approved;
  }

  static getIsCamfilRequisitionRejected(requisitionApproval: CamfilRequisitionApproval) {
    const { statusCode } = requisitionApproval || {};
    return statusCode === CamRequisitionStatusValues.Rejected;
  }
}
