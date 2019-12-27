import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

import { ModalController } from '@ionic/angular';

import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { RegionService } from '@comparenetworks/imsmart-web';

import * as fromFormulation from 'src/app/shared/store/reducers/formulation-and-control.reducer';

import { FormControlObject, CRMFormService } from 'src/app/shared/services/crm-form.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { FormulationManager } from 'src/app/pages/formulation-and-control/screens/formulation-and-control.manager';
import { FormulationService } from 'src/app/shared/services/component-services/formulation-and-control.service';

import { FormulationLookupComponent } from '../components/formulation-lookup/formulation-lookup.component';
import { BaseComponent } from 'src/app/base.component';

import { CrmDataTableHeader } from 'src/app/shared/types/crm-datatable.type';
import { ChemicalFormulationDetails } from 'src/app/shared/types/chemical-formulation.type';
import { QualityControlTest } from 'src/app/shared/types/quality-control-test.type';
import { ValidationStatus } from 'src/app/types/validationStatus';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';
import { FilterCategory, TypeOfData, LiquidConcentrationUnit, PowderConcentrationUnit, ProductType } from 'src/app/shared/constants/shared-enum';

@Component({
  selector: 'formulation-and-control',
  templateUrl: './formulation-and-control.page.html',
  styleUrls: ['./formulation-and-control.page.scss']
})
export class FormulationAndControlPage extends BaseComponent implements OnInit, OnDestroy {
  pageType: string;
  fields: {};
  fieldKeys: any;
  concentrationUnits: any;
  formIsReady: boolean;
  isFormValid: boolean;
  isModalOpen: boolean;
  hasMoreRecords: boolean;
  showWarnings: boolean;
  disableScroll: boolean;
  hasValidationErrors: boolean;
  isFetching: boolean;
  formulationForm: FormGroup;
  formulationTableHeaders: CrmDataTableHeader[];
  qualityControlTestHeaders: CrmDataTableHeader[];
  selectedQualityControl: QualityControlTest[];
  selectedFormulations: ChemicalFormulationDetails[];
  validationStatus: ValidationStatus;
  filteredFormulations: ChemicalFormulationDetails[];

  private formulationFormControlObject: FormControlObject;
  private hasSelectedFormulations: boolean;
  private searchString: string;
  private searchType: string;

  private formulationManager: FormulationManager;
  collapseItem = {
    collapseChemical: false,
    collapseQualityControl: false
  };

  qualityControlOptions;

  objectKeys = Object.keys;
  searchCategories = FilterCategory;

  customPopoverOptions35: any = {
    cssClass: SharedConstants.cssClass.col35
  };
  customPopoverOptions100: any = {
    cssClass: SharedConstants.cssClass.col100
  };

  constructor(
    private modalCtrl: ModalController,
    private regionService: RegionService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private crmFormService: CRMFormService,
    private alertService: AlertService,
    private utilityService: UtilityService,
    private navigationService: NavigationService,
    private store: Store<fromFormulation.FormulationState>,
    private formulationService: FormulationService
  ) {
    super();
    this.formulationManager = new FormulationManager(navigationService, store, formulationService, alertService, regionService);

    this.pageType = this.activatedRoute.snapshot.routeConfig.path;
    this.formulationManager.init(this.pageType).subscribe(() => {
      this.fields = this.formulationManager.fields;
      this.fieldKeys = this.formulationManager.fieldKeys;
      this.buildForm();
    });

    this.formulationTableHeaders = this.utilityService.getTableHeaderElements(SharedConstants.formulationTableHeaders);
    this.qualityControlTestHeaders = this.utilityService.getTableHeaderElements(SharedConstants.qualityControlTestHeaders);

    this.filteredFormulations = [];
    this.selectedQualityControl = [];
  }

