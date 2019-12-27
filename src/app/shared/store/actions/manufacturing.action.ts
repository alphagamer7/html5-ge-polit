import { Action } from '@ngrx/store';
import { ManufacturingActionTypes } from '../types/manufacturing.type';

export class InitializeManufacturingOptions implements Action {
  readonly type = ManufacturingActionTypes.INITIALIZE_MANUFACTURING_OPTIONS;
}

export class GetManufacturingTypes implements Action {
  readonly type = ManufacturingActionTypes.GET_MANUFACTURING_TYPES;
}

export class GetStorageTemperatures implements Action {
  readonly type = ManufacturingActionTypes.GET_STORAGE_TEMPERATURES;
}

export class GetShippingConditions implements Action {
  readonly type = ManufacturingActionTypes.GET_SHIPPING_CONDITIONS;
}

export class GetManufacturingTypeInfo implements Action {
  readonly type = ManufacturingActionTypes.GET_MANUFACTURING_TYPE_INFO;
  constructor(public payload: any) {}
}

export class ResetManufacturingStore implements Action {
  readonly type = ManufacturingActionTypes.RESET_MANUFACRURING_STORE;
}

export class ResetManufacturingChildren implements Action {
  readonly type = ManufacturingActionTypes.RESET_MANUFACRURING_CHILDREN;
}

export class GetManufacturingTypesSuccess implements Action {
  readonly type = ManufacturingActionTypes.GET_MANUFACTURING_TYPES_SUCCESS;

  constructor(public payload: any) {}
}

export class GetManufacturingTypesFailure implements Action {
  readonly type = ManufacturingActionTypes.GET_MANUFACTURING_TYPES_FAILURE;

  constructor(public payload: any) {}
}

export class GetStorageTemperaturesSuccess implements Action {
  readonly type = ManufacturingActionTypes.GET_STORAGE_TEMPERATURES_SUCCESS;

  constructor(public payload: any) {}
}

export class GetStorageTemperaturesFailure implements Action {
  readonly type = ManufacturingActionTypes.GET_STORAGE_TEMPERATURES_FAILURE;

  constructor(public payload: any) {}
}

export class GetShippingConditionsSuccess implements Action {
  readonly type = ManufacturingActionTypes.GET_SHIPPING_CONDITIONS_SUCCESS;

  constructor(public payload: any) {}
}

export class GetShippingConditionsFailure implements Action {
  readonly type = ManufacturingActionTypes.GET_SHIPPING_CONDITIONS_FAILURE;

  constructor(public payload: any) {}
}

export class GetManufacturingTypeInfoSuccess implements Action {
  readonly type = ManufacturingActionTypes.GET_MANUFACTURING_TYPE_INFO_SUCCESS;

  constructor(public payload: any) {}
}

export class GetManufacturingTypeInfoFailure implements Action {
  readonly type = ManufacturingActionTypes.GET_MANUFACTURING_TYPE_INFO_FAILURE;

  constructor(public payload: any) {}
}

export class UpdateModel implements Action {
  readonly type = ManufacturingActionTypes.UPDATE_MANUFACTURING_MODEL;
  constructor(public payload: any) {}
}

export class SetProductType implements Action {
  readonly type = ManufacturingActionTypes.SET_PRODUCT_TYPE;

  constructor(public payload: any) {}
}

export class ClearAppState implements Action {
  readonly type = ManufacturingActionTypes.CLEAR_STATE;
  constructor(public payload: any) {}
}

export class GetDropdownListSuccessManufacturing implements Action {
  readonly type = ManufacturingActionTypes.GET_DROPDOWN_LIST_SUCCESS_MANUFACTURING;
  constructor(public payload: any) {}
}
export class GetDropdownListFailureManufacturing implements Action {
  readonly type = ManufacturingActionTypes.GET_DROPDOWN_LIST_FAILURE_MANUFACTURING;
  constructor(public payload: any) {}
}

export type ManufacturingActions =
  | InitializeManufacturingOptions
  | GetManufacturingTypes
  | GetManufacturingTypesSuccess
  | GetManufacturingTypesFailure
  | GetStorageTemperatures
  | GetStorageTemperaturesSuccess
  | GetStorageTemperaturesFailure
  | GetShippingConditions
  | GetShippingConditionsSuccess
  | GetShippingConditionsFailure
  | GetManufacturingTypeInfo
  | GetManufacturingTypeInfoSuccess
  | GetManufacturingTypeInfoFailure
  | UpdateModel
  | ResetManufacturingStore
  | ResetManufacturingChildren
  | SetProductType
  | ClearAppState
  | GetDropdownListSuccessManufacturing
  | GetDropdownListFailureManufacturing;
