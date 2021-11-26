import { BasketFeedbackView } from 'ish-core/models/basket-feedback/basket-feedback.model';

import { BasketInfo } from './basket-info.model';

export class BasketInfoMapper {
  // tslint:disable-next-line:force-jsdoc-comments
  // minor infos, that should not be displayed at the moment
  static minorInfos = ['basket.line_item.deletion.info', 'basket.validation.camfil.threshold_not_met.info'];

  static fromInfo(payload: { infos: BasketInfo[]; itemId?: string }): BasketInfo[] {
    const { itemId } = payload;
    const infos =
      payload && payload.infos && payload.infos.filter(info => !BasketInfoMapper.minorInfos.includes(info.code));

    return itemId
      ? infos &&
          infos.map(info => ({
            ...info,
            causes:
              info &&
              info.causes &&
              info.causes.map(cause => ({ ...cause, parameters: { ...cause.parameters, lineItemId: itemId } })),
          }))
      : infos;
  }

  static fromFeedback(data: BasketFeedbackView[]): BasketFeedbackView[] {
    if (data?.length) {
      return data.filter(feedback => !BasketInfoMapper.minorInfos.includes(feedback.code));
    }
  }
}
