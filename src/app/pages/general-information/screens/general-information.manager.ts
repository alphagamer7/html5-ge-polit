import { Injectable } from '@angular/core';

import { Observable, Observer, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import * as _ from 'lodash';

import { RegionService } from '@comparenetworks/imsmart-web';

import {
  SetSubscriptionStatus,
  UpdateProductTypeForChildren,
  GetInitialState,
  UpdateModel
} from 'src/app/shared/store/actions/general-inforation.action';

import { GeneralInformationState } from '../../../shared/store/reducers/general-information.reducer';
import * as fromGeneralInformation from '../../../shared/store/reducers/general-information.reducer';

import { NavigationService } from 'src/app/shared/services/navigation.service';
import { AlertService } from 'src/app/shared/services/alert.service';

import { GeneralInformation } from 'src/app/shared/types/general-information.type';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';
import { ProductType, ProductionType } from 'src/app/shared/constants/shared-enum';

export class GeneralInformationManager {
  fields: {};
  isInitialized: boolean;
  formDetails: GeneralInformation;
  region: string;
  branch: string;
  productType: string;
  hasUnsubscribed: boolean;
  isManuallyChanging: boolean;

  resetChildFields$: Observable<any>;
  resetChildFieldsSubject: BehaviorSubject<any>;

  fieldKeys = SharedConstants.pageDetails.general.fieldKeys;

  private destroySelectorSubject$: Subject<void> = new Subject();

  constructor(
    private navigationService: NavigationService,
    private store: Store<GeneralInformationState>,
    private alertService: AlertService,
    private regionService: RegionService
  ) {
    this.fields = {
      companyName: {
        name: this.fieldKeys.companyName,
        type: SharedConstants.inputFieldTypes.text,
        label: this.fieldKeys.companyName,
        placeholder: 'enterCompanyName',
        required: true,
        trim: true
      },
      productType: {
        name: this.fieldKeys.productType,
        type: SharedConstants.inputFieldTypes.radio,
        label: this.fieldKeys.productType,
        required: true
      },
      productionType: {
        name: this.fieldKeys.productionType,
        type: SharedConstants.inputFieldTypes.radio,
        label: this.fieldKeys.productionType,
        required: true
      },
      productApplication: {
        name: this.fieldKeys.productApplication,
        type: SharedConstants.inputFieldTypes.select,
        label: this.fieldKeys.productApplication,
        placeholder: 'selectProductApplication',
        required: true,
        interface: SharedConstants.inputFieldTypes.interfaceType
      },
      manufacturingLocation: {
        name: this.fieldKeys.manufacturingLocation,
        type: SharedConstants.inputFieldTypes.text,
        label: this.fieldKeys.manufacturingLocation,
        placeholder: 'searchLocation'
      }
    };

    this.isManuallyChanging = false;

    this.resetChildFieldsSubject = new BehaviorSubject(null);
    this.resetChildFields$ = this.resetChildFieldsSubject.asObservable();
  }

  init(pageType: string): Observable<void> {
    return new Observable<void>((observer: Observer<void>) => {
      if (!this.navigationService.checkVisitStatus(pageType)) {
        this.navigationService.initialNavigation(pageType);
        this.subscribeToSubscription().subscribe(() => {
          observer.next(null);
          observer.complete();
        });
      } else {
        observer.next(null);
        observer.complete();
      }
    });
  }

  private subscribeToSubscription(): Observable<void> {
    return new Observable(observer => {
      this.store
        .pipe(select(fromGeneralInformation.unsubscribeForSelectors))
        .pipe(takeUntil(this.destroySelectorSubject$))
        .subscribe(value => {
          // executed when app is cleared with value true to unsubscribe selectors
          if (value === true) {
            this.hasUnsubscribed = true;
            // resetting user input because warning will get triggered when navigating back
            this.formDetails = null;
            // need to unsubscribe when app state is cleared because multiple subscription will occur when setting navigation state.
            // can't subscribe in constructor since it is not initialized when services are getting initialized. therefore need to subscribe when page content is initializing
            this.destroySelectorSubject$.next();
            this.destroySelectorSubject$.complete();

            // manually setting to false to resubscribe for selectors
            this.store.dispatch(new SetSubscriptionStatus());
          } else {
            this.productType = '';
            this.isManuallyChanging = false;
            this.hasUnsubscribed = false;
            this.resetFormDetailsManually();
            this.subscribeToStore(); // subscribe to selectors
            observer.next(null);
            observer.complete();
          }
        });
    });
  }

  private subscribeToStore() {
    this.store
      .pipe(select(fromGeneralInformation.getProductApplications))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        this.fields[this.fieldKeys.productApplication].options = value;
      });

    this.store
      .pipe(select(fromGeneralInformation.getProductType))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        if (value !== this.productType) {
          this.handleProductTypeChange(value);
        }
        this.productType = value;
      });

    this.store
      .pipe(select(fromGeneralInformation.getGeneralInformationFormDetails))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        this.formDetails = value;
      });
  }

  //#region dispatch actions
  updateStore(value: any, fieldName: string): void {
    this.store.dispatch(
      new UpdateModel({
        value: value,
        name: fieldName
      })
    );
  }

  updateProductTypeForChildren(productType: string) {
    this.store.dispatch(new UpdateProductTypeForChildren({ productType: productType }));
  }
  //#endregion

  handleProductTypeChange(value: string): void {
    if (!this.isManuallyChanging) {
      // if product type is powder
      if (value === _.keys(ProductType)[1]) {
        const alert = this.alertService.presentAlert(
          this.regionService.language['warning'],
          this.regionService.language['noProductsAvailableWarning'],
          [
            {
              text: this.regionService.language['no'],
              cssClass: 'primary',
              role: 'cancel',
              handler: () => {
                alert.then(() => {
                  console.log('Cancel clicked');
                  // set back to original value
                  this.resetChildFieldsSubject.next(
                    Object.assign(
                      {},
                      {
                        reset: false,
                        value: value === _.keys(ProductType)[0] ? _.keys(ProductType)[1] : _.keys(ProductType)[0]
                      }
                    )
                  );
                });
              }
            },
            {
              text: this.regionService.language['yes'],
              role: 'confirm',
              handler: () => {
                alert.then(() => {
                  console.log('Yes clicked');
                  this.handleAppResetBasedOnProductType(value);
                });
              }
            }
          ],
          'alert-danger'
        );
      } else {
        this.handleAppResetBasedOnProductType(value);
      }
    } else if (this.isManuallyChanging) {
      this.isManuallyChanging = false;
    }
  }

  /**
   * get confirmation to reset app
   * **/
  handleAppResetBasedOnProductType(value: any): any {
    // if user has navigated to other screens we assum any task has been done. So resetting such tasks if answer is yes

    if (!this.isManuallyChanging) {
      if (this.childFieldsResetNeeded()) {
        const alert = this.alertService.presentAlert(
          this.regionService.language['valueChange'],
          this.regionService.language['valueChangeWarning'],
          [
            {
              text: this.regionService.language['no'],
              cssClass: 'primary',
              role: 'cancel',
              handler: () => {
                alert.then(() => {
                  console.log('Cancel clicked');
                  // set back to original value
                  this.resetChildFieldsSubject.next(
                    Object.assign(
                      {},
                      {
                        reset: false,
                        value: value === _.keys(ProductType)[0] ? _.keys(ProductType)[1] : _.keys(ProductType)[0]
                      }
                    )
                  );
                });
              }
            },
            {
              text: this.regionService.language['yes'],
              role: 'confirm',
              handler: () => {
                alert.then(() => {
                  console.log('Yes clicked');
                  this.resetChildFieldsSubject.next(
                    Object.assign(
                      {},
                      {
                        reset: true,
                        value: value
                      }
                    )
                  );
                  this.updateProductTypeForChildren(value);
                });
              }
            }
          ],
          'alert-danger'
        );
      } else {
        this.resetChildFieldsSubject.next(
          Object.assign(
            {},
            {
              reset: true,
              value: value
            }
          )
        );
        // in initial page navigation changing product type
        this.updateProductTypeForChildren(value);
      }
    } else if (this.isManuallyChanging) {
      this.isManuallyChanging = false;
    }
  }

  handleProductApplication(value: string): void {
    const alert = this.alertService.presentAlert(
      this.regionService.language['warning'],
      this.regionService.language['outsideoftheintendeduseWarning'],
      [this.regionService.language['confirmation']],
      'alert-danger'
    );
  }

  private childFieldsResetNeeded() {
    return (
      (this.formDetails &&
        (this.formDetails.productApplication !== '' ||
          (this.formDetails.productionType !== '' && this.formDetails.productionType !== _.keys(ProductionType)[1]))) ||
      this.navigationService.getVisitedNoOfPages() > 2
    );
  }

  /**
   * since it is not subscribed, property is not getting updated eventhough state is updated. therefore getting the initial state to manually updating the fileds.
   */
  private resetFormDetailsManually() {
    this.store.dispatch(new GetInitialState());
  }

  setPageValidStatus(pageType: string, hasErrors: boolean) {
    if (this.navigationService.hasVisitedNextPage(pageType)) {
      this.navigationService.setPageValidStatus(pageType, hasErrors);
    }
  }
}
