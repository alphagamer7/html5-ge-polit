import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { SharedConstants } from '../constants/shared-constants';

@Injectable()
export class ValidatorService {
  constructor() {}

  trimFilelds(formControl: AbstractControl) {
    if (formControl && formControl.value && !formControl.value.replace(/\s/g, '').length) {
      formControl.setValue('');
    }
    return (formControl.value || '').trim().length ? null : { whitespace: true };
  }

  trimFileldsNotRequired(formControl: AbstractControl) {
    if (formControl && formControl.value && !formControl.value.replace(/\s/g, '').length) {
      formControl.setValue('');
    }
    return null;
  }

  /**
   * for formcontrol field validation
   * @param formControl
   */
  numberWithDecimalFields(formControl: AbstractControl) {
    const regex = new RegExp(/^0$|^[0-9]\d*$|^\.\d+$|^0\.\d*$|^[1-9]\d*\.\d*$/);
    if (formControl.value && formControl.value.length) {
      if (!regex.test(formControl.value)) {
        return {
          numberWithDecimalFields: true
        };
      } else {
        return null;
      }
    }
  }

  numberOnlyFields(formControl: AbstractControl) {
    const regex = new RegExp(/^[0-9]*$/);
    if (formControl.value && formControl.value.length) {
      if (!regex.test(formControl.value)) {
        return {
          numberOnlyFields: true
        };
      } else {
        return null;
      }
    }
  }

  public requiredValidation(field: string, form: FormGroup): boolean {
    if (form.get(field).errors && form.get(field).errors.required) {
      return form.get(field).errors.required;
    }
  }

  /**
   * for string input
   * @param value
   */
  handleNumberWithDigit(value: string): boolean {
    const regex = new RegExp(/^0$|^[1-9]\d*$|^\.\d+$|^0\.\d*$|^[1-9]\d*\.\d*$/);
    if (value && value.length) {
      if (!regex.test(value)) {
        console.log('failed regex');
        return true;
      }
    }
    return false;
  }

  /**
   * validation for fill volume
   * @param value
   * @param fillVolumeRanges
   */
  isFillVolumeValid(value: number, fillVolumeRanges: string[]): boolean {
    if (!value.toString().length || !fillVolumeRanges) {
      return false;
    } else {
      const matchedRanges = fillVolumeRanges.filter(range => {
        const ranges = range.split(' - ');
        if (
          (Number(value.toString()) >= Number(ranges[0].toString()) && Number(value.toString()) <= Number(ranges[1].toString())) ||
          !value.toString().length
        ) {
          return ranges;
        }
      });
      return matchedRanges.length ? true : false;
    }
  }

  isBatchSizeValid(value: number) {
    if (!value.toString().length) {
      return false;
    } else {
      if (Number(value) <= SharedConstants.maxBatchSize && Number(value) > 0) {
        return true;
      }
      return false;
    }
  }

  isValidNaOH(formControl: AbstractControl) {
    const unit = formControl.parent ? formControl.parent.value.concentrationUnit : '';
    const concentration = formControl.value ? formControl.value : '';

    if (concentration) {
      switch (unit) {
        case 'M':
          return Number(concentration.toString()) > 3 ? { isInValidNaOH: true } : null;

        case 'g':
          return Number(concentration.toString()) > 120 ? { isInValidNaOH: true } : null;
        default:
          return null;
      }
    } else {
      return null;
    }
  }

  validateMaxVal(prms: any) {
    return (control: AbstractControl): { [key: string]: boolean } => {
      if (control.value) {
        const val: number = Number(control.value.toString());

        return val > prms.max ? { max: true } : null;
      } else {
        return null;
      }
    };
  }
}
