import { Action } from '@ngrx/store';

import { DocumentationActionTypes } from '../types/documentation.types';

export class UpdateModel implements Action {
  readonly type = DocumentationActionTypes.UPDATE_DOCUMENTATION_MODEL;
  constructor(public payload: any) {}
}

export class ResetDocumentationStore implements Action {
  readonly type = DocumentationActionTypes.RESET_DOCUMENTATION_STORE;
}

export class ClearAppState implements Action {
  readonly type = DocumentationActionTypes.CLEAR_STATE;
  constructor(public payload: any) {}
}

export class SetProductType implements Action {
  readonly type = DocumentationActionTypes.SET_PRODUCT_TYPE;
}
export type DocumentationActions = UpdateModel | ResetDocumentationStore | ClearAppState | SetProductType;
