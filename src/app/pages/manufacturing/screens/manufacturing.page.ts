import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';

import * as _ from 'lodash';
import { RegionService } from '@comparenetworks/imsmart-web';

import { BaseComponent } from 'src/app/base.component';

import { ManufacturingManger } from './manufacturing.manager';

import { FormControlObject, CRMFormService } from 'src/app/shared/services/crm-form.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';

import { ManufacturingState } from 'src/app/shared/store/reducers/manufacturing.reducer';

import { Confirmation, ProductType } from 'src/app/shared/constants/shared-enum';
import { SharedConstants } from 'src/app/shared/constants/shared-constants';
import { ManufacturingService } from '../../../shared/services/component-services/manufacturing.service';

@Component({
  selector: 'manufacturing',
  templateUrl: './manufacturing.page.html',
  styleUrls: ['./manufacturing.page.scss']
})
export class ManufacturingPage extends BaseComponent implements OnDestroy {
  pageType: string;
  fields: {};
  fieldKeys: any;
  manufacturingnForm: FormGroup;
  formIsReady: boolean;
  isFormValid: boolean;
  showWarnings: boolean;

  confirmations = Confirmation;

  objectKeys = Object.keys;

  private manufacturingFormControlObject: FormControlObject;
  private manufacturingManger;

  customPopoverOptions: any = {
    cssClass: SharedConstants.cssClass.col50
  };

  customPopoverOptions25: any = {
    cssClass: SharedConstants.cssClass.col25
  };

  customPopoverOptions35: any = {
    cssClass: SharedConstants.cssClass.col35
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private crmFormService: CRMFormService,
    private regionService: RegionService,
    private navigationService: NavigationService,
    private store: Store<ManufacturingState>,
    private manufacturingService: ManufacturingService
  ) {
    super();
    this.manufacturingManger = new ManufacturingManger(navigationService, store, crmFormService, manufacturingService);

    this.isFormValid = false;

    this.pageType = this.activatedRoute.snapshot.routeConfig.path;

    this.manufacturingManger.init(this.pageType).subscribe(() => {
      this.fields = this.manufacturingManger.fields;
      this.fieldKeys = this.manufacturingManger.fieldKeys;

      this.buildForm();
    });
  }

  //#region form

  private updateForm(): void {
    setTimeout(() => {
      const valid: boolean = this.manufacturingnForm.valid;

      if (valid) {
        this.isFormValid = true;
      }

      this.manufacturingManger.setPageValidStatus(this.pageType, !this.isFormValid);
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
            this.manufacturingManger.formDetails
          );

          if (field.name === this.fieldKeys.poreSize && this.manufacturingManger.productType === _.keys(ProductType)[1]) {
            pageFormControlObject[field.name].disable();
          }
        }
        break;
      case SharedConstants.inputFieldTypes.radio:
        pageFormControlObject[field.name] = this.crmFormService.initializeRadioValues(
          field,
          pageFormControlObject,
          this.manufacturingManger.formDetails
        );
        break;
      case SharedConstants.inputFieldTypes.text:
        pageFormControlObject[field.name] = this.crmFormService.initializeTextFieldValues(
          field,
          pageFormControlObject,
          this.manufacturingManger.formDetails
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
            if (field.name === this.fieldKeys.manufacturingType) {
              this.manufacturingManger.getManufacturingTypeInfoBasedOnTypeId(value[SharedConstants.options.index]);
            }
            this.manufacturingManger.updateStore(value[SharedConstants.options.value], field.name);
            break;

          case SharedConstants.inputFieldTypes.text:
            this.manufacturingManger.updateStore(value.trim(), field.name);
            break;
          case SharedConstants.inputFieldTypes.radio:
            this.manufacturingManger.updateStore(value, field.name);
            break;
        }

        this.updateForm();
      }
    });
  }

  private buildForm(): void {
    this.manufacturingFormControlObject = this.generateFormControlObj();
    this.manufacturingnForm = this.formBuilder.group(this.manufacturingFormControlObject);
    setTimeout(() => {
      this.formIsReady = true;
      this.updateForm();
    }, 600);
  }

  //#endregion

  handleButtonClicked(event) {
    this.showWarnings = true;
  }

  handleShowWarningsOnBreadcrumbNavigation(event) {
    if (event.pageType === this.pageType) {
      this.showWarnings = true;
    }
  }

  ngOnDestroy() {
    this.manufacturingManger.productType = undefined;
  }
}
