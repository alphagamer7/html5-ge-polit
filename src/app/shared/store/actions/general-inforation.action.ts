import { Action } from '@ngrx/store';
import { GeneralInformationActionTypes } from '../types/general.type';

export class GetProductApplications implements Action {
  readonly type = GeneralInformationActionTypes.GET_PRODUCT_APPLICATIONS;
}

export class GetProductApplicationsSuccess implements Action {
  readonly type = GeneralInformationActionTypes.GET_PRODUCT_APPLICATIONS_SUCCESS;

  constructor(public payload: any) {}
}

export class GetProductApplicationsFailure implements Action {
  readonly type = GeneralInformationActionTypes.GET_PRODUCT_APPLICATIONS_FAILURE;

  constructor(public payload: any) {}
}

export class UpdateModel implements Action {
  readonly type = GeneralInformationActionTypes.UPDATE_GENERAL_INFORMATION_MODEL;
  constructor(public payload: any) {}
}

export class ResetGeneralInformationChildren implements Action {
  readonly type = GeneralInformationActionTypes.RESET_GENERAL_INFORMATION_CHILDREN;
}

export class UpdateProductTypeForChildren implements Action {
  readonly type = GeneralInformationActionTypes.UPDTAE_PRODUCT_TYPE_FOR_CHILDREN;

  constructor(public payload: any) {}
}

export class SetProductType implements Action {
  readonly type = GeneralInformationActionTypes.SET_PRODUCT_TYPE;
  constructor(public payload: any) {}
}

export class ClearAppState implements Action {
  readonly type = GeneralInformationActionTypes.CLEAR_STATE;
  constructor(public payload: any) {}
}

export class SetSubscriptionStatus implements Action {
  readonly type = GeneralInformationActionTypes.SET_SUBSCRIPTION_STATUS;
}

export class GetInitialState implements Action {
  readonly type = GeneralInformationActionTypes.GET_INITIAL_STATE;
}

export type GeneralInformationActions =
  | GetProductApplications
  | GetProductApplicationsSuccess
  | GetProductApplicationsFailure
  | UpdateModel
  | ResetGeneralInformationChildren
  | UpdateProductTypeForChildren
  | SetProductType
  | ClearAppState
  | SetSubscriptionStatus
  | GetInitialState;
