import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as _ from 'lodash';

import * as documentationAction from '../actions/documentation.action';

import { DocumentationActionTypes } from '../types/documentation.types';
import { Documentation } from 'src/app/shared/types/documentation.type';

import { Confirmation } from 'src/app/shared/constants/shared-enum';
import { SharedConstants } from 'src/app/shared/constants/shared-constants';

export interface DocumentationState {
  documentationFormDetails: Documentation;
  unsubscribeForSelectors: boolean;
}

export const INITIAL_STATE: DocumentationState = {
  documentationFormDetails: {
    labelCustomization: '',
    daysUntilExpiration: '',
    needQuoteForStabilityStudies: _.keys(Confirmation)[0]
  },
  unsubscribeForSelectors: false
};

export function reducer(state: any = INITIAL_STATE, action: documentationAction.DocumentationActions): DocumentationState {
  switch (action.type) {
    case DocumentationActionTypes.UPDATE_DOCUMENTATION_MODEL: {
      return {
        ...state,
        documentationFormDetails: {
          ...state.documentationFormDetails,
          [action.payload.name]: action.payload.value
        }
      };
    }
    case DocumentationActionTypes.RESET_DOCUMENTATION_STORE: {
      return { ...INITIAL_STATE, unsubscribeForSelectors: true };
    }

    case DocumentationActionTypes.SET_PRODUCT_TYPE: {
      return { ...state, unsubscribeForSelectors: false };
    }

    case DocumentationActionTypes.CLEAR_STATE:
      return { ...state, unsubscribeForSelectors: true };

    default:
      return {
        ...state
      };
  }
}

// Selector functions
const getDocumentationState = createFeatureSelector<DocumentationState>(SharedConstants.reducer.documentation);

export const getDocumentFormDetails = createSelector(
  getDocumentationState,
  state => state.documentationFormDetails
);

export const unsubscribeForSelectors = createSelector(
  getDocumentationState,
  state => state.unsubscribeForSelectors
);
