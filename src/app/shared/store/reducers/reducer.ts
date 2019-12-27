import { ActionReducerMap, ActionReducer, Action, MetaReducer, createFeatureSelector, createSelector } from '@ngrx/store';

import * as generalInformation from './general-information.reducer';
import * as packaging from './packaging.reducer';
import * as manufacturing from './manufacturing.reducer';
import * as documentation from './documentation.reducer';
import * as formulation from './formulation-and-control.reducer';
import * as summary from './summary.reducer';
import * as navigation from 'src/app/shared/store/reducers/navigation.reducer';

import { CommonActionTypes } from 'src/app/shared/constants/shared-enum';
import { SharedConstants } from '../../constants/shared-constants';

export interface WizardState {
  product_wizard_generalInformation: generalInformation.GeneralInformationState;
  product_wizard_packaging: packaging.PackagingState;
  product_wizard_manufacturing: manufacturing.ManufacturingState;
  product_wizard_documentation: documentation.DocumentationState;
  product_wizard_navigation: navigation.NavigationState;
  product_wizard_formulation: formulation.FormulationState;
  product_wizard_summary: summary.SummaryState;
}

export const reducers: ActionReducerMap<WizardState> = {
  product_wizard_generalInformation: generalInformation.reducer,
  product_wizard_packaging: packaging.reducer,
  product_wizard_manufacturing: manufacturing.reducer,
  product_wizard_documentation: documentation.reducer,
  product_wizard_navigation: navigation.reducer,
  product_wizard_formulation: formulation.reducer,
  product_wizard_summary: summary.reducer
};

/**
 * Clear app store - global store restoring to initial state
 * @param reducer
 */
export function clearState(reducer: ActionReducer<WizardState>): ActionReducer<WizardState> {
  return function(state: WizardState, action: Action): WizardState {
    if (action.type === CommonActionTypes.CLEAR_STATE) {
      state = undefined;
    }
    return reducer(state, action);
  };
}

// MetaReducer - Take a reducer, do what you need and return a new reducer
export const metaReducers: MetaReducer<WizardState>[] = [clearState];

// Selector functions
const getState = createFeatureSelector<generalInformation.GeneralInformationState>(SharedConstants.reducer.generalInformation);

export const getProductType = createSelector(
  getState,
  state => state.generalInformationFormDetails.productType
);

export const getSubscriptionStatus = createSelector(
  getState,
  state => state.unsubscribeForSelectors
);
