import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { Observable, Subject } from 'rxjs';

import * as _ from 'lodash';

import { CNSelectOption } from '@comparenetworks/imsmart-web';

import { CrmDatabaseService, LikeFilterSet } from 'src/app/shared/services/crm-database.service';

import * as fromWizardState from '../../store/reducers/reducer';

import { ChemicalFormulationDetails } from 'src/app/shared/types/chemical-formulation.type';

import { FilterCategory, ProductType } from 'src/app/shared/constants/shared-enum';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';
import { takeUntil } from 'rxjs-compat/operator/takeUntil';
import { QualityControlTest } from '../../types/quality-control-test.type';

@Injectable()
export class FormulationService {
  // updateQualityControlTest(selectedQualityControl: QualityControlTest[]): any {
  //   throw new Error('Method not implemented.');
  // }
  productType: string;

  constructor(private crmDatabaseService: CrmDatabaseService, private store: Store<fromWizardState.WizardState>) {
    this.store.pipe(select(fromWizardState.getProductType)).subscribe(value => {
      this.productType = value;
    });
  }

  /**
   * for dropdown list
   * @param category
   * @param searchInput
   */
  getFormulations(category: string, searchInput: string): Observable<ChemicalFormulationDetails[]> {
    return new Observable(observer => {
      const filterSet = [];
      if (category !== FilterCategory.allCategories) {
        filterSet.push({
          name: category,
          value: '',
          condition: SharedConstants.filterConditions.notNullCheck
        });
      }

      // for products which doesn't have a product type is assumed to exist in both forms
      filterSet.push({
        name:
          this.productType === _.keys(ProductType)[0]
            ? SharedConstants.tableRelatedColumnNames.isLiquidFormAvailable
            : SharedConstants.tableRelatedColumnNames.isPowderFormAvailable,
        value: '1'
      });

      this.crmDatabaseService
        .searchRecords(
          SharedConstants.tableType.chemical,
          searchInput,
          filterSet,
          [],
          category === FilterCategory.allCategories ? [] : [category]
        )
        .subscribe(
          response => {
            observer.next(response && response.length > 0 ? response[0].result : []);
            observer.complete();
          },
          err => {
            console.log(err, 'read formulations error');
            observer.error(err);
            observer.complete();
          }
        );
    });
  }

  /**
   * for search modal
   * @param filter
   * @param filterOptions
   * @param limit
   * @param offset
   */
  filterFormulations(filter?: string, filterOptions: LikeFilterSet[] = [], limit?: number, offset?: number): Observable<CNSelectOption[]> {
    return new Observable(observer => {
      this.crmDatabaseService
        .searchRecords(
          SharedConstants.tableType.chemical,
          filter,
          [
            {
              name: SharedConstants.tableRelatedColumnNames.isAllowed,
              value: '1'
            },
            {
              name:
                this.productType === _.keys(ProductType)[0]
                  ? SharedConstants.tableRelatedColumnNames.isLiquidFormAvailable
                  : SharedConstants.tableRelatedColumnNames.isPowderFormAvailable,
              value: '1'
            }
          ],
          [],
          [],
          [...filterOptions.filter(condition => condition != null)],
          offset,
          limit
        )
        .subscribe(
          response => {
            if (response && response.length) {
              observer.next(response[0].result);
              observer.complete();
            } else {
              observer.next([]);
              observer.complete();
            }
          },
          err => {
            console.log(err, 'filter formulations error');
            observer.error(err);
            observer.complete();
          }
        );
    });
  }

  getQualityControlTestsFromDB(): Observable<CNSelectOption[]> {
    return new Observable(observer => {
      this.crmDatabaseService.fetchData(SharedConstants.tableType.qualityControlTest).subscribe(
        response => {
          console.log(JSON.stringify(response));

          let options: CNSelectOption[] = [];
          if (response && response.length) {
            options = response.map((result: any, index: number) => {
              return {
                qualityControlTest: result.name
              };
            });
          }
          observer.next(options);
          observer.complete();
        },
        err => {
          console.log(err, 'read getQualityControlTests error');
          observer.error(err);
          observer.complete();
        }
      );
    });
  }
}
