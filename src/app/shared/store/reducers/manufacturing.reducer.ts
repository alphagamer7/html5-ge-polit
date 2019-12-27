import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as _ from 'lodash';

import { CNSelectOption } from '@comparenetworks/imsmart-web';

import * as manufacturingAction from '../actions/manufacturing.action';

import { ManufacturingActionTypes } from '../types/manufacturing.type';
import { Manufacturing } from '../../types/manufacturing.type';

import { Confirmation, PoreSize, ProductType } from 'src/app/shared/constants/shared-enum';
import { SharedConstants } from 'src/app/shared/constants/shared-constants';

export interface ManufacturingState {
  manufacturingTypes: CNSelectOption[];
  shippingConditions: CNSelectOption[];
  storageTemperatures: CNSelectOption[];
  manufacturingTypeInfo: string;
  manufacturingFormDetails: Manufacturing;
  unsubscribeForSelectors: boolean;
}

export const INITIAL_STATE: ManufacturingState = {
  manufacturingTypes: [],
  shippingConditions: [],
  storageTemperatures: [],
  manufacturingTypeInfo: '',
  manufacturingFormDetails: {
    manufacturingType: '',
    sampleRequirements: '',
    poreSize: _.keys(PoreSize)[1],
    storageTemperature: '',
    shippingConditions: '',
    isTemperatureMonitoringRequired: _.keys(Confirmation)[0]
  },
  unsubscribeForSelectors: false
};

export function reducer(state: any = INITIAL_STATE, action: manufacturingAction.ManufacturingActions): ManufacturingState {
  switch (action.type) {
    case ManufacturingActionTypes.GET_DROPDOWN_LIST_SUCCESS_MANUFACTURING:
      const { data, fieldName } = action.payload;
      return {
        ...state,
        [fieldName]: data
      };

    case ManufacturingActionTypes.GET_DROPDOWN_LIST_FAILURE_MANUFACTURING:
      return {
        ...state
      };

    case ManufacturingActionTypes.GET_MANUFACTURING_TYPE_INFO_SUCCESS:
      return { ...state, manufacturingTypeInfo: action.payload };

    case ManufacturingActionTypes.GET_MANUFACTURING_TYPE_INFO_FAILURE:
      return {
        ...state
      };

    case ManufacturingActionTypes.UPDATE_MANUFACTURING_MODEL: {
      return {
        ...state,
        manufacturingFormDetails: {
          ...state.manufacturingFormDetails,
          [action.payload.name]: action.payload.value
        }
      };
    }

    case ManufacturingActionTypes.RESET_MANUFACRURING_STORE: {
      return { ...INITIAL_STATE, unsubscribeForSelectors: true };
    }

    case ManufacturingActionTypes.SET_PRODUCT_TYPE: {
      return {
        ...state,
        poreSize: action.payload === _.keys(ProductType)[0] ? _.keys(PoreSize)[1] : '',
        manufacturingFormDetails: {
          ...state.manufacturingFormDetails
        },
        unsubscribeForSelectors: false
      };
    }

    case ManufacturingActionTypes.CLEAR_STATE:
      return { ...state, unsubscribeForSelectors: true };

    default:
      return {
        ...state
      };
  }
}

// Selector functions
const getManufacturingState = createFeatureSelector<ManufacturingState>(SharedConstants.reducer.manufacturing);

export const getManufacturingTypes = createSelector(
  getManufacturingState,
  state => state.manufacturingTypes
);

export const getManufacturingTypeInfo = createSelector(
  getManufacturingState,
  state => state.manufacturingTypeInfo
);

export const getManufacturingFormDetails = createSelector(
  getManufacturingState,
  state => state.manufacturingFormDetails
);

export const getStorageTemperatures = createSelector(
  getManufacturingState,
  state => state.storageTemperatures
);

export const getShippingConditions = createSelector(
  getManufacturingState,
  state => state.shippingConditions
);

export const unsubscribeForSelectors = createSelector(
  getManufacturingState,
  state => state.unsubscribeForSelectors
);
