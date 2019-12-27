import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as _ from 'lodash';

import * as packagingAction from '../actions/packaging.action';

import { Packaging } from 'src/app/shared/types/packaging.type';
import { PackagingActionTypes } from '../types/packaging.type';

import { Confirmation } from 'src/app/shared/constants/shared-enum';
import { SharedConstants } from 'src/app/shared/constants/shared-constants';

export interface PackagingState {
  noOfPackages: number;
  activeIndex: number;
  packagings: Packaging[];

  unsubscribeForSelectors: boolean;
}

export const INITIAL_STATE: PackagingState = {
  noOfPackages: 0,
  activeIndex: 0,
  packagings: [],

  unsubscribeForSelectors: false
};

export function reducer(state: any = INITIAL_STATE, action: packagingAction.PackagingActions): PackagingState {
  switch (action.type) {
    case PackagingActionTypes.ADD_NEW_PACKAGE: {
      return {
        ...state,
        noOfPackages: state.noOfPackages + 1,
        activeIndex: state.noOfPackages,
        packagings: [
          ...state.packagings,
          {
            packagingIndex: state.noOfPackages === 0 ? 0 : state.noOfPackages,
            packagingType: '',
            packagingOption: '',
            outerPackaging: '',
            fillVolume: '',
            batchSize: '',
            showManufacturingDate: _.keys(Confirmation)[0]
          }
        ]
      };
    }

    case PackagingActionTypes.GET_PACKAGING_DROPDOWN_OPTIONS_SUCCESS: {
      const { data, fieldName } = action.payload;
      return {
        ...state,
        packagings: state.packagings.map(packageDetails => {
          if (packageDetails.packagingIndex === state.activeIndex) {
            packageDetails[fieldName] = data;
          }
          return packageDetails;
        })
      };
    }

    case PackagingActionTypes.GET_PACKAGING_DROPDOWN_OPTIONS_FAILURE:
      return {
        ...state
      };

    case PackagingActionTypes.GET_FILL_VOLUME_VALID_RANGE_SUCCESS:
      return {
        ...state,
        packagings: state.packagings.map(packageDetails => {
          if (packageDetails.packagingIndex === state.activeIndex) {
            packageDetails.fillVolumeRanges = action.payload;
          }
          return packageDetails;
        })
      };

    case PackagingActionTypes.UPDATE_PACKAGING_MODEL: {
      // can't update object values immutable way because form will be refreshing for every user input
      state.packagings[action.payload.packagingIndex][action.payload.name] = action.payload.value;
      return {
        ...state,
        activeIndex: action.payload.packagingIndex,
        packagings: state.packagings
      };
    }

    case PackagingActionTypes.RESET_PACKAGING_STORE: {
      return { ...INITIAL_STATE, unsubscribeForSelectors: true };
    }

    case PackagingActionTypes.RESET_PACKAGING_STORE_BASED_ON_CONCENTRATION: {
      return {
        ...state,
        noOfPackages: INITIAL_STATE.noOfPackages + 1,
        activeIndex: INITIAL_STATE.noOfPackages,
        packagings: [
          {
            packagingIndex: INITIAL_STATE.noOfPackages === 0 ? 0 : INITIAL_STATE.noOfPackages,
            packagingType: '',
            packagingOption: '',
            outerPackaging: '',
            fillVolume: '',
            batchSize: '',
            showManufacturingDate: _.keys(Confirmation)[0],
            packagingTypes: state.packagings[0].packagingTypes
          }
        ]
      };
    }

    case PackagingActionTypes.SET_PRODUCT_TYPE: {
      return { ...state, unsubscribeForSelectors: false };
    }

    case PackagingActionTypes.CLEAR_STATE:
      return { ...state, unsubscribeForSelectors: true };

    default:
      return {
        ...state
      };
  }
}

// Selector functions
const getPackagingState = createFeatureSelector<PackagingState>(SharedConstants.reducer.packaging);

// NOTE: when passing index as parameter, bind parameter has the previous value always. so used store activeIndex to access data
export const getPackagingTypes = createSelector(
  getPackagingState,
  state => state.packagings.length > 0 && state.packagings[state.activeIndex].packagingTypes
);

export const getPackagingOptions = createSelector(
  getPackagingState,
  state => state.packagings.length > 0 && state.packagings[state.activeIndex].packagingOptions
);

export const getOuterPackagings = createSelector(
  getPackagingState,
  state => state.packagings.length > 0 && state.packagings[state.activeIndex].outerPackagings
);

export const getFillVolumeRanges = createSelector(
  getPackagingState,
  state => state.packagings.length > 0 && state.packagings[state.activeIndex].fillVolumeRanges
);

export const getPackagings = createSelector(
  getPackagingState,
  state => state.packagings
);

export const getNoOFPackages = createSelector(
  getPackagingState,
  state => state.noOfPackages
);

export const getActiveIndex = createSelector(
  getPackagingState,
  state => state.activeIndex
);

export const unsubscribeForSelectors = createSelector(
  getPackagingState,
  state => state.unsubscribeForSelectors
);
