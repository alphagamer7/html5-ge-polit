import { Injectable } from '@angular/core';

import { Observable, Observer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { CNSelectOption } from '@comparenetworks/imsmart-web';

import * as fromWizardState from '../../store/reducers/reducer';
import { InitializeManufacturingOptions } from '../../store/actions/manufacturing.action';

import { ManufacturingTypeDetails } from '../../types/manufacturing-type.type';
import { StorageTemperature } from 'src/app/shared/types/storage-temperature.type';
import { ShippingCondition } from '../../types/shipping-condition.type';

import { CrmDatabaseService } from '../crm-database.service';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';

@Injectable()
export class ManufacturingService {
  productType: string;

  constructor(private crmDatabaseService: CrmDatabaseService, private store: Store<fromWizardState.WizardState>) {
    this.store.pipe(select(fromWizardState.getProductType)).subscribe(value => {
      if (this.productType !== value && value.length) {
        this.productType = value;
      }
    });
  }

  getManufacturingTypes(): Observable<CNSelectOption[]> {
    return new Observable(observer => {
      this.crmDatabaseService
        .fetchData(SharedConstants.tableType.manufacturingType, [
          { name: SharedConstants.tableRelatedColumnNames.productType, value: this.productType }
        ])
        .subscribe(
          response => {
            let options: CNSelectOption[] = [];
            if (response && response.length) {
              options = response.map((result: ManufacturingTypeDetails, index: number) => {
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
            console.log(err, 'read manufacturingType error');
            observer.error(err);
            observer.complete();
          }
        );
    });
  }

  getStorageTemperatures(): Observable<CNSelectOption[]> {
    return new Observable(observer => {
      this.crmDatabaseService.fetchData(SharedConstants.tableType.storageTemperature).subscribe(
        response => {
          let options: CNSelectOption[] = [];
          if (response && response.length) {
            options = response.map((result: StorageTemperature, index: number) => {
              return {
                index: result.id,
                label: result.temperatureDescription,
                value: result.temperatureDescription
              };
            });
          }
          observer.next(options);
          observer.complete();
        },
        err => {
          console.log(err, 'read storageTemperature error');
          observer.error(err);
          observer.complete();
        }
      );
    });
  }

  getShippingConditions(): Observable<CNSelectOption[]> {
    return new Observable(observer => {
      this.crmDatabaseService.fetchData(SharedConstants.tableType.shippingCondition).subscribe(
        response => {
          let options: CNSelectOption[] = [];
          if (response && response.length) {
            options = response.map((result: ShippingCondition, index: number) => {
              return {
                index: result.id,
                label: result.condition,
                value: result.condition
              };
            });
          }
          observer.next(options);
          observer.complete();
        },
        err => {
          console.log(err, 'read shippingCondition error');
          observer.error(err);
          observer.complete();
        }
      );
    });
  }

  getManufacturingTypeInfo(manufacturingTypeId: number): Observable<CNSelectOption[]> {
    return new Observable(observer => {
      this.crmDatabaseService
        .fetchData(SharedConstants.tableType.manufacturingType, [
          {
            name: 'id',
            value: manufacturingTypeId.toString()
          }
        ])
        .subscribe(
          response => {
            observer.next(response[0].description);
            observer.complete();
          },
          err => {
            console.log(err, 'read manufacturingType info error');
            observer.error(err);
            observer.complete();
          }
        );
    });
  }
}
