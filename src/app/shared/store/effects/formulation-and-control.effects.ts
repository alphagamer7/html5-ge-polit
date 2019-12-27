import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { FormulationActionTypes } from '../types/formulation.type';

import { of as observableOf } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import {
  FilterChemicalFormulationsSuccess,
  FilterChemicalFormulationsFailure,
  GetDropdownListSuccessFormulation,
  GetDropdownListFailureFormulation
} from '../actions/formulation-and-control.action';
import { FormulationService } from '../../services/component-services/formulation-and-control.service';
import { SharedConstants } from '../../constants/shared-constants';

@Injectable()
export class FormulationEffects {
  constructor(private actions$: Actions, private formulationService: FormulationService) {}

  @Effect()
  getChemicalFormulations$ = this.actions$.pipe(
    ofType(FormulationActionTypes.GET_CHEMICAL_FORMULATIONS),
    switchMap((action: any) => {
      return this.formulationService.getFormulations(action.payload.category, action.payload.searchInput).pipe(
        map(
          data =>
            new GetDropdownListSuccessFormulation({
              data,
              fieldName: SharedConstants.fieldNames.formulations
            }),
          catchError(error => observableOf(new GetDropdownListFailureFormulation(error)))
        )
      );
    })
  );

  @Effect()
  filterChemicalFormulations$ = this.actions$.pipe(
    ofType(FormulationActionTypes.FILTER_CHEMICAL_FORMULATIONS),
    switchMap((action: any) => {
      return this.formulationService
        .filterFormulations(action.payload.filter, action.payload.filterOptions, action.payload.limit, action.payload.offset)
        .pipe(map(data => new FilterChemicalFormulationsSuccess(data), catchError(error => observableOf(new FilterChemicalFormulationsFailure(error)))));
    })
  );

  @Effect()
  getQualityControlTests$ = this.actions$.pipe(
    ofType(FormulationActionTypes.GET_QUALITY_CONTROL_TESTS),
    switchMap((action: any) => {
      return this.formulationService
        .getQualityControlTestsFromDB()
        .pipe(
          map(
            data => new GetDropdownListSuccessFormulation({ data, fieldName: SharedConstants.fieldNames.qualityControlTestOptions }),
            catchError(error => observableOf(new GetDropdownListFailureFormulation(error)))
          )
        );
    })
  );
}
