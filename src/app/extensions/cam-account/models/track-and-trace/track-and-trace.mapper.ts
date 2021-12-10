import { Injectable } from '@angular/core';

import { TrackAndTraceData } from './track-and-trace.interface';
import { TrackAndTrace } from './track-and-trace.model';

@Injectable({ providedIn: 'root' })
export class TrackAndTracesMapper {
  static fromData(trackAndTraceData: TrackAndTraceData): TrackAndTrace {
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
