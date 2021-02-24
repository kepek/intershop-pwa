import { Injectable } from '@angular/core';

import { TrackAndTrace } from './trackAndTrace.interface';

@Injectable({ providedIn: 'root' })
export class TrackAndTracesMapper {
  static fromData(trackAndTraceData: TrackAndTrace): TrackAndTrace {
    if (trackAndTraceData) {
      return {
        name: trackAndTraceData.name,
        id: trackAndTraceData.id,
        ownerId: trackAndTraceData.ownerId,
        linkText: trackAndTraceData.linkText,
        link: trackAndTraceData.link,
      };
    }
  }
}
