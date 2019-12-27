import { Action } from '@ngrx/store';
import { FormulationActionTypes } from '../types/formulation.type';

export class GetChemicalFormulations implements Action {
  readonly type = FormulationActionTypes.GET_CHEMICAL_FORMULATIONS;
  constructor(public payload: any) {}
}

export class FilterChemicalFormulations implements Action {
  readonly type = FormulationActionTypes.FILTER_CHEMICAL_FORMULATIONS;
  constructor(public payload: any) {}
}

export class FilterChemicalFormulationsSuccess implements Action {
  readonly type = FormulationActionTypes.FILTER_CHEMICAL_FORMULATIONS_SUCCESS;
  constructor(public payload: any) {}
}

export class FilterChemicalFormulationsFailure implements Action {
  readonly type = FormulationActionTypes.FILTER_CHEMICAL_FORMULATIONS_FAILURE;
  constructor(public payload: any) {}
}

export class ClearFilterChemicalFormulations implements Action {
  readonly type = FormulationActionTypes.CLEAR_FILTER_CHEMICAL_FORMULATIONS;
  constructor() {}
}

export class UpdateSelectedFormulations implements Action {
  readonly type = FormulationActionTypes.UPDATE_SELECTED_FORMULATIONS;
  constructor(public payload: any) {}
}

export class SetProductName implements Action {
  readonly type = FormulationActionTypes.SET_PRODUCT_NAME;
  constructor(public payload: any) {}
}

export class UpdateModel implements Action {
  readonly type = FormulationActionTypes.UPDATE_FORMULATION_MODEL;
  constructor(public payload: any) {}
}

export class UpdateFormulationItemDetails implements Action {
  readonly type = FormulationActionTypes.UPDATE_FORMULATION_ITEM_DETAILS;
  constructor(public payload: any) {}
}

export class UpdateQualityControlTests implements Action {
  readonly type = FormulationActionTypes.UPDATE_QUALITY_CONTROL_TESTS;
  constructor(public payload: any) {}
}

export class DeleteFormulationItem implements Action {
  readonly type = FormulationActionTypes.DELETE_FORMULATION_ITEM;
  constructor(public payload: any) {}
}

export class GetQualityControlTests implements Action {
  readonly type = FormulationActionTypes.GET_QUALITY_CONTROL_TESTS;
  constructor(public payload: any) {}
}

export class ResetFormulationStore implements Action {
  readonly type = FormulationActionTypes.RESET_FORMULATION_STORE;
}

export class SetProductType implements Action {
  readonly type = FormulationActionTypes.SET_PRODUCT_TYPE;

  constructor(public payload: any) {}
}

export class ClearAppState implements Action {
  readonly type = FormulationActionTypes.CLEAR_STATE;
  constructor(public payload: any) {}
}

export class GetDropdownListSuccessFormulation implements Action {
  readonly type = FormulationActionTypes.GET_DROPDOWN_LIST_SUCCESS_FORMULATION;
  constructor(public payload: any) {}
}
export class GetDropdownListFailureFormulation implements Action {
  readonly type = FormulationActionTypes.GET_DROPDOWN_LIST_FAILURE_FORMULATION;
  constructor(public payload: any) {}
}

export class ResetRestriciton implements Action {
  readonly type = FormulationActionTypes.RESET_RESTRICTION;
  constructor() {}
}

export type FormulationActions =
  | GetChemicalFormulations
  | FilterChemicalFormulations
  | FilterChemicalFormulationsSuccess
  | FilterChemicalFormulationsFailure
  | ClearFilterChemicalFormulations
  | UpdateSelectedFormulations
  | UpdateModel
  | UpdateFormulationItemDetails
  | DeleteFormulationItem
  | SetProductName
  | GetQualityControlTests
  | ResetFormulationStore
  | UpdateQualityControlTests
  | SetProductType
  | ClearAppState
  | GetDropdownListSuccessFormulation
  | GetDropdownListFailureFormulation
  | ResetRestriciton;
