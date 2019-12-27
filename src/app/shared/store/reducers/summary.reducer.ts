import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as _ from 'lodash';

import * as summaryAction from '../actions/summary.action';
import { SummaryActionTypes } from '../types/summary.type';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';

export interface SummaryState {
  unsubscribeForSelectors: boolean;
}

export const INITIAL_STATE: SummaryState = {
  unsubscribeForSelectors: false
};

export function reducer(state: any = INITIAL_STATE, action: summaryAction.SummaryActions): SummaryState {
  switch (action.type) {
    case SummaryActionTypes.SET_PRODUCT_TYPE: {
      return { ...state, unsubscribeForSelectors: false };
    }

    case SummaryActionTypes.CLEAR_STATE:
      return { ...state, unsubscribeForSelectors: true };

    default:
      return {
        ...state
      };
  }
}

// Selector functions
const getSummaryState = createFeatureSelector<SummaryState>(SharedConstants.reducer.summary);

export const unsubscribeForSelectors = createSelector(
  getSummaryState,
  state => state.unsubscribeForSelectors
);
