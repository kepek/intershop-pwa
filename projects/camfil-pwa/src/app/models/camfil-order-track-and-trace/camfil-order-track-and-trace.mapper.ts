import { Injectable } from '@angular/core';

import { TrackAndTraceData } from './camfil-order-track-and-trace.interface';
import { CamfilOrderTrackAndTrace } from './camfil-order-track-and-trace.model';

@Injectable({ providedIn: 'root' })
export class CamfilOrderTrackAndTraceMapper {
  static fromData(trackAndTraceData: TrackAndTraceData): CamfilOrderTrackAndTrace {
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
