import { Injectable } from '@angular/core';

import { Observable, from } from 'rxjs';
import { SQLService } from '@comparenetworks/imsmart-web';
import { SharedConstants } from '../constants/shared-constants';

/**
 * for where queries
 */
export interface FilterSet {
  name: string;
  value?: string;
  condition?: string;
}

/**
 * for like queries
 */
export interface LikeFilterSet {
  name: string;
  value: string;
}

@Injectable()
export class CrmDatabaseService {
  constructor(private sqlService: SQLService) {}

  /**
   * read values from database
   * @param type table that need to be query
   * @param filters exact match
   * @param likeFilters like match
   * @param selectColumnName columns that need to be return
   */
  fetchData(type: string, filters: FilterSet[] = [], likeFilters: LikeFilterSet[] = [], selectColumnName?: string): Observable<any> {
    return new Observable(observer => {
      const query = `SELECT ${selectColumnName ? selectColumnName : '*'} FROM ${type} ${
        filters.length > 0
          ? 'WHERE ' +
            filters
              .map(filter => {
                if (filter.condition) {
                  return `${filter.name} ${filter.condition === SharedConstants.filterConditions.notNullCheck ? ' IS NOT NULL ' : ''}`;
                } else {
                  return `${filter.name} = '${filter.value}'`;
                }
              })
              .join('AND\n')
          : ''
      } ${
        filters.length === 0 && likeFilters.length > 0
          ? 'WHERE ' +
            likeFilters
              .map(filter => {
                return `${filter.name} LIKE '${filter.value}%'`;
              })
              .join('AND\n')
          : likeFilters.length > 0
          ? 'AND ' +
            likeFilters
              .map(filter => {
                return `${filter.name} LIKE '${filter.value}%'`;
              })
              .join(' AND\n')
          : ''
      }`;
      console.log(query);

      this.sqlService.runSQL(query, true).then(res => {
        observer.next(res);
        observer.complete();
      });
    });
  }

  /**
   * get data based on full text search
   * @param objectName table name
   * @param searchString search input
   * @param filters for where clause - exact match
   * @param searchColumns columns that need to be considered for select statement
   * @param matchColumns for match statement
   * @param likeFilters for like clause
   * @param offset for pagination
   * @param limit for pagination
   */
  searchRecords(
    objectName: string,
    searchString: string,
    filters: FilterSet[] = [],
    searchColumns: string[] = [],
    matchColumns: string[] = [],
    likeFilters: LikeFilterSet[] = [],
    offset?: number,
    limit?: number
  ): Observable<any> {
    // fts5 throw exception for strings with special characters. need to escape them by wrapping in double quotes
    const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    searchString = format.test(searchString) ? '"' + searchString + '"' : searchString;

    // generate string for match statement (multiple columns same input)
    const matchString =
      matchColumns.length > 0 && searchString && searchString !== ''
        ? `'{` + matchColumns.join(' ') + `} : ${searchString}*'`
        : searchString
        ? `'${searchString}*'`
        : `''`;

    // columns that need to be returned in select statement
    const searchColumnsFormattedString = searchColumns.length > 0 ? searchColumns.map(column => `${objectName}.${column}`).join(',') : '*';

    // initialize query for full text search
    const whereClause = matchString === `''` ? '' : `WHERE ${objectName}_search MATCH ${matchString}`;

    // query for like statement
    const likeClause =
      likeFilters.length > 0
        ? 'AND ' +
          likeFilters
            .map(filter => {
              return `${objectName}.${filter.name} LIKE '${filter.value}%'`;
            })
            .join(' AND\n')
        : '';

    const search = ` SELECT ${searchColumnsFormattedString} FROM ${objectName}
        INNER JOIN ${objectName}_search
        ON ${objectName}.id = ${objectName}_search.rowid
        ${whereClause}
        ${
          filters.length > 0
            ? `${whereClause !== '' ? 'AND ' : 'WHERE '}` +
              filters
                .map(filter => {
                  if (filter.condition) {
                    return `${objectName}.${filter.name} ${filter.condition === SharedConstants.filterConditions.notNullCheck ? ' IS NOT NULL ' : ''}`;
                  } else {
                    return `${filter.value !== '' ? `${objectName}.${filter.name} = '${filter.value}'` : ''}`;
                  }
                })
                .join(' AND\n')
            : ''
        }
 ${likeFilters.length > 0 ? `${filters.length > 0 ? ' ' : `${whereClause !== '' ? 'AND ' : 'WHERE '}`}` + `${likeClause}` : ''}


        ORDER BY rank
         ${limit ? `LIMIT  ${limit} ` : ''}
         ${offset ? `OFFSET ${offset}` : ''};`;

    console.log(search);

    return from(this.sqlService.runSQL(search));
  }
}
