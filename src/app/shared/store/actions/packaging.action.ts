import { Action } from '@ngrx/store';

import { PackagingActionTypes } from '../types/packaging.type';

export class GetPackagingDropDownOptionsSuccess implements Action {
  readonly type = PackagingActionTypes.GET_PACKAGING_DROPDOWN_OPTIONS_SUCCESS;
  constructor(public payload: any) {}
}

export class GetPackagingDropDownOptionsFailure implements Action {
  readonly type = PackagingActionTypes.GET_PACKAGING_DROPDOWN_OPTIONS_FAILURE;

  constructor(public payload: any) {}
}

export class GetPackagingTypes implements Action {
  readonly type = PackagingActionTypes.GET_PACKAGING_TYPES;
}

export class GetPackagingOptions implements Action {
  readonly type = PackagingActionTypes.GET_PACKAGING_OPTIONS;

  constructor(public payload: any) {}
}

export class GetOuterPackagings implements Action {
  readonly type = PackagingActionTypes.GET_OUTER_PACKAGINGS;

  constructor(public payload: any) {}
}

export class GetFillVolumeValidRange implements Action {
  readonly type = PackagingActionTypes.GET_FILL_VOLUME_VALID_RANGE;

  constructor(public payload: any) {}
}

export class GetFillVolumeValidRangeSuccess implements Action {
  readonly type = PackagingActionTypes.GET_FILL_VOLUME_VALID_RANGE_SUCCESS;

  constructor(public payload: any) {}
}

export class GetFillVolumeValidRangeFailure implements Action {
  readonly type = PackagingActionTypes.GET_FILL_VOLUME_VALID_RANGE_FAILURE;

  constructor(public payload: any) {}
}

export class UpdateModel implements Action {
  readonly type = PackagingActionTypes.UPDATE_PACKAGING_MODEL;
  constructor(public payload: any) {}
}

export class AddNumberPackage implements Action {
  readonly type = PackagingActionTypes.ADD_NEW_PACKAGE;
}

export class ResetPackagingStore implements Action {
  readonly type = PackagingActionTypes.RESET_PACKAGING_STORE;
}

export class ResetPackagingStoreBasedOnConcentration implements Action {
  readonly type = PackagingActionTypes.RESET_PACKAGING_STORE_BASED_ON_CONCENTRATION;
}

export class ResetPackagingChildren implements Action {
  readonly type = PackagingActionTypes.RESET_PACKAGING_CHILDREN;
}

export class SetProductType implements Action {
  readonly type = PackagingActionTypes.SET_PRODUCT_TYPE;

  constructor(public payload: any) {}
}

export class ClearAppState implements Action {
  readonly type = PackagingActionTypes.CLEAR_STATE;
  constructor(public payload: any) {}
}

export type PackagingActions =
  | GetPackagingDropDownOptionsSuccess
  | GetPackagingDropDownOptionsFailure
  | GetPackagingTypes
  | GetPackagingOptions
  | GetOuterPackagings
  | UpdateModel
  | AddNumberPackage
  | ResetPackagingStore
  | ResetPackagingChildren
  | SetProductType
  | GetFillVolumeValidRange
  | GetFillVolumeValidRangeSuccess
  | GetFillVolumeValidRangeFailure
  | ClearAppState
  | ResetPackagingStoreBasedOnConcentration;
