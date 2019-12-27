import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';

import { RegionService } from '@comparenetworks/imsmart-web';

import { CRMFormService, FormControlObject } from 'src/app/shared/services/crm-form.service';

import { ValidatorService } from 'src/app/shared/services/validator.service';
import { AlertService } from 'src/app/shared/services/alert.service';

import { Packaging } from 'src/app/shared/types/packaging.type';
import { CNSelectOption } from 'src/app/shared/types/crm-input.type';

import { BaseComponent } from 'src/app/base.component';

import { Confirmation } from 'src/app/shared/constants/shared-enum';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';
import { PackagingManager } from '../../screens/packaging.manager';

@Component({
  selector: 'packaging-details',
  templateUrl: './packaging-details.component.html',
  styleUrls: ['./packaging-details.component.scss']
})
export class PackagingDetailsComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() packagingFormDetails: Packaging;
  @Input() showWarnings: boolean;

  @Input() showAppendix: boolean;
  @Input() fields: {};
  @Input() fieldKeys: any;
  @Input() packagingManger: PackagingManager;
  @Input() hasRestrictions: boolean;
  @Input() hasAllowedConcentration: boolean;
  @Input() isNotNaoh: boolean;

  @Output() formStatusEvent = new EventEmitter<boolean>();
  @Output() updateStoreEvent = new EventEmitter<any>();
  @Output() getPackagingTypeDependentOptionsEvent = new EventEmitter<any>();
  @Output() getPackagingOptioneDependentOptionsEvent = new EventEmitter<any>();
  @Output() getFillVolumeValidRangeEvent = new EventEmitter<any>();

  isFormValid: boolean;
  packagingForm: FormGroup;
  formIsReady: boolean;
  firstEmit: boolean;
  showFillVolumeError: boolean;
  showBatchSizeError: boolean;
  fillvolumeErrorRange: string;
  packagingTypes: CNSelectOption[];
  packagingOptions: CNSelectOption[];
  outerPackagings: CNSelectOption[];
  fillVolumeRanges: string[];
  isInitializing: boolean;
  showManufacturingDate: boolean;
  isBottleSelected: boolean;

  private packagingFormControlObject: FormControlObject;
  private packageType: string;

  confirmations = Confirmation;

  packageFeildKeys = SharedConstants.packageContent;

  objectKeys = Object.keys;

  customPopoverOptions: any = {
    cssClass: SharedConstants.cssClass.col50
  };

  // temp until actual data
  packageContent: any;

  constructor(
    private formBuilder: FormBuilder,
    private crmFormService: CRMFormService,
    private regionService: RegionService,
    private validatorService: ValidatorService,
    private alertService: AlertService
  ) {
    super();

    this.isFormValid = false;

    this.packagingOptions = [];
    this.outerPackagings = [];
    this.packagingTypes = [];

    // temp until actual data
  }

  ngOnInit() {
    console.log('inited......');
    this.buildForm();
    this.subscribeOptionChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.packagingManger && changes.packagingManger.currentValue) {
      this.packageContent = this.packagingManger.packageContent;
    }
  }

  private subscribeOptionChanges() {
    this.packagingManger.packagingTypes$.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
      if (val > -1 && val === this.packagingFormDetails.packagingIndex) {
        this.packagingTypes = this.packagingManger.formDetails[val].packagingTypes;
      }
    });

    this.packagingManger.packagingOptions$.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
      if (val > -1 && val === this.packagingFormDetails.packagingIndex) {
        this.packagingOptions = this.packagingManger.formDetails[val].packagingOptions;

        if (this.hasAllowedConcentration && this.packagingOptions) {
          console.log('triggered');
          this.packagingOptions = this.packagingOptions.filter(option => option.value !== SharedConstants.bottomDrain);
        }
        if (!this.isNotNaoh && this.hasRestrictions && this.packagingOptions) {
          // if (this.packagingForm.get(this.fieldKeys.packagingOption).value) {
          //   this.alertService.presentAlert(this.regionService.language['warning'], 'reseting', [this.regionService.language['confirmation']], 'alert-info');
          // }
          this.reinitializeFields([this.fieldKeys.packagingOption, this.fieldKeys.outerPackaging, this.fieldKeys.fillVolume]);
          this.packagingManger.resetRestriction();
        }

        if (this.packagingOptions && this.packagingOptions.length === 0 && this.formIsReady) {
          this.isBottleSelected = false;
          this.alertService.presentAlert(
            this.regionService.language['warning'],
            this.regionService.language['packagingOptionsNotAvailable'],
            [this.regionService.language['confirmation']],
            'alert-info'
          );

          this.reinitializeFields([this.fieldKeys.packagingOption, this.fieldKeys.outerPackaging, this.fieldKeys.fillVolume]);
        } else {
          this.isBottleSelected = true;
          if (this.packagingForm && this.packagingOptions && this.packagingOptions.length) {
            this.enableFields([this.fieldKeys.packagingOption]);
          }
        }
      }
    });

    this.packagingManger.outerPackaging$.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
      if (val > -1 && val === this.packagingFormDetails.packagingIndex) {
        this.outerPackagings = this.packagingManger.formDetails[val].outerPackagings;
        if (
          this.packagingForm.get(this.fieldKeys.packagingOption).value &&
          this.packagingForm.get(this.fieldKeys.packagingOption).value !== '' &&
          this.outerPackagings &&
          this.outerPackagings.length === 0
        ) {
          this.reinitializeFields([this.fieldKeys.outerPackaging, this.fieldKeys.fillVolume]);
        } else {
          if (this.packagingForm && this.outerPackagings && this.outerPackagings.length) {
            this.enableFields([this.fieldKeys.outerPackaging]);
          }
        }
      }
    });

    this.packagingManger.fillVolumeRanges$.pipe(takeUntil(this.destroySubject$)).subscribe(val => {
      if (val > -1 && val === this.packagingFormDetails.packagingIndex) {
        this.fillVolumeRanges = this.packagingManger.formDetails[val].fillVolumeRanges;

        if (this.validatorService.isFillVolumeValid(val, this.fillVolumeRanges) || !val) {
          this.showFillVolumeError = false;
        } else {
          this.showFillVolumeError = true;
          this.fillvolumeErrorRange = this.fillVolumeRanges ? this.fillVolumeRanges.join(' | ') : '';
        }
      }
    });
  }

  //#region form
  private updateForm(): void {
    setTimeout(() => {
      const valid: boolean = this.packagingForm.valid && !this.showFillVolumeError && this.isBottleSelected;

      if (valid) {
        this.isFormValid = true;
        this.firstEmit = true;
        this.formStatusEvent.emit(this.isFormValid);
      }
      // Activate validators when page is revisited
      if (this.firstEmit) {
        this.formStatusEvent.emit(valid);
      }
    }, 100);
  }

  private generateFormControlObj(): FormControlObject {
    const pageFormControlObject: FormControlObject = {};

    this.isInitializing = true;
    this.initializeDropDownValues();

    _.keys(this.fields).forEach((fieldKey: string) => {
      pageFormControlObject[this.fields[fieldKey].name] = this.crmFormService.buildFormControl(this.fields[fieldKey]);

      this.initializeValues(pageFormControlObject, this.fields[fieldKey]);

      this.subscribeFormChanges(pageFormControlObject, this.fields[fieldKey]);
    });

    return pageFormControlObject;
  }

  private initializeDropDownValues() {
    this.packagingTypes = this.packagingFormDetails.packagingTypes ? this.packagingFormDetails.packagingTypes : [];
    this.packagingOptions = this.packagingFormDetails.packagingOptions ? this.packagingFormDetails.packagingOptions : [];
    this.outerPackagings = this.packagingFormDetails.outerPackagings ? this.packagingFormDetails.outerPackagings : [];
  }

  private getOptions(fieldName: string): CNSelectOption[] {
    switch (fieldName) {
      case this.fieldKeys.packagingType:
        return this.packagingTypes && this.packagingTypes.length
          ? this.packagingTypes
          : this.packagingFormDetails.packagingTypes && this.packagingFormDetails.packagingTypes.length
          ? this.packagingFormDetails.packagingTypes
          : [];

      case this.fieldKeys.packagingOption:
        return this.packagingOptions && this.packagingOptions.length
          ? this.packagingOptions
          : this.packagingFormDetails.packagingOptions && this.packagingFormDetails.packagingOptions.length
          ? this.packagingFormDetails.packagingOptions
          : [];

      case this.fieldKeys.outerPackaging:
        return this.outerPackagings && this.outerPackagings.length
          ? this.outerPackagings
          : this.packagingFormDetails.outerPackagings && this.packagingFormDetails.outerPackagings.length
          ? this.packagingFormDetails.outerPackagings
          : [];
    }
  }

  private initializeValues(pageFormControlObject: FormControlObject, field: any): any {
    switch (field.type) {
      case SharedConstants.inputFieldTypes.select:
        const options = this.getOptions(field.name);
        if (options.length) {
          field.options = options;

          pageFormControlObject[field.name] = this.crmFormService.initializeSelectOptions(field, pageFormControlObject, this.packagingFormDetails);
        }

        if (field.name !== this.fieldKeys.packagingType && !pageFormControlObject[field.name].value && pageFormControlObject[field.name].value !== '') {
          pageFormControlObject[field.name].disable();
        }
        break;
      case SharedConstants.inputFieldTypes.radio:
        pageFormControlObject[field.name] = this.crmFormService.initializeRadioValues(field, pageFormControlObject, this.packagingFormDetails);
        this.showManufacturingDate = this.packagingFormDetails.showManufacturingDate ? true : false;
        break;
      case SharedConstants.inputFieldTypes.number:
        if (field.name === this.fieldKeys.fillVolume && !pageFormControlObject[this.fieldKeys.outerPackaging].value) {
          pageFormControlObject[field.name].disable();
        } else {
          pageFormControlObject[field.name] = this.crmFormService.initializeTextFieldValues(field, pageFormControlObject, this.packagingFormDetails);
        }

        break;
    }
  }

  private subscribeFormChanges(pageFormControlObject: FormControlObject, field: any) {
    pageFormControlObject[field.name].valueChanges.subscribe((value: any) => {
      if (value != null) {
        // For displaying package type
        if (!this.isInitializing) {
          this.getFieldDependentValues(field.name, value);
          this.setChildFieldStates(field.name);
        }

        switch (field.type) {
          case SharedConstants.inputFieldTypes.select:
          case SharedConstants.inputFieldTypes.radio:
            if (!this.isInitializing) {
              this.updateStoreEvent.emit({
                value: field.type === SharedConstants.inputFieldTypes.radio ? value : value[SharedConstants.options.value],
                fieldName: field.name,
                packagingIndex: this.packagingFormDetails.packagingIndex
              });
              if (field.name === this.fieldKeys.showManufacturingDate) {
                this.showManufacturingDate = value === _.keys(Confirmation)[0] ? true : false;
              }
            }
            break;

          case SharedConstants.inputFieldTypes.number:
            if (field.name === this.fieldKeys.fillVolume) {
              if (this.validatorService.isFillVolumeValid(value, this.fillVolumeRanges)) {
                this.showFillVolumeError = false;

                if (!this.isInitializing) {
                  this.updateStoreEvent.emit({
                    value: value,
                    fieldName: field.name,
                    packagingIndex: this.packagingFormDetails.packagingIndex
                  });
                }
              } else {
                if (!this.isInitializing && value.trim() === '') {
                  this.updateStoreEvent.emit({
                    value: value,
                    fieldName: field.name,
                    packagingIndex: this.packagingFormDetails.packagingIndex
                  });
                }
                this.showFillVolumeError = true;
                this.fillvolumeErrorRange = this.fillVolumeRanges ? this.fillVolumeRanges.join(' | ') : '';
              }
            } else {
              this.showBatchSizeError = this.validatorService.isBatchSizeValid(value) ? false : true;

              if (!this.isInitializing) {
                this.updateStoreEvent.emit({
                  value: value,
                  fieldName: field.name,
                  packagingIndex: this.packagingFormDetails.packagingIndex
                });
              }
            }
            break;
        }

        this.updateForm();
      }
    });
  }

  private buildForm(): void {
    this.packagingFormControlObject = this.generateFormControlObj();
    this.packagingForm = this.formBuilder.group(this.packagingFormControlObject);
    setTimeout(() => {
      this.formIsReady = true;
      this.isInitializing = false;
      this.updateForm();
    }, 600);
  }

  //#endregion

  //#region  utility functions
  private getFieldDependentValues(fieldName: string, value: any): void {
    switch (fieldName) {
      case this.fieldKeys.packagingType:
        this.packageType = value[SharedConstants.options.value];

        this.getPackagingTypeDependentOptionsEvent.emit({
          packagingTypeId: value[SharedConstants.options.index],
          packagingIndex: this.packagingFormDetails.packagingIndex
        });

        break;
      case this.fieldKeys.packagingOption:
        if (value[SharedConstants.options.value] !== '') {
          this.getPackagingOptioneDependentOptionsEvent.emit({
            packagingOptionId: value[SharedConstants.options.index],
            packagingIndex: this.packagingFormDetails.packagingIndex
          });
        }
        break;
      case this.fieldKeys.outerPackaging:
        if (value[SharedConstants.options.value] !== '') {
          this.getFillVolumeValidRangeEvent.emit({
            outerPackagingId: value[SharedConstants.options.index],
            packagingIndex: this.packagingFormDetails.packagingIndex
          });
        }
        break;
    }
  }

  /**
   * based on parent field set children states
   * @param fieldName
   */
  private setChildFieldStates(fieldName: string): void {
    switch (fieldName) {
      case this.fieldKeys.packagingType:
        this.reinitializeFields([this.fieldKeys.packagingOption, this.fieldKeys.outerPackaging, this.fieldKeys.fillVolume]);
        break;
      case this.fieldKeys.packagingOption:
        this.reinitializeFields([this.fieldKeys.outerPackaging, this.fieldKeys.fillVolume]);
        break;
      case this.fieldKeys.outerPackaging:
        this.reinitializeFields([this.fieldKeys.fillVolume]);
        this.enableFields([this.fieldKeys.fillVolume]);

        break;
    }
  }

  private reinitializeFields(fieldNames: string[]): void {
    fieldNames.forEach(field => {
      this.packagingForm.get(field).disable();
      this.packagingForm.get(field).reset();

      if (field === this.fieldKeys.fillVolume) {
        this.showFillVolumeError = false;
      }
      this.updateStoreEvent.emit({
        value: '',
        fieldName: field,
        packagingIndex: this.packagingFormDetails.packagingIndex
      });
    });
  }

  private enableFields(fieldNames: string[]): void {
    fieldNames.forEach(field => {
      this.packagingForm.get(field).enable();
    });
  }

  private packageTypeStyle(packageType) {
    return packageType && packageType.length > 0 ? packageType.replace(/\s+/g, '-').toLowerCase() : '';
  }

  //#endregion
}
