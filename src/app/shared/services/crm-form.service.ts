import { Injectable } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';

import { Observable, combineLatest } from 'rxjs';

import * as _ from 'lodash';

import { map } from 'rxjs/operators';
import { ValidatorService } from './validator.service';
import { CrmInput, CNSelectOption } from '../types/crm-input.type';
import { SharedConstants } from '../constants/shared-constants';

export interface FormControlObject {
  [key: string]: FormControl;
}

@Injectable()
export class CRMFormService {
  constructor(private validator: ValidatorService) {}

  /**
   * add form control validations for a field
   * @param field
   */
  buildFormControl(field: CrmInput): any {
    const validators: any[] = [];

    if (field.required) {
      validators.push(<any>Validators.required);
    }
    if (field.trim) {
      validators.push(this.validator.trimFilelds);
    }
    if (field.trimNotRequired) {
      validators.push(this.validator.trimFileldsNotRequired);
    }
    // custom validators for fields numberWithDigit & number only
    if (field.numberWithDigit) {
      validators.push(this.validator.numberWithDecimalFields);
    }
    // custom validators for fields  number only
    if (field.number) {
      validators.push(this.validator.numberOnlyFields);
    }
    if (field.name === SharedConstants.pageDetails.documentation.fieldKeys.daysUntilExpiration) {
      validators.push(Validators.max(9999));
    }
    return new FormControl(null, validators);
  }

  //#region initialize form fields
  /**
   * initialize previous selected options when form is building
   * @param field
   * @param settingsFormControlObject
   * @param formDetails
   */
  initializeSelectOptions(field: CrmInput, settingsFormControlObject: FormControlObject, formDetails): any {
    field.options.forEach((option: CNSelectOption, index: number) => {
      if (option.value === formDetails[field.name]) {
        settingsFormControlObject[field.name].setValue(option);
      }
    });

    return settingsFormControlObject[field.name];
  }

  /**
   * initialize previous selected options for radio buttons when form is building
   * @param field
   * @param settingsFormControlObject
   * @param formDetails
   */
  initializeRadioValues(field: CrmInput, settingsFormControlObject: FormControlObject, formDetails): any {
    settingsFormControlObject[field.name].setValue(formDetails[field.name]);
    return settingsFormControlObject[field.name];
  }

  /**
   * initialize previous selected options for text fields when form is building
   * @param field
   * @param settingsFormControlObject
   * @param formDetails
   */
  initializeTextFieldValues(field: CrmInput, settingsFormControlObject: FormControlObject, formDetails): any {
    settingsFormControlObject[field.name].setValue(formDetails[field.name]);
    return settingsFormControlObject[field.name];
  }
  //#endregion

  /**
   * initialize dropdowns which are based on enum
   */
  generateOptopnsFromEnum(enumDetails: any): Observable<CNSelectOption[]> {
    return new Observable(observer => {
      let options: CNSelectOption[] = [];

      options = _.keys(enumDetails).map((key: any, index: number) => {
        return {
          index: index,
          label: enumDetails[key],
          value: key
        };
      });

      observer.next(options);
      observer.complete();
    });
  }
}
