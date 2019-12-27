import { Action } from '@ngrx/store';

import { NavigationActionTypes } from '../types/navigation.types';

/**
 * for breadcrumb navigation
 */
export class Route implements Action {
  readonly type = NavigationActionTypes.NAVIGATE;

  constructor(
    public payload: {
      pageType: string;
      showWarning?: boolean;
    }
  ) {}
}

export class RouterSuccess implements Action {
  readonly type = NavigationActionTypes.NAVIGATE_SUCCESS;

  constructor(
    public payload: {
      pageType: string;
    }
  ) {}
}

export class RouterFailure implements Action {
  readonly type = NavigationActionTypes.NAVIGATE_FAILURE;

  constructor(
    public payload: {
      pageType: string;
    }
  ) {}
}

export class RouterBack implements Action {
  readonly type = NavigationActionTypes.NAVIGATE_BACK;
  constructor(
    public payload: {
      pageType: string;
    }
  ) {}
}

export class RouterBackSuccess implements Action {
  readonly type = NavigationActionTypes.NAVIGATE_BACK_SUCCESS;

  constructor(
    public payload: {
      pageType: string;
      index: number;
    }
  ) {}
}

export class RouterBackFailure implements Action {
  readonly type = NavigationActionTypes.NAVIGATE_BACK_FAILURE;

  constructor(
    public payload: {
      pageType: string;
    }
  ) {}
}

/**
 * set page state when page is initially visited
 */
export class InitialRoute implements Action {
  readonly type = NavigationActionTypes.INITIAL_NAVIGATION;
  constructor(
    public payload: {
      pageType: string;
    }
  ) {}
}

export class RouterForward implements Action {
  readonly type = NavigationActionTypes.NAVIGATE_FORWARD;
  constructor(
    public payload: {
      pageType: string;
    }
  ) {}
}

export class RouterForwardSuccess implements Action {
  readonly type = NavigationActionTypes.NAVIGATE_FORWARD_SUCCESS;

  constructor(
    public payload: {
      pageType: string;
      index: number;
    }
  ) {}
}

export class RouterForwardFailure implements Action {
  readonly type = NavigationActionTypes.NAVIGATE_FORWARD_FAILURE;
  constructor(
    public payload: {
      pageType: string;
    }
  ) {}
}

export class ResetNavigation implements Action {
  readonly type = NavigationActionTypes.RESET;
  constructor() {}
}

/**
 * reset page states when parent page content chages
 */
export class ResetChildren implements Action {
  readonly type = NavigationActionTypes.RESET_CHILDREN;
  constructor(
    public payload: {
      pageType: string;
    }
  ) {}
}

export class SetPageValidStatus implements Action {
  readonly type = NavigationActionTypes.SET_PAGE_VALID_STATUS;
  constructor(
    public payload: {
      pageType: string;
      hasErrors: boolean;
    }
  ) {}
}

export type NavigationActions =
  | Route
  | RouterSuccess
  | RouterFailure
  | RouterBack
  | RouterBackSuccess
  | RouterBackFailure
  | RouterForward
  | RouterForwardSuccess
  | RouterForwardFailure
  | InitialRoute
  | ResetNavigation
  | ResetChildren
  | SetPageValidStatus;
