import { Observable, Observer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import * as fromManufacturing from 'src/app/shared/store/reducers/manufacturing.reducer';
import { ManufacturingState } from 'src/app/shared/store/reducers/manufacturing.reducer';

import { InitializeManufacturingOptions, UpdateModel, GetManufacturingTypeInfo } from 'src/app/shared/store/actions/manufacturing.action';

import { Manufacturing } from '../../../shared/types/manufacturing.type';

import { ManufacturingService } from 'src/app/shared/services/component-services/manufacturing.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { CRMFormService } from 'src/app/shared/services/crm-form.service';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';
import { PoreSize } from 'src/app/shared/constants/shared-enum';

export class ManufacturingManger {
  fields: {};
  isInitialized: boolean;
  formDetails: Manufacturing;
  guideInfo: string;
  productType: string;

  fieldKeys = SharedConstants.pageDetails.manufacturing.fieldKeys;

  private destroySelectorSubject$: Subject<void> = new Subject();

  constructor(
    private navigationService: NavigationService,
    private store: Store<ManufacturingState>,
    private crmFormService: CRMFormService,
    private manufacturingService: ManufacturingService
  ) {
    this.fields = {
      manufacturingType: {
        name: this.fieldKeys.manufacturingType,
        type: SharedConstants.inputFieldTypes.select,
        label: this.fieldKeys.manufacturingType,
        placeholder: 'selectManufacturingType',
        required: true,
        interface: SharedConstants.inputFieldTypes.interfaceType
      },
      sampleRequirements: {
        name: this.fieldKeys.sampleRequirements,
        type: SharedConstants.inputFieldTypes.text,
        label: this.fieldKeys.sampleRequirements,
        placeholder: 'enterSampleRequirements',
        trimNotRequired: true
      },
      poreSize: {
        name: this.fieldKeys.poreSize,
        type: SharedConstants.inputFieldTypes.select,
        label: this.fieldKeys.poreSize,
        placeholder: 'selectPoreSize',
        required: true,
        interface: SharedConstants.inputFieldTypes.interfaceType
      },
      storageTemperature: {
        name: this.fieldKeys.storageTemperature,
        type: SharedConstants.inputFieldTypes.select,
        label: this.fieldKeys.storageTemperature,
        placeholder: 'selectStorageTemperature',
        required: true,
        interface: SharedConstants.inputFieldTypes.interfaceType
      },
      shippingConditions: {
        name: this.fieldKeys.shippingConditions,
        type: SharedConstants.inputFieldTypes.select,
        label: this.fieldKeys.shippingConditions,
        placeholder: 'selectShippingConditions',
        required: true,
        interface: SharedConstants.inputFieldTypes.interfaceType
      },
      isTemperatureMonitoringRequired: {
        name: this.fieldKeys.isTemperatureMonitoringRequired,
        type: SharedConstants.inputFieldTypes.radio,
        label: 'isTemperatureMonitoringRequired'
      }
    };

    this.subscribeToStore();
  }

  init(pageType: string): Observable<void> {
    return new Observable<void>((observer: Observer<void>) => {
      this.productType = this.manufacturingService.productType;
      if (!this.navigationService.checkVisitStatus(pageType)) {
        this.navigationService.initialNavigation(pageType);
        this.store.dispatch(new InitializeManufacturingOptions());

        observer.next(null);
        observer.complete();
      } else {
        observer.next(null);
        observer.complete();
      }
    });
  }

  private subscribeToStore() {
    this.crmFormService
      .generateOptopnsFromEnum(PoreSize)
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(results => {
        this.fields[this.fieldKeys.poreSize].options = results;
      });

    this.store
      .pipe(select(fromManufacturing.getStorageTemperatures))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(results => {
        this.fields[this.fieldKeys.storageTemperature].options = results;
      });

    this.store
      .pipe(select(fromManufacturing.getShippingConditions))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(results => {
        this.fields[this.fieldKeys.shippingConditions].options = results;
      });

    this.store
      .pipe(select(fromManufacturing.getManufacturingTypes))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        this.fields[this.fieldKeys.manufacturingType].options = value;
      });

    this.store
      .pipe(select(fromManufacturing.getManufacturingFormDetails))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        this.formDetails = value;
      });

    this.store
      .pipe(select(fromManufacturing.getManufacturingTypeInfo))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(info => {
        this.guideInfo = info;
      });

    this.store
      .pipe(select(fromManufacturing.unsubscribeForSelectors))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        if (value === true) {
          this.destroySelectorSubject$.next();
        }
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

  getManufacturingTypeInfoBasedOnTypeId(index: number): void {
    this.store.dispatch(
      new GetManufacturingTypeInfo({
        manufacturingTypeId: index
      })
    );
  }
  //#endregion

  setPageValidStatus(pageType: string, hasErrors: boolean) {
    if (this.navigationService.hasVisitedNextPage(pageType)) {
      this.navigationService.setPageValidStatus(pageType, hasErrors);
    }
  }
}
