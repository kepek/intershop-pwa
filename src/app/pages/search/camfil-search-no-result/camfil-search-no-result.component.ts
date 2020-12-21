import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * The Search No Result Component informs the user that no result has been found for his search and provides an input field for a new search.
 * It uses the {@link SearchBoxContainerComponent}.
 *
 * @example
 * <camfil-search-no-result
 *               [searchTerm]="searchTerm"
 * ></camfil-search-no-result>
 */
@Component({
  selector: 'camfil-search-no-result',
  templateUrl: './camfil-search-no-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilSearchNoResultComponent {
  /**
   * The search term leading to no result.
   */
  @Input() searchTerm: string;
}
