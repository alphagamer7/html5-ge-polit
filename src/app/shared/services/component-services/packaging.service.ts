import { Injectable } from '@angular/core';

import { Observable, Observer, BehaviorSubject, Subject } from 'rxjs';

import { Store, select } from '@ngrx/store';

import * as _ from 'lodash';

import * as fromWizardState from '../../store/reducers/reducer';

import { CrmDatabaseService } from '../crm-database.service';

import { CNSelectOption } from 'src/app/shared/types/crm-input.type';
import { PackagingOption } from 'src/app/shared/types/packaging-option.type';
import { PackagingType } from 'src/app/shared/types/packaging-type.type';
import { OuterPackaging } from 'src/app/shared/types/outer-packaging.type';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';

@Injectable()
export class PackagingService {
  productType: string;

  constructor(private crmDatabaseService: CrmDatabaseService, private store: Store<fromWizardState.WizardState>) {
    this.store.pipe(select(fromWizardState.getProductType)).subscribe(value => {
      this.productType = value;
    });
  }

  getPackagingOptions(packagingTypeId: string): Observable<CNSelectOption[]> {
    return new Observable(observer => {
      this.crmDatabaseService
        .fetchData(SharedConstants.tableType.packagingOption, [
          {
            name: SharedConstants.tableRelatedColumnNames.packagingTypeId,
            value: packagingTypeId
          }
        ])
        .subscribe(
          response => {
            let options: CNSelectOption[] = [];
            if (response && response.length) {
              options = response.map((result: PackagingOption, index: number) => {
                return {
                  index: result.id,
                  label: result.name,
                  value: result.name
                };
              });
            }
            observer.next(options);
            observer.complete();
          },
          err => {
            console.log(err, 'read packagingOption error');
            observer.error(err);
            observer.complete();
          }
        );
    });
  }

  getPackagingType(): Observable<CNSelectOption[]> {
    return new Observable(observer => {
      this.crmDatabaseService
        .fetchData(SharedConstants.tableType.packagingType, [
          {
            name: SharedConstants.tableRelatedColumnNames.productType,
            value: this.productType
          }
        ])
        .subscribe(
          response => {
            let options: CNSelectOption[] = [];
            if (response && response.length) {
              options = response.map((result: PackagingType, index: number) => {
                return {
                  index: result.id,
                  label: result.name,
                  value: result.name
                };
              });
            }
            observer.next(options);
            observer.complete();
          },
          err => {
            console.log(err, 'read packagingType error');
            observer.error(err);
            observer.complete();
          }
        );
    });
  }

  getOuterPackages(packagingOptionId: string): Observable<CNSelectOption[]> {
    return new Observable(observer => {
      this.crmDatabaseService
        .fetchData(SharedConstants.tableType.outerPackaging, [
          {
            name: SharedConstants.tableRelatedColumnNames.packagingOptionId,
            value: packagingOptionId
          }
        ])
        .subscribe(
          response => {
            let options: CNSelectOption[] = [];
            if (response && response.length) {
              options = response.map((result: OuterPackaging, index: number) => {
                return {
                  index: result.id,
                  label: result.name,
                  value: result.name
                };
              });
            }
            observer.next(options);
            observer.complete();
          },
          err => {
            console.log(err, 'read outerPackaging error');
            observer.error(err);
            observer.complete();
          }
        );
    });
  }

  getFillVolumeRange(outerPackagingId: string): Observable<any> {
    return new Observable(observer => {
      this.crmDatabaseService
        .fetchData(SharedConstants.tableType.outerPackaging, [
          {
            name: SharedConstants.tableRelatedColumnNames.id,
            value: outerPackagingId
          }
        ])
        .subscribe(
          response => {
            let ranges = [];
            if (response && response.length) {
              ranges = response[0].ranges.split(';');
            }
            observer.next(ranges);
            observer.complete();
          },
          err => {
            console.log(err, 'read fill volume range error');
            observer.error(err);
            observer.complete();
          }
        );
    });
  }
}
