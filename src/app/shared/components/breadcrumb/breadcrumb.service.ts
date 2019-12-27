import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as _ from 'lodash';

import * as fromNavigation from '../../store/reducers/navigation.reducer';

import { VisitStatus, PageContent } from 'src/app/shared/types/navigation.type';

import { NavigationService } from 'src/app/shared/services/navigation.service';

import { Route } from 'src/app/shared/store/actions/navigation.action';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';
import { WizardState } from '../../store/reducers/reducer';

@Injectable()
export class BreadcrumbService {
  public index: number;
  public pages;
  public visitStatus: VisitStatus[];
  constructor(private store: Store<WizardState>, private navigationService: NavigationService) {
    this.pages = _.values(this.navigationService.pages).filter((page: PageContent) => page.path !== SharedConstants.pageDetails.landing.path);

    this.store.pipe(select(fromNavigation.getvisitStatus)).subscribe(visitStatus => {
      this.visitStatus = visitStatus;
    });

    this.store.pipe(select(fromNavigation.getIndex)).subscribe(index => {
      this.index = index;
    });
  }

  goToPosition(position): void {
    let selectedPosition;
    this.visitStatus.filter(pageVisit => {
      if (pageVisit.pageType === position.path) {
        return (selectedPosition = pageVisit);
      }
    });

    if ((position.path && position.index <= this.index) || (selectedPosition && selectedPosition.isVisited)) {
      setTimeout(() => {
        this.store.dispatch(new Route({ pageType: position.path }));
      }, 100);
    }
  }

  getPageErrorStatus(pageType: string) {
    return this.navigationService.showPageErrorStatus(pageType);
  }
}
