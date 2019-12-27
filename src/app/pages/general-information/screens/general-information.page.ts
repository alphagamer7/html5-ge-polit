import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';

import { takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';

import { RegionService } from '@comparenetworks/imsmart-web';

import { FormControlObject, CRMFormService } from 'src/app/shared/services/crm-form.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { GeneralInformationManager } from './general-information.manager';

import * as fromGeneralInformation from '../../../shared/store/reducers/general-information.reducer';

import { BaseComponent } from 'src/app/base.component';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';
import { ProductType, ProductionType } from 'src/app/shared/constants/shared-enum';

@Component({
  selector: 'general-information',
  templateUrl: './general-information.page.html',
  styleUrls: ['./general-information.page.scss']
})
export class GeneralInformationPage extends BaseComponent implements OnInit {
  pageType: string;
  fields: {};
  fieldKeys: any;
  generalInformationForm: FormGroup;
  formIsReady: boolean;
  isFormValid: boolean;
  isLocationEnabled: boolean;
  showWarnings: boolean;
  locationSelection: boolean;
  revisit: boolean;
  isPowderSelected: boolean;

  productTypes = ProductType;
  productionTypes = ProductionType;

  customPopoverOptions: any = {
    cssClass: SharedConstants.cssClass.col50
  };

  objectKeys = Object.keys;

  private generalInformationFormControlObject: FormControlObject;
  private generalInformationManager;
  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private crmFormService: CRMFormService,
    private regionService: RegionService,
    private navigationService: NavigationService,
    private store: Store<fromGeneralInformation.GeneralInformationState>,
    private alertService: AlertService,
    private ngZone: NgZone
  ) {
    super();
    (this.generalInformationManager = new GeneralInformationManager(navigationService, store, alertService, regionService)),
      this.ngZone.run(() => {
        this.isFormValid = false;
        this.formIsReady = false;
      });

    this.pageType = this.activatedRoute.snapshot.routeConfig.path;

    this.generalInformationManager.init(this.pageType).subscribe(() => {
      this.fields = this.generalInformationManager.fields;
      this.fieldKeys = this.generalInformationManager.fieldKeys;

      this.buildForm();
    });
  }

  ngOnInit(): void {
    this.generalInformationManager.resetChildFields$.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
      if (val) {
        if (val.reset) {
          this.generalInformationForm.get(this.fieldKeys.productionType).setValue(_.keys(ProductionType)[1]);

          this.generalInformationForm.get(this.fieldKeys.productApplication).reset();
          // when field is resetted, value is null. subscriber is not updating. have to manually update
          this.generalInformationManager.updateStore('', this.fieldKeys.productApplication);
        } else {
          this.generalInformationManager.isManuallyChanging = true;
          this.generalInformationForm.get(this.fieldKeys.productType).setValue(val.value);
        }
        this.isPowderSelected = val.value === _.keys(ProductType)[1] ? true : false;
      }
    });
  }

  //#region  form

  private updateForm(): void {
    setTimeout(() => {
      const valid: boolean = this.generalInformationForm.valid;

      if (valid) {
        this.isFormValid = true;
        this.revisit = true;
      }
      if (this.revisit) {
        this.isFormValid = valid;
      }

      this.generalInformationManager.setPageValidStatus(this.pageType, !this.isFormValid);
    }, 100);
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
    switch (field.type) {
      case SharedConstants.inputFieldTypes.select:
        if (field.options && field.options.length > 0) {
          pageFormControlObject[field.name] = this.crmFormService.initializeSelectOptions(
            field,
            pageFormControlObject,
            this.generalInformationManager.formDetails
          );
        }
        break;
      case SharedConstants.inputFieldTypes.radio:
        pageFormControlObject[field.name] = this.crmFormService.initializeRadioValues(
          field,
          pageFormControlObject,
          this.generalInformationManager.formDetails
        );
        break;
      case SharedConstants.inputFieldTypes.text:
        pageFormControlObject[field.name] = this.crmFormService.initializeTextFieldValues(
          field,
          pageFormControlObject,
          this.generalInformationManager.formDetails
        );
        break;
    }

    return pageFormControlObject[field.name];
  }

  private subscribeFormChanges(pageFormControlObject: FormControlObject, field: any) {
    pageFormControlObject[field.name].valueChanges.subscribe((value: any) => {
      if (value != null) {
        switch (field.type) {
          case SharedConstants.inputFieldTypes.select:
            this.generalInformationManager.updateStore(value[SharedConstants.options.value], field.name);
            if (value[SharedConstants.options.value] === SharedConstants.finishProductFormulation) {
              this.generalInformationManager.handleProductApplication();
            }
            break;
          case SharedConstants.inputFieldTypes.radio:
            this.generalInformationManager.updateStore(value, field.name);
            break;
          case SharedConstants.inputFieldTypes.text:
            this.generalInformationManager.updateStore(value.trim(), field.name);
            break;
        }
      }
      this.updateForm();
    });
  }

  private buildForm(): void {
    this.generalInformationFormControlObject = this.generateFormControlObj();
    this.generalInformationForm = this.formBuilder.group(this.generalInformationFormControlObject);
    setTimeout(() => {
      this.formIsReady = true;
      this.updateForm();
    }, 600);
  }

  //#endregion

  handleLocationSelect(event) {
    this.generalInformationForm.controls[this.fieldKeys.manufacturingLocation].setValue(event);
  }

  handleButtonClicked(event) {
    this.showWarnings = true;
  }

  handleShowWarningsOnBreadcrumbNavigation(event) {
    if (event.pageType === this.pageType) {
      this.showWarnings = true;
    }
  }
}
