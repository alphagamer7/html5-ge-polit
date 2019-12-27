import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as navigationAction from '../actions/navigation.action';

import { NavigationActionTypes } from '../types/navigation.types';
import { VisitStatus } from '../../types/navigation.type';

import { SharedConstants } from '../../constants/shared-constants';

export interface NavigationState {
  pageType: string;
  visitStatus: VisitStatus[];
  index: number;
}

export const INITIAL_STATE: NavigationState = {
  pageType: SharedConstants.pageDetails.landing.path,
  index: 0,
  visitStatus: [{ pageType: SharedConstants.pageDetails.landing.path, isVisited: true }]
};

export function reducer(state: NavigationState = INITIAL_STATE, action: navigationAction.NavigationActions): NavigationState {
  switch (action.type) {
    case NavigationActionTypes.INITIAL_NAVIGATION: {
      const visitState = [
        ...state.visitStatus,
        {
          pageType: action.payload.pageType,
          isVisited: true
        }
      ];

      return {
        ...state,
        pageType: action.payload.pageType,
        visitStatus: visitState
      };
    }

    case NavigationActionTypes.NAVIGATE_SUCCESS: {
      let index;
      state.visitStatus.filter((page, i) => {
        if (action.payload.pageType === page.pageType) {
          return (index = i);
        }
      });

      return {
        ...state,
        pageType: action.payload.pageType,
        index: index
      };
    }

    case NavigationActionTypes.NAVIGATE_FAILURE: {
      return {
        ...state
      };
    }

    case NavigationActionTypes.NAVIGATE_FORWARD_SUCCESS: {
      return {
        ...state,
        pageType: action.payload.pageType,
        index: action.payload.index
      };
    }

    case NavigationActionTypes.NAVIGATE_FORWARD_FAILURE: {
      return {
        ...state
      };
    }

    case NavigationActionTypes.NAVIGATE_BACK_SUCCESS: {
      return {
        ...state,
        pageType: action.payload.pageType,
        index: action.payload.index
      };
    }

    case NavigationActionTypes.NAVIGATE_BACK_FAILURE: {
      return {
        ...state
      };
    }

    case NavigationActionTypes.RESET: {
      return INITIAL_STATE;
    }

    case NavigationActionTypes.RESET_CHILDREN: {
      const pageType = action.payload.pageType;

      const visitStatuses = [];
      state.visitStatus.some(page => {
        if (page.pageType === pageType) {
          visitStatuses.push(page);
          return true;
        } else {
          visitStatuses.push(page);
        }
      });

      return {
        ...state,
        pageType: pageType,
        visitStatus: visitStatuses
      };
    }

    case NavigationActionTypes.SET_PAGE_VALID_STATUS: {
      return {
        ...state,
        visitStatus: state.visitStatus.map(status => {
          if (status.pageType === action.payload.pageType) {
            status.hasError = action.payload.hasErrors;
          }
          return status;
        })
      };
    }

    default: {
      return {
        ...state
      };
    }
  }
}

// Selector functions
const getNavigationState = createFeatureSelector<NavigationState>(SharedConstants.reducer.navigation);

export const getPageType = createSelector(
  getNavigationState,
  state => state.pageType
);

export const getvisitStatus = createSelector(
  getNavigationState,
  state => state.visitStatus
);

export const getIndex = createSelector(
  getNavigationState,
  state => state.index
);
