import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import * as _ from 'lodash';

import { CrmDatabaseService } from '../crm-database.service';
import { CNSelectOption } from 'src/app/shared/types/crm-input.type';
import { ProductApplicationDetails } from 'src/app/shared/types/product-application.type';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';

@Injectable()
export class GeneralInformationService {
  constructor(private crmDatabaseService: CrmDatabaseService) {}

  getProductApplications(): Observable<CNSelectOption[]> {
    return new Observable(observer => {
      this.crmDatabaseService.fetchData(SharedConstants.tableType.productApplication).subscribe(
        response => {
          let options: CNSelectOption[] = [];
          if (response && response.length) {
            options = response.map((result: ProductApplicationDetails, index: number) => {
              return {
                index: index,
                label: result.name,
                value: result.name
              };
            });
          }
          observer.next(options);
          observer.complete();
        },
        err => {
          console.log(err, 'read productApplication error');
          observer.error(err);
          observer.complete();
        }
      );
    });
  }
}
