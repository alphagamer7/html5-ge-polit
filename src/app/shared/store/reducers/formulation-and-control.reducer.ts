import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as _ from 'lodash';

import * as formulationAction from '../actions/formulation-and-control.action';

import { FormulationActionTypes } from 'src/app/shared/store/types/formulation.type';
import { CNSelectOption } from 'src/app/shared/types/crm-input.type';
import { QualityControlTest } from 'src/app/shared/types/quality-control-test.type';
import { FormulationDetails } from 'src/app/shared/types/formulation-details.types';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';
import { LiquidConcentrationUnit, PowderConcentrationUnit } from '../../constants/shared-enum';

export interface FormulationState {
  formulations: CNSelectOption[];
  qualityControlTestOptions: QualityControlTest[];
  formulationFormDetails: FormulationDetails;

  unsubscribeForSelectors: boolean;
  hasRestriction: boolean;
  hasAllowedConcentration: boolean;
  isNotNaoh: boolean;
}

export const INITIAL_STATE: FormulationState = {
  formulations: [],
  qualityControlTestOptions: [],
  formulationFormDetails: {
    filteredFormulations: [],
    selectedFormulations: [],
    selectedQualityTests: [],
    productName: ''
  },
  unsubscribeForSelectors: false,
  hasRestriction: false,
  hasAllowedConcentration: false,
  isNotNaoh: false
};

