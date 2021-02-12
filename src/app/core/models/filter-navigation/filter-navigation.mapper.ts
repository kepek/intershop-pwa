import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { FacetData } from 'ish-core/models/facet/facet.interface';
import { FilterData } from 'ish-core/models/filter/filter.interface';
import { getICMStaticURL } from 'ish-core/store/core/configuration';
import { stringToFormParams } from 'ish-core/utils/url-form-params';

import { FilterNavigationData } from './filter-navigation.interface';
import { FilterNavigation } from './filter-navigation.model';

@Injectable({ providedIn: 'root' })
export class FilterNavigationMapper {
  constructor(store: Store) {
    store.pipe(select(getICMStaticURL)).subscribe(url => (this.icmStaticURL = url));
  }

  private icmStaticURL: string;

  /**
   * parseFilterDisplayName
   *
   * Due to SOLR configuration we're formatting the `from-to` values to be language agnostic.
   *
   * @param displayName
   * @param valuesSeparator
   * @param replaceSeparator
   *
   * @example
   * [590 TO 610] => [590 - 610]
   */
  static parseFilterDisplayName(
    displayName: string,
    valuesSeparator: string = '-',
    replaceSeparator: string = 'TO'
  ): string {
    if (!displayName?.length) {
      return '';
    }

    const regexp = new RegExp(`([0-9]{1,9})(${replaceSeparator})([0-9]{1,9})`, 'gis');

    const rawDisplayName = displayName.replace(/\s/g, '');

    if (!rawDisplayName.match(regexp)?.length) {
      return rawDisplayName;
    }

    const formattedDisplayName = [...rawDisplayName.matchAll(regexp)]
      .pop()
      .splice(1, 4)
      .filter(x => x !== replaceSeparator)
      .join(valuesSeparator);

    return `[${formattedDisplayName}]`;
  }

  fromData(data: FilterNavigationData): FilterNavigation {
    return {
      filter:
        data && data.elements
          ? data.elements.map(filterData => ({
              id: filterData.id,
              name: filterData.name,
              displayType: filterData.displayType,
              limitCount: filterData.limitCount || -1,
              facets: this.mapFacetData(filterData),
              selectionType: filterData.selectionType || 'single',
            }))
          : [],
    };
  }

  /**
   * parse ish-link to
   */
  private parseFilterValue(filterEntry: FacetData): string {
    if (filterEntry.mappedType === 'image' && filterEntry.mappedValue) {
      const urlParts = filterEntry.mappedValue.split(':');
      return `url(${this.icmStaticURL}/${urlParts[0]}/-${urlParts[1]})`;
    }
    return filterEntry.mappedValue;
  }

  private mapFacetData(filterData: FilterData) {
    return filterData.filterEntries
      ? filterData.filterEntries.reduce((acc, facet) => {
          const category = facet.link.uri.includes('/categories/')
            ? [facet.link.uri.split('/productfilters')[0].split('/categories/')[1]]
            : undefined;
          if (facet.name !== 'Show all') {
            acc.push({
              name: facet.name,
              count: facet.count,
              selected: facet.selected,
              displayName: FilterNavigationMapper.parseFilterDisplayName(facet.displayValue) || undefined,
              searchParameter: {
                ...stringToFormParams(facet.link.uri.split('?')[1] || ''),
                category,
              },
              level: facet.level || 0,
              mappedValue: this.parseFilterValue(facet),
              mappedType: facet.mappedType || undefined,
            });
          } else {
            console.warn(`Limiting filters is not supported. Set limit to -1 in the BackOffice (${filterData.name})`);
          }
          return acc;
        }, [])
      : [];
  }
}
