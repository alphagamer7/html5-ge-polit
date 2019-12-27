import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { of as observableOf, concat } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { ManufacturingService } from '../../services/component-services/manufacturing.service';

import { GetManufacturingTypeInfoSuccess, GetManufacturingTypeInfoFailure } from '../actions/manufacturing.action';
import { GetDropdownListSuccessManufacturing, GetDropdownListFailureManufacturing } from '../actions/manufacturing.action';
import { ResetDocumentationStore } from '../actions/documentation.action';
import { ResetChildren } from 'src/app/shared/store/actions/navigation.action';

import { ManufacturingActionTypes } from '../types/manufacturing.type';
import { SharedConstants } from 'src/app/shared/constants/shared-constants';

@Injectable()
export class ManufacturingEffects {
  constructor(private actions$: Actions, private manufacturingService: ManufacturingService) {}

  @Effect()
  initializeManufacturingOptions$ = this.actions$.pipe(
    ofType(ManufacturingActionTypes.INITIALIZE_MANUFACTURING_OPTIONS),
    switchMap(() => {
      return concat(
        this.manufacturingService.getManufacturingTypes().pipe(
          map(data => {
            return new GetDropdownListSuccessManufacturing({ data, fieldName: SharedConstants.fieldNames.manufacturingTypes });
          }),
          catchError(error => observableOf(new GetDropdownListFailureManufacturing(error)))
        ),
        this.manufacturingService.getShippingConditions().pipe(
          map(data => {
            return new GetDropdownListSuccessManufacturing({ data, fieldName: SharedConstants.fieldNames.shippingConditions });
          }),
          catchError(error => observableOf(new GetDropdownListFailureManufacturing(error)))
        ),
        this.manufacturingService.getStorageTemperatures().pipe(
          map(data => {
            return new GetDropdownListSuccessManufacturing({ data, fieldName: SharedConstants.fieldNames.storageTemperatures });
          }),
          catchError(error => observableOf(new GetDropdownListFailureManufacturing(error)))
        )
      );
    })
  );

  @Effect()
  getManufacturingTypeInfo$ = this.actions$.pipe(
    ofType(ManufacturingActionTypes.GET_MANUFACTURING_TYPE_INFO),
    switchMap((action: any) => {
      return concat(
        this.manufacturingService.getManufacturingTypeInfo(action.payload.manufacturingTypeId).pipe(
          map(data => {
            return new GetManufacturingTypeInfoSuccess(data);
          }),
          catchError(error => observableOf(new GetManufacturingTypeInfoFailure(error)))
        )
      );
    })
  );

  @Effect()
  resetChildStores$ = this.actions$.pipe(
    ofType(ManufacturingActionTypes.RESET_MANUFACRURING_CHILDREN),
    switchMap(() => [
      new ResetDocumentationStore(),
      new ResetChildren({
        pageType: SharedConstants.pageDetails.manufacturing.path
      })
    ])
  );
}