  ngOnInit(): void {
    this.formulationManager.formulations$.pipe(takeUntil(this.destroySubject$)).subscribe(items => {
      if (items && this.formIsReady) {
        this.isFetching = false;
      }
    });

    this.formulationManager.filteredFormulations$.pipe(takeUntil(this.destroySubject$)).subscribe(items => {
      if (items && items.length > 0 && this.formIsReady) {
        const nonSelectedItems = items.filter(itm => itm.isSelected !== true);

        if (nonSelectedItems.length > 0) {
          this.filteredFormulations = nonSelectedItems;
          this.openModal(this.searchString);
        } else {
          this.alertService.presentAlert(
            this.regionService.language['warning'],
            this.regionService.language['alreadExist'],
            [this.regionService.language['confirmation']],
            'alert-info'
          );
        }
      }
    });

    this.formulationManager.selectedFormulations$.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
      this.selectedFormulations = val;
      if (val.length > 0) {
        this.hasSelectedFormulations = true;
        this.formulationForm.controls['controlTest'].enable();
      } else {
        this.hasSelectedFormulations = false;
        this.formulationForm.controls['controlTest'].disable();
      }
      if (this.hasSelectedFormulations && !this.fields[this.fieldKeys.controlTest].options.length) {
        // Get Quality Test options only when hasSelectedFormulations is true
        this.formulationManager.getQualityControlTests();
      }
    });

    this.formulationManager.selectedQualityTests$.pipe(takeUntil(this.destroySubject$)).subscribe(value => {
      this.selectedQualityControl = value;
    });

    this.concentrationUnits = this.formulationManager.productType === _.keys(ProductType)[0] ? LiquidConcentrationUnit : PowderConcentrationUnit;
  }

  private handleCollapse(collapseItem: string) {
    this.collapseItem[collapseItem] = !this.collapseItem[collapseItem];
  }

  //#region form
  private updateForm(): void {
    if (this.validationStatus && this.formIsReady) {
      if (this.selectedQualityControl.length && (!this.validationStatus.formulation && !this.validationStatus.quality) && this.hasSelectedFormulations) {
        this.isFormValid = true;
      } else {
        this.isFormValid = false;
      }

      this.formulationManager.setPageValidStatus(this.pageType, !this.isFormValid);
    }
  }

  private generateFormControlObj(): FormControlObject {
    const pageFormControlObject: FormControlObject = {};

    _.keys(this.fields).forEach((fieldKey: string) => {
      pageFormControlObject[this.fields[fieldKey].name] = this.crmFormService.buildFormControl(this.fields[fieldKey]);

      pageFormControlObject[this.fields[fieldKey].name] = this.initializeValues(pageFormControlObject, this.fields[fieldKey]);

      this.subscribeFormChanges(pageFormControlObject, this.fields[fieldKey]);
    });
    return pageFormControlObject;
  }

  private initializeValues(pageFormControlObject: FormControlObject, field: any): any {
    if (field.type === SharedConstants.inputFieldTypes.select && field.name === this.fieldKeys.filterCategories) {
      pageFormControlObject[field.name].setValue(_.keys(this.searchCategories)[0]);
    }
    if (field.name === this.fieldKeys.productName) {
      pageFormControlObject[field.name].setValue(this.fields[field.name]['value']);
    }

    return pageFormControlObject[field.name];
  }

  private subscribeFormChanges(pageFormControlObject: FormControlObject, field: any) {
    pageFormControlObject[field.name].valueChanges.subscribe((value: any) => {
      if (value != null) {
        switch (field.type) {
          case SharedConstants.inputFieldTypes.text:
            if (field.name === this.fieldKeys.chemicalFormulationSearchInput) {
              this.isFetching = true;
              this.searchString = value;
              this.disableScroll = true;
              if (value.trim().length) {
                this.formulationManager.getChemicalFormulationsBasedOnCategory(this.formulationForm.get(this.fieldKeys.filterCategories).value, value.trim());
              }
            }
            if (field.name === this.fieldKeys.productName) {
              this.formulationManager.setProductName(value.trim());
            }
            break;

          case SharedConstants.inputFieldTypes.select:
            if (field.name === this.fieldKeys.filterCategories) {
              this.formulationManager.getChemicalFormulationsBasedOnCategory(
                value,
                this.formulationForm.get(this.fieldKeys.chemicalFormulationSearchInput).value
              );
            }

            if (field.name === this.fieldKeys.controlTest) {
              // Dummy values until real values are given
              if (this.isMaxQualityControlSelected(value)) {
                this.alertService.presentAlert(
                  this.regionService.language['warning'],
                  `${this.regionService.language['warningMaxQualityInit']} ${value['qualityControlTest'].toLowerCase()} ${
                    this.regionService.language['warningMaxQualityEnd']
                  }`,
                  [this.regionService.language['confirmation']],
                  'alert-info'
                );
              } else if (!this.isQualityControlTestExist(value, '')) {
                const dropDownVal = { ...value };

                dropDownVal['typeOfData'] = '';
                dropDownVal['handleSpecificationError'] = true;
                dropDownVal['specification'] = '';
                this.selectedQualityControl = [dropDownVal, ...this.selectedQualityControl];

                this.formulationManager.updateQualityControlTest(this.selectedQualityControl);
                if (this.collapseItem[SharedConstants.contentCollapseTypes.collapseQualityControl]) {
                  this.handleCollapse(SharedConstants.contentCollapseTypes.collapseQualityControl);
                }
                this.updateForm();
              } else {
                this.alertService.presentAlert(
                  this.regionService.language['warning'],
                  `${this.regionService.language['warningQualityNoType']} ${value['qualityControlTest'].toLowerCase()} ${this.regionService.language['test']} `,
                  [this.regionService.language['confirmation']],
                  'alert-info'
                );
              }

              this.formulationForm.get(this.fieldKeys.controlTest).reset();
            }
            break;
        }
      }
    });
  }

  private buildForm(): void {
    this.formulationFormControlObject = this.generateFormControlObj();
    this.formulationForm = this.formBuilder.group(this.formulationFormControlObject);
    setTimeout(() => {
      this.formIsReady = true;
      this.updateForm();
    }, 600);
  }

  isMaxQualityControlSelected(value) {
    // if selected items are greater than 1(2 already selected) give warning
    return _.filter(this.selectedQualityControl, obj => obj['qualityControlTest'] === value['qualityControlTest']).length > 1;
  }

  handleValidationError(event) {
    if (event.validationType === SharedConstants.validationStatus.quality) {
      this.validationStatus = { ...this.validationStatus, quality: _.values(event)[0] };
    } else {
      this.validationStatus = { ...this.validationStatus, formulation: _.values(event)[0] };
    }

    this.updateForm();
  }

  //#endregion

  //#region quality control tests
  handleQualityTestDelete(item: any): void {
    this.alertService.presentCancellationAlert(() => {
      this.selectedQualityControl = this.selectedQualityControl.filter(
        itm => !(itm.qualityControlTest === item.qualityControlTest && itm.typeOfData === item.typeOfData)
      );
      this.formulationManager.updateQualityControlTest(this.selectedQualityControl);
      this.updateForm();
    });
  }

  handleTypeDataSelection(event: any): void {
    if (!this.isQualityControlTestExist(event.item, event.typeOfData.trim())) {
      this.selectedQualityControl = this.selectedQualityControl.map((itm, index) => {
        if (itm.qualityControlTest === event.item.qualityControlTest && event.index === index) {
          itm.typeOfData = event.typeOfData.trim();
        }
        return itm;
      });

      this.formulationManager.updateQualityControlTest(this.selectedQualityControl);
    } else {
      this.alertService.presentAlert(
        this.regionService.language['warning'],
        `${this.regionService.language['warningQualityExistInit']} ${event.item.qualityControlTest.toLowerCase()} ${
          this.regionService.language['warningQualityExistMid']
        } ${event.typeOfData.toLowerCase()} ${this.regionService.language['warningQualityExistEnd']} `,
        [this.regionService.language['confirmation']],
        'alert-info'
      );
    }
  }

  handleSpecification(event) {
    this.selectedQualityControl = this.selectedQualityControl.map((itm, index) => {
      if (itm.qualityControlTest === event.item.qualityControlTest && event.index === index) {
        itm.specification = event.specification;
        itm.handleSpecificationError = false;
      }
      return itm;
    });

    this.formulationManager.updateQualityControlTest(this.selectedQualityControl);
  }

  private isQualityControlTestExist(value: any, typeOfData: string): boolean {
    return (
      this.selectedQualityControl.filter(
        specification => specification.qualityControlTest === value.qualityControlTest && specification.typeOfData === typeOfData
      ).length > 0
    );
  }

  //#endregion

  //#region formulations
  selectSearchResult(value: any) {
    this.disableScroll = false;

    if (value[SharedConstants.tableRelatedColumnNames.isAllowed].toString() !== '1') {
      this.alertService.presentAlert(
        this.regionService.language['chemicalFormulationNotAllowed'],
        `${this.regionService.language['notAllowedHeader']} "${value['chemicalName'].toLowerCase()}"  ${this.regionService.language['notAllowedTail']}`,
        [this.regionService.language['confirmation']],
        'alert-info'
      );
    } else {
      // modal header title
      this.searchString = this.formulationForm.get(this.fieldKeys.chemicalFormulationSearchInput).value;

      this.searchType =
        this.formulationForm.get(this.fieldKeys.filterCategories).value === FilterCategory.allCategories
          ? 'all'
          : value[this.formulationForm.get(this.fieldKeys.filterCategories).value];
      // get formulations for modal
      const filter =
        this.formulationForm.get(this.fieldKeys.filterCategories).value === FilterCategory.allCategories
          ? ''
          : value[this.formulationForm.get(this.fieldKeys.filterCategories).value];

      const filterOptions =
        this.formulationForm.get(this.fieldKeys.filterCategories).value === FilterCategory.allCategories
          ? this.getCustomHeaders(true).map(header => {
              if (value[header.key] != null) {
                return { name: header.key, value: value[header.key] };
              }
            })
          : [];

      this.formulationManager.filterChemicalFormulations(filter, filterOptions, null, null, true);
    }
  }

  showModal() {
    this.isFetching = false;
    if (this.searchString && this.searchString.length) {
      this.isModalOpen = true;
      this.openModal(this.searchString, true);
    }
  }

  async openModal(value: string, isKeyPressed?: boolean) {
    this.isModalOpen = true;
    const initialFormula = [...this.selectedFormulations];
    const modal = await this.modalCtrl.create({
      component: FormulationLookupComponent,
      componentProps: {
        selectedFormulations: this.selectedFormulations,
        searchText: value,
        headers: this.getCustomHeaders(false),
        productType: this.formulationManager.productType,
        filteredFormulations: isKeyPressed ? this.fields[this.fieldKeys.chemicalFormulation].options : this.filteredFormulations,
        formulationManager: this.formulationManager,
        searchType: this.searchType
      },
      backdropDismiss: false,
      cssClass: 'full-width-modal'
    });

    modal.onDidDismiss().then(data => {
      // this.searchString = '';
      if (data.data) {
        this.formulationManager.updateSelectedFormulations(data.data);
        if (this.collapseItem[SharedConstants.contentCollapseTypes.collapseChemical]) {
          this.handleCollapse(SharedConstants.contentCollapseTypes.collapseChemical);
        }
        this.updateForm();
      }
      this.showWarnings = false;
      // Clear search value on modal dismiss
      if (this.selectedFormulations.length > initialFormula.length) {
        this.formulationForm.controls[this.fields[this.fieldKeys.chemicalFormulationSearchInput].name].setValue('');
      } else {
        this.formulationForm.controls[this.fields[this.fieldKeys.chemicalFormulationSearchInput].name].setValue(value);
      }

      this.isModalOpen = false;
      this.disableScroll = false;
    });

    return await modal.present();
  }

  //#region selected formulation actions
  handleConcentrationInputChamge(params: any) {
    this.formulationManager.updateFormulationItemDetails(params.item, params.concentration, SharedConstants.tableRelatedColumnNames.concentration);
  }

  handleSelectedUnitChange(params: any) {
    this.formulationManager.updateFormulationItemDetails(params.item, params.concentrationUnit, SharedConstants.tableRelatedColumnNames.unit);
  }

  handleDeleteRecord(event: any) {
    this.formulationManager.deleteRecord(event);
    this.updateForm();
    this.showWarnings = false;
  }
  //#endregion

  //#endregion

  getCustomHeaders(hasActionColumn: boolean) {
    return this.formulationTableHeaders.filter(header =>
      hasActionColumn
        ? header.key !== '' && header.key !== SharedConstants.tableRelatedColumnNames.concentration
        : header.key !== SharedConstants.tableRelatedColumnNames.concentration
    );
  }

  async handlePagination(event) {}

  handleButtonClicked(event) {
    this.showWarnings = event;
  }

  handleShowWarningsOnBreadcrumbNavigation(event) {
    if (event.pageType === this.pageType) {
      this.showWarnings = true;
    }
  }
}
