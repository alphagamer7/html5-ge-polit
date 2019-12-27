import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { of as observableOf, concat } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { PackagingService } from '../../services/component-services/packaging.service';

import {
  GetFillVolumeValidRangeSuccess,
  GetFillVolumeValidRangeFailure,
  GetPackagingDropDownOptionsSuccess,
  GetPackagingDropDownOptionsFailure
} from '../actions/packaging.action';
import { ResetChildren } from 'src/app/shared/store/actions/navigation.action';
import { ResetDocumentationStore } from '../actions/documentation.action';
import { ResetManufacturingStore } from '../actions/manufacturing.action';

import { PackagingActionTypes } from '../../store/types/packaging.type';
import { SharedConstants } from 'src/app/shared/constants/shared-constants';

@Injectable()
export class PackagingEffects {
  constructor(private actions$: Actions, private packagingService: PackagingService) {}

  @Effect()
  initializePackagingDetails$ = this.actions$.pipe(
    ofType(PackagingActionTypes.GET_PACKAGING_TYPES),
    switchMap(() => {
      return concat(
        this.packagingService.getPackagingType().pipe(
          map(data => {
            return new GetPackagingDropDownOptionsSuccess({ data, fieldName: SharedConstants.fieldNames.packagingTypes });
          }),
          catchError(error => observableOf(new GetPackagingDropDownOptionsFailure(error)))
        )
      );
    })
  );

  @Effect()
  getPackagingTypeDependentOptions$ = this.actions$.pipe(
    ofType(PackagingActionTypes.GET_PACKAGING_OPTIONS),
    switchMap((action: any) =>
      this.packagingService
        .getPackagingOptions(action.payload.packagingType)
        .pipe(
          map(
            data => new GetPackagingDropDownOptionsSuccess({ data, fieldName: SharedConstants.fieldNames.packagingOptions }),
            catchError(error => observableOf(new GetPackagingDropDownOptionsFailure(error)))
          )
        )
    )
  );

  @Effect()
  getPackagingOptionDependentOptions$ = this.actions$.pipe(
    ofType(PackagingActionTypes.GET_OUTER_PACKAGINGS),
    switchMap((action: any) =>
      this.packagingService
        .getOuterPackages(action.payload.packagingOption)
        .pipe(
          map(
            data => new GetPackagingDropDownOptionsSuccess({ data, fieldName: SharedConstants.fieldNames.outerPackagings }),
            catchError(error => observableOf(new GetPackagingDropDownOptionsFailure(error)))
          )
        )
    )
  );

  @Effect()
  getFillVolumeValidRange$ = this.actions$.pipe(
    ofType(PackagingActionTypes.GET_FILL_VOLUME_VALID_RANGE),
    switchMap((action: any) =>
      this.packagingService.getFillVolumeRange(action.payload.outerPackaging).pipe(
        map(data => new GetFillVolumeValidRangeSuccess(data)),
        catchError(error => observableOf(new GetFillVolumeValidRangeFailure(error)))
      )
    )
  );

  @Effect()
  resetChildStores$ = this.actions$.pipe(
    ofType(PackagingActionTypes.RESET_PACKAGING_CHILDREN),
    switchMap(() => [
      // new ResetDocumentationStore(),
      // new ResetManufacturingStore(),
      new ResetChildren({
        pageType: SharedConstants.pageDetails.packaging.path
      })
    ])
  );
}
