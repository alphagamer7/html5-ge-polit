import { Action } from '@ngrx/store';

import { SummaryActionTypes } from './types';

export class ClearAppState implements Action {
  readonly type = SummaryActionTypes.CLEAR_STATE;
  constructor(public payload: any) {}
}

export class SetProductType implements Action {
  readonly type = SummaryActionTypes.SET_PRODUCT_TYPE;

  constructor(public payload: any) {}
}

export type SummaryActions = ClearAppState | SetProductType;
