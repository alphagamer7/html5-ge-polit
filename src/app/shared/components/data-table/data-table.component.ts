import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import * as _ from 'lodash';

import { RegionService } from '@comparenetworks/imsmart-web';

import { CrmDataTableHeader } from 'src/app/shared/types/crm-datatable.type';
import { ChemicalFormulationDetails } from 'src/app/shared/types/chemical-formulation.type';

import { ValidatorService } from 'src/app/shared/services/validator.service';
import { AlertService } from '../../services/alert.service';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';
import { ProductType, PowderConcentrationUnit, LiquidConcentrationUnit } from 'src/app/shared/constants/shared-enum';

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnChanges, OnInit, AfterViewChecked {
  @Input() headers: CrmDataTableHeader[];
  @Input() items: ChemicalFormulationDetails[];
  @Input() hasMoreRecords: boolean;
  @Input() isInitialView: boolean;
  @Input() isSelectable: boolean;

  @Input() showRadio: boolean;
  @Input() viewOnly: boolean;
  @Input() showWarnings: boolean;
  @Input() isSummary: boolean;
  @Input() displayModal: boolean;
  @Input() isLookup: boolean;
  @Input() productType: string;

  @Output() selectedUnitChange = new EventEmitter<any>(true);
  @Output() paginateAction: EventEmitter<any> = new EventEmitter();
  @Output() setConcentration: EventEmitter<any> = new EventEmitter(true);
  @Output() deleteRecord: EventEmitter<any> = new EventEmitter();
  @Output() itemSelection: EventEmitter<any> = new EventEmitter();
  @Output() formulationValidationError: EventEmitter<any> = new EventEmitter(true);
  @Output() requiredField: EventEmitter<any> = new EventEmitter();

  selectedSortKey: string;
  selectedItemIndex: number;
  isPaginating: boolean;
  concentrationUnit: string;
  concentration: string;
  showConcentrationError: boolean;
  concentrationUnits: any;

  objectKeys = Object.keys;

  customPopoverOptions2: any = {
    cssClass: SharedConstants.cssClass.col2
  };
  private chemicalFormGroup: FormGroup;
  get concentrationDetails(): any {
    return this.chemicalFormGroup.get(SharedConstants.concentrationDetails);
  }

  constructor(
    private validatorService: ValidatorService,
    private regionService: RegionService,
    private formBuilder: FormBuilder,
    private validator: ValidatorService,
    private alertService: AlertService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.concentrationUnits = this.productType === _.keys(ProductType)[0] ? LiquidConcentrationUnit : PowderConcentrationUnit;

    this.chemicalFormGroup = this.formBuilder.group({
      concentrationDetails: this.formBuilder.array([])
    });
    if (!this.isSelectable) {
      if (this.items.length) {
        try {
          this.initializeConcentrationDetails(this.items);
          this.chemicalFormGroup.setControl(SharedConstants.concentrationDetails, this.formBuilder.array(this.concentrationDetails || []));
        } catch (e) {}
      }

      this.formulationValidationError.emit({
        validationError: this.allControlsValid(this.concentrationDetails.controls),
        validationType: SharedConstants.validationStatus.formulation
      });
    }
  }

  initializeConcentrationDetails(items): any {
    return items.map(item => {
      this.concentrationDetails.push(this.buildConcentration(item));
    });
  }

  buildConcentration(item) {
    let validators = [];
    // NOTE -  Max concentration 999 if not specified max concentration
    item.maxConcentration = item.maxConcentration ? item.maxConcentration : 999;
    validators = [
      this.validator.numberWithDecimalFields,
      Validators.required,
      Validators.min(0.0001),
      this.validatorService.validateMaxVal({ max: item.maxConcentration })
    ];

    if (item.chemicalFormulation === SharedConstants.NaOH) {
      validators.push(this.validatorService.isValidNaOH);
    }
    return this.formBuilder.group({
      concentrationDetail: [item.concentration ? item.concentration : '', validators],
      itemId: [item.id],
      concentrationUnit: [item.concentrationUnit ? item.concentrationUnit : '']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items && changes.items.currentValue && !this.isSelectable) {
      if (changes.items.currentValue > changes.items.previousValue) {
        // filter values if they exist in previous value
        changes.items.currentValue
          .filter(val => !changes.items.previousValue.includes(val))
          .map(item => {
            this.concentrationDetails.controls.unshift(this.buildConcentration(item));
          });
        this.formulationValidationError.emit({
          validationError: true,
          validationType: SharedConstants.validationStatus.formulation
        });
      }
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  deleteItem(itemId) {
    this.alertService.presentCancellationAlert(() => {
      this.concentrationDetails.removeAt(this.concentrationDetails.value.findIndex(concentration => concentration.itemId === itemId));
      this.deleteRecord.emit(itemId);
    });
  }

  handlePagination(infiniteScroll) {
    this.isPaginating = true;
    const event = {
      infiniteScroll: infiniteScroll
    };

    this.paginateAction.emit(event);
  }

  handleItemSelection(item: any): void {
    this.items.map(itm => {
      if (itm.id === item.id) {
        if (itm.isAllowed.toString() === '1') {
          itm.isSelected = !itm.isSelected;
          this.itemSelection.emit(itm);
        } else {
          this.alertService.presentAlert(
            this.regionService.language['chemicalFormulationNotAllowed'],
            `${this.regionService.language['notAllowedHeader']} "${item['chemicalName'].toLowerCase()}"  ${this.regionService.language['notAllowedTail']}`,
            [this.regionService.language['ok']],
            'alert-info'
          );
        }
        return itm;
      } else {
        return itm;
      }
    });
  }

  handleSelectedUnitChange(params: any): void {
    params.item.concentrationUnit = params.event.target.value;
    this.selectedUnitChange.emit({
      concentrationUnit: params.event.target.value,
      item: params.item
    });
  }

  saveConcentration(params: any) {
    params.item.concentration = params.event.target.value;
    if (params.item.chemicalFormulation === SharedConstants.NaOH && this.concentrationDetails.controls[params.index].valid) {
      this.setConcentration.emit({
        concentration: params.event.target.value,
        item: params.item
      });
    } else if (params.item.chemicalFormulation !== SharedConstants.NaOH) {
      this.setConcentration.emit({
        concentration: params.event.target.value,
        item: params.item
      });
    }

    // using time out because when setting initial value, this.concentrationDetails.valid === false because it is taking time to set the value.
    this.formulationValidationError.emit({
      validationError: this.allControlsValid(this.concentrationDetails.controls),
      validationType: SharedConstants.validationStatus.formulation
    });
  }

  custom(index, item) {
    return item.id;
  }

  setConcentrationValues(params) {
    // if (this.allControlsValid(this.concentrationDetails.controls)) {
    if (params.item.chemicalFormulation === SharedConstants.NaOH && this.concentrationDetails.controls[params.index].valid) {
      this.setConcentration.emit({
        concentration: params.event.target.value,
        item: params.item
      });
    } else if (params.item.chemicalFormulation !== SharedConstants.NaOH) {
      this.setConcentration.emit({
        concentration: params.event.target.value,
        item: params.item
      });
    }

    // }
  }

  private allControlsValid(controls: any) {
    return controls.filter(control => !control.valid).length > 0;
  }
}
