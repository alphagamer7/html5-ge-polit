import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';

import { of as observableOf, concat } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { GeneralInformationService } from '../../services/component-services/general-information.service';

import { GetProductApplicationsSuccess, GetProductApplicationsFailure, ResetGeneralInformationChildren } from '../actions/general-inforation.action';
import { ResetManufacturingStore } from '../actions/manufacturing.action';
import { ResetDocumentationStore } from '../actions/documentation.action';
import { ResetPackagingStore } from '../actions/packaging.action';
import { ResetChildren } from 'src/app/shared/store/actions/navigation.action';
import { ResetFormulationStore } from '../actions/formulation-and-control.action';

import { GeneralInformationActionTypes } from '../types/general.type';
import { SharedConstants } from 'src/app/shared/constants/shared-constants';
import { CommonActionTypes } from 'src/app/shared/constants/shared-enum';

@Injectable()
export class GeneralInformationEffects {
  constructor(private actions$: Actions, private generalInformationService: GeneralInformationService) {}

  @Effect()
  resetChildStores$ = this.actions$.pipe(
    ofType(GeneralInformationActionTypes.RESET_GENERAL_INFORMATION_CHILDREN),
    switchMap(() => [
      new ResetDocumentationStore(),
      new ResetManufacturingStore(),
      new ResetPackagingStore(),
      new ResetFormulationStore(),
      new ResetChildren({ pageType: SharedConstants.pageDetails.general.path })
    ])
  );

  @Effect()
  updateProductTypeForChildren$ = this.actions$.pipe(
    ofType(GeneralInformationActionTypes.UPDTAE_PRODUCT_TYPE_FOR_CHILDREN),
    switchMap((action: any) => {
      return concat(
        this.generalInformationService.getProductApplications().pipe(
          map(data => new GetProductApplicationsSuccess(data)),
          catchError(error => observableOf(new GetProductApplicationsFailure(error)))
        ),
        observableOf(new ResetGeneralInformationChildren()),
        observableOf({
          type: CommonActionTypes.SET_PRODUCT_TYPE,
          payload: { productType: action.payload.productType }
        })
      );
    })
  );
}
