import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as _ from 'lodash';

import { RouterForward, RouterBack } from 'src/app/shared/store/actions/navigation.action';
import { CommonActionTypes } from 'src/app/shared/constants/shared-enum';
import { WizardState } from '../../store/reducers/reducer';
import { ResetGeneralInformationChildren } from '../../store/actions/general-inforation.action';
import { ResetPackagingChildren } from '../../store/actions/packaging.action';
import { ResetManufacturingChildren } from '../../store/actions/manufacturing.action';

@Injectable()
export class PageFooterService {
  constructor(private store: Store<WizardState>) {}

  resetContent(pageType: string) {
    switch (pageType) {
      case 'general':
        this.store.dispatch(new ResetGeneralInformationChildren());
        break;
      case 'packaging':
        this.store.dispatch(new ResetPackagingChildren());
        break;
      case 'manufacturing':
        this.store.dispatch(new ResetManufacturingChildren());
        break;
      case 'all':
        this.store.dispatch({
          type: CommonActionTypes.CLEAR_STATE
        });
        break;
    }
  }

  navigateForward(pageType: string) {
    this.store.dispatch(new RouterForward({ pageType: pageType }));
  }

  navigateBack(pageType: string) {
    this.store.dispatch(
      new RouterBack({
        pageType: pageType
      })
    );
  }
}
