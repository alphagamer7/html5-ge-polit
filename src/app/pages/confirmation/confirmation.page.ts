import { Component } from '@angular/core';

import { RegionService } from '@comparenetworks/imsmart-web';

import { Store } from '@ngrx/store';
import { WizardState } from 'src/app/shared/store/reducers/reducer';

import { Route } from 'src/app/shared/store/actions/navigation.action';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';

import { CommonActionTypes } from 'src/app/shared/constants/shared-enum';

@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss']
})
export class ConfirmationPage {
  pageType: string;

  constructor(private regionService: RegionService, private store: Store<WizardState>) {}

  navHome(): void {
    this.store.dispatch(
      new Route({
        pageType: SharedConstants.pageDetails.landing.path
      })
    );
    // clear app state
    this.store.dispatch({
      type: CommonActionTypes.CLEAR_STATE
    });
  }
}
