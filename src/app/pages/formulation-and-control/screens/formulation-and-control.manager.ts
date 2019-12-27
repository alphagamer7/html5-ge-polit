import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { Observable, Observer, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';

import { NavigationService } from 'src/app/shared/services/navigation.service';

import * as fromFormulation from 'src/app/shared/store/reducers/formulation-and-control.reducer';

import {
  GetChemicalFormulations,
  ClearFilterChemicalFormulations,
  FilterChemicalFormulations,
  UpdateSelectedFormulations,
  UpdateFormulationItemDetails,
  DeleteFormulationItem,
  GetQualityControlTests,
  UpdateQualityControlTests,
  SetProductName
} from 'src/app/shared/store/actions/formulation-and-control.action';
import { ChemicalFormulationDetails } from 'src/app/shared/types/chemical-formulation.type';
import { QualityControlTest } from 'src/app/shared/types/quality-control-test.type';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';
import { FormulationService } from 'src/app/shared/services/component-services/formulation-and-control.service';
import { CNSelectOption } from 'src/app/shared/types/crm-input.type';
import { AlertService } from 'src/app/shared/services/alert.service';
import { RegionService } from '@comparenetworks/imsmart-web';
import { ResetPackagingStoreBasedOnConcentration } from 'src/app/shared/store/actions/packaging.action';

export class FormulationManager {
  fields: {};
  isInitialized: boolean;
  productName: string;
  formDetails: any;
  productType: string;
  hasPackageRestrictions: boolean;
  hasAllowedConcentration: boolean;
  formulations$: Observable<CNSelectOption[]>;
  formulationsSubject: BehaviorSubject<CNSelectOption[]>;
  filteredFormulations$: Observable<ChemicalFormulationDetails[]>;
  filteredFormulationsSubject: BehaviorSubject<ChemicalFormulationDetails[]>;
  selectedFormulations$: Observable<ChemicalFormulationDetails[]>;
  selectedFormulationsSubject: BehaviorSubject<ChemicalFormulationDetails[]>;
  selectedQualityTests$: Observable<QualityControlTest[]>;
  selectedQualityTestsSubject: BehaviorSubject<QualityControlTest[]>;

  private selectedFormulations: ChemicalFormulationDetails[];
  private filteredFormulations: ChemicalFormulationDetails[];
  private selectedQualityTests: QualityControlTest[];
  private destroySelectorSubject$: Subject<void> = new Subject();

  fieldKeys = SharedConstants.pageDetails.formulation.fieldKeys;

  constructor(
    private navigationService: NavigationService,
    private store: Store<fromFormulation.FormulationState>,
    private formulationService: FormulationService,
    private alertService: AlertService,
    private regionService: RegionService
  ) {
    this.filteredFormulations = [];
    this.selectedFormulations = [];
    this.selectedQualityTests = [];

    this.formulationsSubject = new BehaviorSubject([]);
    this.formulations$ = this.formulationsSubject.asObservable();

    this.filteredFormulationsSubject = new BehaviorSubject([]);
    this.filteredFormulations$ = this.filteredFormulationsSubject.asObservable();

    this.selectedFormulationsSubject = new BehaviorSubject([]);
    this.selectedFormulations$ = this.selectedFormulationsSubject.asObservable();

    this.selectedQualityTestsSubject = new BehaviorSubject([]);
    this.selectedQualityTests$ = this.selectedQualityTestsSubject.asObservable();

    this.fields = {
      chemicalFormulationSearchInput: {
        name: this.fieldKeys.chemicalFormulationSearchInput,
        type: SharedConstants.inputFieldTypes.text,
        label: this.fieldKeys.chemicalFormulationSearchInput,
        placeholder: 'search',
        trimNotRequired: true
      },
      chemicalFormulation: {
        name: this.fieldKeys.chemicalFormulation,
        type: SharedConstants.inputFieldTypes.list,
        label: this.fieldKeys.chemicalFormulation
      },
      filterCategories: {
        name: this.fieldKeys.filterCategories,
        type: SharedConstants.inputFieldTypes.select,
        interface: SharedConstants.inputFieldTypes.interfaceType
      },
      productName: {
        name: this.fieldKeys.productName,
        type: SharedConstants.inputFieldTypes.text,
        label: this.fieldKeys.productName,
        placeholder: 'productNameplaceholder',
        trimNotRequired: true
      },
      qualityControlTest: {
        name: this.fieldKeys.qualityControlTest,
        type: SharedConstants.inputFieldTypes.select,
        label: this.fieldKeys.qualityControlTest,
        placeholder: 'startTypying',
        interface: SharedConstants.inputFieldTypes.interfaceType
      },
      controlTest: {
        name: this.fieldKeys.controlTest,
        type: SharedConstants.inputFieldTypes.select,
        label: this.fieldKeys.controlTest,
        placeholder: 'qualityControlTest',
        interface: SharedConstants.inputFieldTypes.interfaceType
      }
    };

    this.subscribeToStore();
  }

  init(pageType: string): Observable<void> {
    return new Observable<void>((observer: Observer<void>) => {
      this.productType = this.formulationService.productType;
      if (!this.navigationService.checkVisitStatus(pageType)) {
        this.navigationService.initialNavigation(pageType);
        this.isInitialized = true;
        observer.next(null);
        observer.complete();
      } else {
        observer.next(null);
        observer.complete();
      }
    });
  }

  private subscribeToStore() {
    this.store
      .pipe(select(fromFormulation.getChemicalFormulations))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        this.fields[this.fieldKeys.chemicalFormulation].options = value;
        this.formulationsSubject.next(value);
      });

    this.store
      .pipe(select(fromFormulation.getQualityControlTestOptions))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        this.fields[this.fieldKeys.controlTest].options = value;
      });

    this.store
      .pipe(select(fromFormulation.getFilteredFormulations))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .distinctUntilChanged()
      .subscribe(value => {
        const updatedValues = [];
        value.forEach(item => {
          if (this.selectedFormulations.filter(record => record.id === item.id).length > 0) {
            item.isSelected = true;
          }
          updatedValues.push(item);
        });

        this.filteredFormulations = updatedValues;
        this.filteredFormulationsSubject.next(this.filteredFormulations);
      });

    this.store
      .pipe(select(fromFormulation.getSelectedFormulations))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        this.selectedFormulations = value;
        this.selectedFormulationsSubject.next(this.selectedFormulations);
      });

    this.store
      .pipe(select(fromFormulation.getSelectedQualityControlTests))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        this.selectedQualityTests = value;
        this.selectedQualityTestsSubject.next(this.selectedQualityTests);
      });

    this.store
      .pipe(select(fromFormulation.unsubscribeForSelectors))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        if (value === true) {
          this.destroySelectorSubject$.next();
        }
      });

    this.store
      .pipe(select(fromFormulation.getProductName))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        this.fields[this.fieldKeys.productName]['value'] = value;
        this.productName = value;
      });

    this.store
      .pipe(select(fromFormulation.getHasRestriction))
      .pipe(takeUntil(this.destroySelectorSubject$))
      .subscribe(value => {
        if (this.hasPackageRestrictions !== value) {
          this.hasPackageRestrictions = value;
          if (this.hasPackageRestrictions && this.navigationService.hasVisitedNextPage(SharedConstants.pageDetails.formulation.path) && this.isInitialized) {
            this.alertService.presentAlert(
              this.regionService.language['warning'],
              this.regionService.language['resetPackaging'],
              [this.regionService.language['confirmation']],
              'alert-info'
            );
            this.store.dispatch(new ResetPackagingStoreBasedOnConcentration());
            this.setPageValidStatus(SharedConstants.pageDetails.packaging.path, true);
          }
        }
      });
  }

  //#region dispatch actions
  //#region formulations
  getChemicalFormulationsBasedOnCategory(category: string, searchInput: string): void {
    this.store.dispatch(
      new GetChemicalFormulations({
        category,
        searchInput
      })
    );
  }

  filterChemicalFormulations(filter: string, filterOptions?: any, limit?: number, offset?: number, clearStore?: boolean): void {
    if (clearStore) {
      this.store.dispatch(new ClearFilterChemicalFormulations());
    }
    this.store.dispatch(
      new FilterChemicalFormulations({
        filter,
        filterOptions,
        limit,
        offset
      })
    );
  }

  updateSelectedFormulations(selectedItems: any) {
    this.store.dispatch(
      new UpdateSelectedFormulations({
        selectedItems
      })
    );
  }

  updateFormulationItemDetails(item: any, value: any, fieldName: string): void {
    this.store.dispatch(
      new UpdateFormulationItemDetails({
        id: item.id,
        value,
        fieldName
      })
    );
  }

  deleteRecord(id: string): void {
    this.store.dispatch(
      new DeleteFormulationItem({
        id
      })
    );
  }

  //#endregion

  //#region qualityControl
  getQualityControlTests(): void {
    this.store.dispatch(new GetQualityControlTests({}));
  }

  updateQualityControlTest(value: QualityControlTest[]) {
    this.store.dispatch(new UpdateQualityControlTests(value));
  }

  //#endregion

  setProductName(productName: string): void {
    this.store.dispatch(
      new SetProductName({
        productName
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
