import * as _ from 'lodash';
import { Observable, Observer, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { RegionService } from '@comparenetworks/imsmart-web';

import * as fromPackaging from 'src/app/shared/store/reducers/packaging.reducer';
import * as fromGeneralInformation from 'src/app/shared/store/reducers/general-information.reducer';
import * as fromFormulation from 'src/app/shared/store/reducers/formulation-and-control.reducer';
import { FormulationState } from 'src/app/shared/store/reducers/formulation-and-control.reducer';

import {
  GetPackagingOptions,
  GetOuterPackagings,
  GetPackagingTypes,
  AddNumberPackage,
  UpdateModel,
  GetFillVolumeValidRange
} from '../../../shared/store/actions/packaging.action';

import { NavigationService } from 'src/app/shared/services/navigation.service';

import { Packaging } from 'src/app/shared/types/packaging.type';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';
import { LiquidConcentrationUnit, PowderConcentrationUnit } from 'src/app/shared/constants/shared-enum';
import { ResetRestriciton } from 'src/app/shared/store/actions/formulation-and-control.action';

export class PackagingManager {
  public initializedFieldsCount: number;

  activeIndex: number;

  fields: {};
  isInitialized: boolean;
  hasVisited: boolean;
  formDetails: Packaging[];

  packagings$: Observable<Packaging[]>;
  packagingsSubject: BehaviorSubject<Packaging[]>;

  packagingTypes$: Observable<number>;
  packagingTypesSubject: BehaviorSubject<number>;

  packagingOptions$: Observable<number>;
  packagingOptionsSubject: BehaviorSubject<number>;

  outerPackaging$: Observable<number>;
  outerPackagingSubject: BehaviorSubject<number>;

  fillVolumeRanges$: Observable<number>;
  fillVolumeRangesSubject: BehaviorSubject<number>;

  maxFillVolume$: Observable<number>;
  maxFillVolumeSubject: BehaviorSubject<number>;
  hasPackageRestrictions: boolean;
  hasAllowedConcentration: boolean;

  isNotNaoh: boolean;

  showAppendix: boolean;
  packageContent = {
    productName: '',
    formulation: {},
    catlogueNo: 'SH3AXXXX',
    bottleNo: 'to be assigned',
    volume: 'as assigned',
    storeAt: 'TBD',
    mfgDate: 'TBD',
    expiryDate: 'TBD',
    lotNo: 'to be assigned',
    customerName: 'companyName',
    sterlityStatement: 'TBD',
    intendedUseStatement: 'intendedUseStatement'
  };

  fieldKeys = SharedConstants.pageDetails.packaging.fieldKeys;

  private destroySelectorSubject$: Subject<void> = new Subject();

  constructor(
    private store: Store<fromPackaging.PackagingState>,
    private formualtionStore: Store<FormulationState>,
    private navigationService: NavigationService,
    private regionService: RegionService
  ) {
    this.fields = {
      packagingType: {
        name: this.fieldKeys.packagingType,
        type: SharedConstants.inputFieldTypes.select,
        label: this.fieldKeys.packagingType,
        placeholder: 'selectPackagingType',
        required: true,
        interface: SharedConstants.inputFieldTypes.interfaceType
      },
      packagingOption: {
        name: this.fieldKeys.packagingOption,
        type: SharedConstants.inputFieldTypes.select,
        label: this.fieldKeys.packagingOption,
        placeholder: 'selectPackagingOption',
        required: true,
        interface: SharedConstants.inputFieldTypes.interfaceType
      },
      outerPackaging: {
        name: this.fieldKeys.outerPackaging,
        type: SharedConstants.inputFieldTypes.select,
        label: this.fieldKeys.outerPackaging,
        placeholder: 'selectOuterPackaging',
        required: true,
        interface: SharedConstants.inputFieldTypes.interfaceType
      },
      fillVolume: {
        name: this.fieldKeys.fillVolume,
        type: SharedConstants.inputFieldTypes.number,
        label: this.fieldKeys.fillVolume,
        placeholder: 'enterFillVolume',
        numberWithDigit: true,
        required: true
      },
      batchSize: {
        name: this.fieldKeys.batchSize,
        type: SharedConstants.inputFieldTypes.number,
        label: this.fieldKeys.batchSize,
        placeholder: 'enterBatchSize',
        required: true,
        number: true
      },
      showManufacturingDate: {
        name: this.fieldKeys.showManufacturingDate,
        type: SharedConstants.inputFieldTypes.radio,
        label: this.fieldKeys.showManufacturingDate,
        required: true
      }
    };

    this.packagingsSubject = new BehaviorSubject([]);
    this.packagings$ = this.packagingsSubject.asObservable();

    this.packagingTypesSubject = new BehaviorSubject(null);
    this.packagingTypes$ = this.packagingTypesSubject.asObservable();

    this.packagingOptionsSubject = new BehaviorSubject(null);
    this.packagingOptions$ = this.packagingOptionsSubject.asObservable();

    this.outerPackagingSubject = new BehaviorSubject(null);
    this.outerPackaging$ = this.outerPackagingSubject.asObservable();

    this.maxFillVolumeSubject = new BehaviorSubject(null);
    this.maxFillVolume$ = this.maxFillVolumeSubject.asObservable();

    this.fillVolumeRangesSubject = new BehaviorSubject(null);
    this.fillVolumeRanges$ = this.fillVolumeRangesSubject.asObservable();

    this.activeIndex = 0;

    this.subscribeToStore();
  }

  init(pageType: string): Observable<void> {
    return new Observable<void>((observer: Observer<void>) => {
      this.initializedFieldsCount = 0;

      if (!this.hasVisited) {
        this.addNewPackage();
        this.navigationService.initialNavigation(pageType);
        observer.next(null);
        observer.complete();
      } else {
        observer.next(null);
        observer.complete();
      }
    });
  }

  private subscribeToStore() {
    this.formualtionStore.pipe(select(fromFormulation.getSelectedFormulations)).subscribe(values => {
      values.forEach((formula, i) => {
        this.packageContent.formulation[`formula${i}`] = formula;
        this.packageContent.formulation[`formula${i}`]['concentrationlabel'] = `${formula.concentration} ${formula.concentrationUnit}`;
      });
    });

    this.formualtionStore.pipe(select(fromFormulation.getHasRestriction)).subscribe(value => {
      this.hasPackageRestrictions = value;
    });

    this.formualtionStore.pipe(select(fromFormulation.getHasAllowedConcentration)).subscribe(value => {
      this.hasAllowedConcentration = value;
    });

    this.formualtionStore.pipe(select(fromFormulation.getIsNotNaoh)).subscribe(value => {
      this.isNotNaoh = value;
    });

    this.store
      .pipe(select(fromPackaging.getActiveIndex))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        this.activeIndex = value;
      });

    this.store
      .pipe(select(fromPackaging.getPackagings))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        this.formDetails = value;
        this.packagingsSubject.next(this.formDetails);

        if (!this.isInitialized) {
          this.initializeStoreSubscribers();
          this.initializePackagingDetails();
          this.isInitialized = true;
        }
      });

    this.store
      .pipe(select(fromPackaging.unsubscribeForSelectors))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        if (value === true) {
          this.isInitialized = false;
          this.destroySelectorSubject$.next();
        }
      });

    this.store
      .pipe(select(fromGeneralInformation.getGeneralInformationFormDetails))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        console.log(value.productApplication);

        this.packageContent.customerName = value.companyName;
        this.packageContent.intendedUseStatement = `${value.productApplication}`;
        value.productApplication === SharedConstants.finishProductFormulation ? (this.showAppendix = true) : (this.showAppendix = false);
      });
    //   this.packageContent.intendedUseStatement = `${value.productApplication} ${
    //     value.productApplication === SharedConstants.finishProductFormulation
    //       ? this.regionService.language['packageContentAppendix1'] + '\n' + this.regionService.language['packageContentAppendix2']
    //       : ''
    //   }`;
    // });

    this.formualtionStore.pipe(select(fromFormulation.getProductName)).subscribe(value => {
      this.packageContent.productName = value;
    });
  }

  private initializeStoreSubscribers() {
    this.store
      .pipe(select(fromPackaging.getPackagingTypes))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        if (this.formDetails.length > 0) {
          this.formDetails[this.activeIndex].packagingTypes = value;
          this.packagingTypesSubject.next(this.activeIndex);
        }
      });

    this.store
      .pipe(select(fromPackaging.getPackagingOptions))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        if (this.formDetails.length > 0) {
          this.formDetails = this.formDetails.map(item => {
            if (item.packagingIndex === this.activeIndex) {
              item.packagingOptions = value;
            }
            return item;
          });

          this.packagingOptionsSubject.next(this.activeIndex);
        }
      });

    this.store
      .pipe(select(fromPackaging.getOuterPackagings))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        if (this.formDetails.length > 0) {
          this.formDetails[this.activeIndex].outerPackagings = value;
          this.outerPackagingSubject.next(this.activeIndex);
        }
      });

    this.store
      .pipe(select(fromPackaging.getFillVolumeRanges))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        if (this.formDetails.length > 0) {
          this.formDetails = this.formDetails.map(item => {
            if (item.packagingIndex === this.activeIndex) {
              item.fillVolumeRanges = value;
            }
            return item;
          });

          this.fillVolumeRangesSubject.next(this.activeIndex);
        }
      });
  }

  //#region dispatch actions

  addNewPackage(isPackageManuallyAdded?: boolean): void {
    this.store.dispatch(new AddNumberPackage());
    if (isPackageManuallyAdded) {
      this.initializePackagingDetails();
    }
  }

  initializePackagingDetails(): void {
    if (!this.navigationService.checkVisitStatus(SharedConstants.pageDetails.packaging.path)) {
      this.store.dispatch(new GetPackagingTypes());
      this.hasVisited = false;
    } else {
      this.hasVisited = true;
    }
  }

  updateStore(value: any, fieldName: string, packagingIndex: number): void {
    this.store.dispatch(
      new UpdateModel({
        value: value,
        name: fieldName,
        packagingIndex: packagingIndex
      })
    );
  }

  getPackagingTypeDependentOptions(packagingType: string, activeIndex: number): void {
    this.activeIndex = activeIndex;
    this.store.dispatch(
      new GetPackagingOptions({
        packagingType: packagingType,
        activeIndex: this.activeIndex
      })
    );
  }

  getPackagingOptioneDependentOptions(packagingOption: string, activeIndex: number): void {
    this.activeIndex = activeIndex;
    this.store.dispatch(
      new GetOuterPackagings({
        packagingOption: packagingOption,
        activeIndex: this.activeIndex
      })
    );
  }

  getFillVolumeValidRange(outerPackaging: string, activeIndex: number): void {
    this.activeIndex = activeIndex;
    this.store.dispatch(
      new GetFillVolumeValidRange({
        outerPackaging: outerPackaging,
        activeIndex: this.activeIndex
      })
    );
  }

  //#endregion

  setPageValidStatus(pageType: string, hasErrors: boolean) {
    if (this.navigationService.hasVisitedNextPage(pageType)) {
      this.navigationService.setPageValidStatus(pageType, hasErrors);
    }
  }

  resetRestriction(): void {
    this.store.dispatch(new ResetRestriciton());
  }
}
