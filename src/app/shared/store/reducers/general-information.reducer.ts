import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as _ from 'lodash';

import * as generalInformationAction from '../actions/general-inforation.action';

import { CNSelectOption } from 'src/app/shared/types/crm-input.type';
import { GeneralInformation } from 'src/app/shared/types/general-information.type';
import { GeneralInformationActionTypes } from '../types/general.type';

import { ProductType, ProductionType } from 'src/app/shared/constants/shared-enum';
import { SharedConstants } from 'src/app/shared/constants/shared-constants';

export interface GeneralInformationState {
  productApplications: CNSelectOption[];
  generalInformationFormDetails: GeneralInformation;
  unsubscribeForSelectors: boolean;
}

export const INITIAL_STATE: GeneralInformationState = {
  productApplications: [],

  generalInformationFormDetails: {
    companyName: '',
    productType: _.keys(ProductType)[0],
    productionType: _.keys(ProductionType)[1],
    productApplication: '',
    manufacturingLocation: SharedConstants.locationDefault
  },
  unsubscribeForSelectors: false
};

export function reducer(state: GeneralInformationState = INITIAL_STATE, action: generalInformationAction.GeneralInformationActions): GeneralInformationState {
  switch (action.type) {
    case GeneralInformationActionTypes.GET_PRODUCT_APPLICATIONS_SUCCESS: {
      return { ...state, productApplications: action.payload };
    }

    case GeneralInformationActionTypes.GET_PRODUCT_APPLICATIONS_FAILURE:
      return {
        ...state
      };

    case GeneralInformationActionTypes.UPDATE_GENERAL_INFORMATION_MODEL: {
      // update object immutable way
      return {
        ...state,
        generalInformationFormDetails: {
          ...state.generalInformationFormDetails,
          [action.payload.name]: action.payload.value
        }
      };
    }

    case GeneralInformationActionTypes.SET_PRODUCT_TYPE: {
      return { ...state, unsubscribeForSelectors: false };
    }

    case GeneralInformationActionTypes.CLEAR_STATE: {
      return { ...state, unsubscribeForSelectors: true };
    }

    case GeneralInformationActionTypes.SET_SUBSCRIPTION_STATUS: {
      return { ...state, unsubscribeForSelectors: false };
    }

    default:
      return {
        ...state
      };
  }
}

// Selector functions
const getGeneralInformationState = createFeatureSelector<GeneralInformationState>(SharedConstants.reducer.generalInformation);

export const getProductApplications = createSelector(
  getGeneralInformationState,
  state => state.productApplications
);

export const getGeneralInformationFormDetails = createSelector(
  getGeneralInformationState,
  state => state.generalInformationFormDetails
);

export const getProductType = createSelector(
  getGeneralInformationState,
  state => state.generalInformationFormDetails.productType
);

export const unsubscribeForSelectors = createSelector(
  getGeneralInformationState,
  state => state.unsubscribeForSelectors
);
