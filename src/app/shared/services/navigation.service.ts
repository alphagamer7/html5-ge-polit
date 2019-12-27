import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as _ from 'lodash';

import { InitialRoute } from 'src/app/shared/store/actions/navigation.action';

import * as fromNavigation from 'src/app/shared/store/reducers/navigation.reducer';
import { VisitStatus } from '../types/navigation.type';
import { SharedConstants } from '../constants/shared-constants';
import { SetPageValidStatus } from '../store/actions/navigation.action';

@Injectable()
export class NavigationService {
  pages: {};
  initialScreen: boolean;
  visitStatus: VisitStatus[];
  index: number;
  constructor(private store: Store<fromNavigation.NavigationState>) {
    this.pages = {
      landing: {
        index: 0,
        path: SharedConstants.pageDetails.landing.path,
        title: SharedConstants.pageDetails.landing.title,

        isVisible: false
      },
      general: {
        index: 1,
        path: SharedConstants.pageDetails.general.path,
        title: SharedConstants.pageDetails.general.title,

        isVisible: true
      },
      formulation: {
        index: 2,
        path: SharedConstants.pageDetails.formulation.path,
        title: SharedConstants.pageDetails.formulation.title,

        isVisible: true
      },
      packaging: {
        index: 3,
        path: SharedConstants.pageDetails.packaging.path,
        title: SharedConstants.pageDetails.packaging.title,

        isVisible: true
      },
      manufacturing: {
        index: 4,
        path: SharedConstants.pageDetails.manufacturing.path,
        title: SharedConstants.pageDetails.manufacturing.title,

        isVisible: true
      },
      documentation: {
        index: 5,
        path: SharedConstants.pageDetails.documentation.path,
        title: SharedConstants.pageDetails.documentation.title,

        isVisible: true
      },
      summary: {
        index: 6,
        path: SharedConstants.pageDetails.summary.path,
        title: SharedConstants.pageDetails.summary.title,

        isVisible: true
      },
      confirmation: {
        index: 7,
        path: SharedConstants.pageDetails.confirmation.path,
        title: SharedConstants.pageDetails.confirmation.title,

        isVisible: false
      }
    };

    this.store.pipe(select(fromNavigation.getIndex)).subscribe(index => {
      this.index = index;
    });

    this.store.pipe(select(fromNavigation.getvisitStatus)).subscribe(visitStatus => {
      this.visitStatus = visitStatus;
    });
  }

  getNextPagePath(pageType: string): any {
    const nextIndex = _.keys(this.pages).indexOf(pageType) + 1;
    return _.values(this.pages)[nextIndex];
  }

  getPreviousPagePath(pageType: string): any {
    const previousIndex = _.keys(this.pages).indexOf(pageType) - 1;

    return _.values(this.pages)[previousIndex];
  }

  /**
   * set page visited state when initialing navigating to a page
   * @param pageType
   */
  initialNavigation(pageType: string) {
    this.store.dispatch(new InitialRoute({ pageType }));
  }

  /**
   * to determine whether a page is visited or not
   * @param pageType
   */
  checkVisitStatus(pageType): boolean {
    let flag = false;
    this.visitStatus.some(pageVisit => {
      if (pageVisit.pageType === pageType) {
        return (flag = true);
      }
    });
    console.log('flag', flag);
    return flag;
  }

  getVisitedNoOfPages() {
    return this.visitStatus.length;
  }

  setPageValidStatus(pageType: string, hasErrors: boolean) {
    this.store.dispatch(new SetPageValidStatus({ pageType, hasErrors }));
  }

  showPageErrorStatus(pageType: string): boolean {
    const index = this.pages[pageType].index;
    return (
      this.visitStatus[index] && this.visitStatus[index].hasError && (this.visitStatus[index + 1] && this.visitStatus[index + 1].isVisited)
    );
  }

  hasVisitedNextPage(pageType: string): boolean {
    const index = this.pages[pageType].index;
    return this.visitStatus[index + 1] && this.visitStatus[index + 1].isVisited;
  }
}