export function reducer(state: any = INITIAL_STATE, action: formulationAction.FormulationActions): FormulationState {
  switch (action.type) {
    case FormulationActionTypes.GET_DROPDOWN_LIST_SUCCESS_FORMULATION:
      const { data, fieldName } = action.payload;
      return {
        ...state,
        [fieldName]: data
      };

    case FormulationActionTypes.GET_DROPDOWN_LIST_FAILURE_FORMULATION:
      return {
        ...state
      };

    case FormulationActionTypes.FILTER_CHEMICAL_FORMULATIONS_SUCCESS:
      return {
        ...state,
        formulationFormDetails: {
          ...state.formulationFormDetails,
          filteredFormulations: [...state.formulationFormDetails.filteredFormulations, ...action.payload]
        }
      };

    case FormulationActionTypes.FILTER_CHEMICAL_FORMULATIONS_FAILURE:
      return {
        ...state
      };

    case FormulationActionTypes.CLEAR_FILTER_CHEMICAL_FORMULATIONS:
      return {
        ...state,
        formulationFormDetails: {
          ...state.formulationFormDetails,
          filteredFormulations: INITIAL_STATE.formulationFormDetails.filteredFormulations
        }
      };

    case FormulationActionTypes.UPDATE_SELECTED_FORMULATIONS: {
      const hasUpdatedRestriction =
        state.formulationFormDetails.selectedFormulations.filter(
          item =>
            item.chemicalFormulation === SharedConstants.NaOH && (Number(item.concentration) > 0.5 && item.concentrationUnit === LiquidConcentrationUnit.M)
        ).length > 0;
      return {
        ...state,
        formulationFormDetails: {
          ...state.formulationFormDetails,
          selectedFormulations: [...action.payload.selectedItems, ...state.formulationFormDetails.selectedFormulations]
        },
        hasRestriction: hasUpdatedRestriction,
        hasAllowedConcentration: hasUpdatedRestriction
      };
    }

    case FormulationActionTypes.SET_PRODUCT_TYPE: {
      return {
        ...state,
        productType: action.payload.productType,
        unsubscribeForSelectors: false
      };
    }

    case FormulationActionTypes.UPDATE_FORMULATION_ITEM_DETAILS:
      let hasRestriction = false;
      let isNotNaoh = false;
      // Note : All Litre will not have bottom drain
      const selectedFormulations = state.formulationFormDetails.selectedFormulations.map(item => {
        if (
          item.chemicalFormulation === SharedConstants.NaOH &&
          item.id !== action.payload.id &&
          (Number(item.concentration) > 0.5 && item.concentrationUnit === LiquidConcentrationUnit.M)
        ) {
          hasRestriction = true;
        }
        if (item.id === action.payload.id) {
          if (item.chemicalFormulation !== SharedConstants.NaOH) {
            isNotNaoh = true;
          }
          if (action.payload.fieldName === SharedConstants.tableRelatedColumnNames.concentration) {
            if (
              item.chemicalFormulation === SharedConstants.NaOH &&
              ((Number(action.payload.value) > 20 && item.concentrationUnit === PowderConcentrationUnit.g) ||
                (Number(action.payload.value) > 0.5 && item.concentrationUnit === LiquidConcentrationUnit.M) ||
                item.concentrationUnit === LiquidConcentrationUnit.l)
            ) {
              hasRestriction = true;
            }
            return {
              ...item,
              concentration: action.payload.value
            };
          } else {
            if (
              item.chemicalFormulation === SharedConstants.NaOH &&
              ((Number(item.concentration) > 20 && action.payload.value === PowderConcentrationUnit.g) ||
                (Number(item.concentration) > 0.5 && action.payload.value === LiquidConcentrationUnit.M) ||
                action.payload.value === LiquidConcentrationUnit.l)
            ) {
              hasRestriction = true;
            }
            return {
              ...item,
              concentrationUnit: action.payload.value
            };
          }
        } else {
          return item;
        }
      });

      return {
        ...state,
        formulationFormDetails: {
          ...state.formulationFormDetails,
          selectedFormulations
        },
        hasRestriction,
        hasAllowedConcentration: hasRestriction,
        isNotNaoh
      };

    case FormulationActionTypes.RESET_RESTRICTION: {
      return {
        ...state,
        hasRestriction: false
      };
    }

    case FormulationActionTypes.UPDATE_QUALITY_CONTROL_TESTS:
      return {
        ...state,
        formulationFormDetails: {
          ...state.formulationFormDetails,
          selectedQualityTests: action.payload
        }
      };

    case FormulationActionTypes.DELETE_FORMULATION_ITEM:
      const hasPackageRestriction =
        state.formulationFormDetails.selectedFormulations.filter(item => item.id === action.payload.id && item.chemicalFormulation === SharedConstants.NaOH)
          .length > 0;

      return {
        ...state,
        formulationFormDetails: {
          ...state.formulationFormDetails,
          selectedFormulations: state.formulationFormDetails.selectedFormulations.filter(item => item.id !== action.payload.id)
        },
        hasRestriction: !hasPackageRestriction,
        hasAllowedConcentration: !hasPackageRestriction
      };

    case FormulationActionTypes.SET_PRODUCT_NAME:
      return {
        ...state,
        formulationFormDetails: {
          ...state.formulationFormDetails,
          productName: action.payload.productName
        }
      };

    case FormulationActionTypes.RESET_FORMULATION_STORE:
      return { ...INITIAL_STATE, unsubscribeForSelectors: true };

    case FormulationActionTypes.SET_PRODUCT_TYPE: {
      return { ...state, unsubscribeForSelectors: false };
    }

    case FormulationActionTypes.CLEAR_STATE:
      return { ...state, unsubscribeForSelectors: true };

    default:
      return {
        ...state
      };
  }
}

// Selector functions
const formulationState = createFeatureSelector<FormulationState>(SharedConstants.reducer.formulation);

export const getChemicalFormulations = createSelector(
  formulationState,
  state => state.formulations
);

export const getFormulationFormDetails = createSelector(
  formulationState,
  state => state.formulationFormDetails
);

export const getFilteredFormulations = createSelector(
  getFormulationFormDetails,
  details => details.filteredFormulations
);

export const getSelectedFormulations = createSelector(
  getFormulationFormDetails,
  details => details.selectedFormulations
);

export const getSelectedQualityControlTests = createSelector(
  getFormulationFormDetails,
  details => details.selectedQualityTests
);

export const getProductName = createSelector(
  getFormulationFormDetails,
  details => details.productName
);

export const getQualityControlTestOptions = createSelector(
  formulationState,
  state => state.qualityControlTestOptions
);

export const unsubscribeForSelectors = createSelector(
  formulationState,
  state => state.unsubscribeForSelectors
);

export const getHasRestriction = createSelector(
  formulationState,
  state => state.hasRestriction
);

export const getHasAllowedConcentration = createSelector(
  formulationState,
  state => state.hasAllowedConcentration
);

export const getIsNotNaoh = createSelector(
  formulationState,
  state => state.isNotNaoh
);
