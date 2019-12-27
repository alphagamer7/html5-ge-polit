import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';

import { of as observableOf } from 'rxjs';

import { map, tap, catchError } from 'rxjs/operators';
import { NavigationService } from '../../services/navigation.service';

import { NavigationActionTypes } from '../types/navigation.types';
import { RouterForwardSuccess, RouterForwardFailure } from '../actions/navigation.action';
import { Route, RouterBack, RouterForward, RouterBackSuccess, RouterFailure, RouterSuccess, RouterBackFailure } from '../actions/navigation.action';

@Injectable()
export class RouterEffects {
  constructor(private actions$: Actions, private router: Router, private navigationService: NavigationService) {}

  /**
   * for breadcrumb navigation
   */
  @Effect()
  navigate$ = this.actions$.pipe(
    ofType(NavigationActionTypes.NAVIGATE),
    map((action: Route) => action.payload),
    tap(({ pageType }) => {
      this.router.navigate([pageType]);
    }),
    map(action => new RouterSuccess(action)),
    catchError(error => observableOf(new RouterFailure(error)))
  );

  @Effect()
  navigateBack$ = this.actions$.pipe(
    ofType(NavigationActionTypes.NAVIGATE_BACK),
    map((action: RouterBack) => action.payload),
    map(({ pageType }) => {
      const pathDetails = this.navigationService.getPreviousPagePath(pageType);

      this.router.navigate([pathDetails['path']]);
      return new RouterBackSuccess({
        pageType: pathDetails['path'],
        index: pathDetails['index']
      });
    }),
    catchError(error => observableOf(new RouterBackFailure(error)))
  );

  @Effect()
  navigateForward$ = this.actions$.pipe(
    ofType(NavigationActionTypes.NAVIGATE_FORWARD),
    map((action: RouterForward) => action.payload),
    map(({ pageType }) => {
      const pathDetails = this.navigationService.getNextPagePath(pageType);
      this.router.navigate([pathDetails['path']]);

      return new RouterForwardSuccess({
        pageType: pathDetails['path'],
        index: pathDetails['index']
      });
    }),
    catchError(error => observableOf(new RouterForwardFailure(error)))
  );
}
