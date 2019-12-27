import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { RegionService } from '@comparenetworks/imsmart-web';

import { QualityControlTest } from 'src/app/shared/types/quality-control-test.type';
import { CrmDataTableHeader } from 'src/app/shared/types/crm-datatable.type';

import { TypeOfData } from 'src/app/shared/constants/shared-enum';
import { SharedConstants } from '../../constants/shared-constants';

@Component({
  selector: 'quality-control',
  templateUrl: './quality-control.component.html',
  styleUrls: ['./quality-control.component.scss']
})
export class QualityControlComponent implements OnInit, OnChanges {
  @Input() selectedQualityControl: QualityControlTest[];
  @Input() headers: CrmDataTableHeader[];
  @Input() viewOnly: boolean;
  @Input() showWarnings: boolean;

  @Output() handleDeleteItem = new EventEmitter<any>();
  @Output() handleTypeDataSelection = new EventEmitter<any>();
  @Output() validationError: EventEmitter<any> = new EventEmitter();
  @Output() requiredField: EventEmitter<any> = new EventEmitter();
  @Output() setSpecification = new EventEmitter<any>(true);

  selectedtypeOfData = TypeOfData.historical;
  typesOfData = TypeOfData;
  objectKeys = Object.keys;

  constructor(private regionService: RegionService) {}

  ngOnInit(): void {
    this.validationError.emit({
      requiredError: !(this.isNoTypeOfDataValid() && this.isSpecificationsValid()),
      validationType: SharedConstants.validationStatus.quality
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedQualityControl && changes.selectedQualityControl.currentValue) {
      if (changes.selectedQualityControl.currentValue > changes.selectedQualityControl.previousValue) {
        let requiredError = false;

        changes.selectedQualityControl.currentValue.map((item: QualityControlTest) => {
          if (item['handleSpecificationError']) {
            requiredError = true;
          }
        });
        this.validationError.emit({ requiredError: requiredError, validationType: SharedConstants.validationStatus.quality });
      }
    }
  }

  handleTypeData(params: any) {
    // Reset value if already selected same type of data

    if (params.event.target.value.length) {
      this.handleTypeDataSelection.emit({
        typeOfData: params.event.detail.value,
        item: params.item,
        index: params.index
      });

      this.validationError.emit({
        requiredError: !(this.isNoTypeOfDataValid() && this.isSpecificationsValid()),
        validationType: SharedConstants.validationStatus.quality
      });
    }
    if (this.isQualityControlTestExist({ ...params.item }, params.event.detail.value)) {
      params.event.target.value = '';
    }
  }

  private isQualityControlTestExist(value: any, typeOfData: string): boolean {
    return (
      this.selectedQualityControl.filter(spec => spec.qualityControlTest === value.qualityControlTest && spec.typeOfData.trim() === typeOfData.trim())
        .length === 1
    );
  }

  hasSpecificationRequired(params: any) {
    // trim initial spaces
    if (params.event.detail.value && !params.event.detail.value.replace(/\s/g, '').length) {
      params.event.detail.value = params.event.detail.value.trim();
    }

    if (params.event.detail.value && params.event.detail.value.trim().length) {
      this.validationError.emit({
        requiredError: !(this.isNoTypeOfDataValid() && this.isSpecificationsValid()),
        validationType: SharedConstants.validationStatus.quality
      });
    } else {
      this.validationError.emit({
        requiredError: !(this.isNoTypeOfDataValid() && this.isSpecificationsValid()),
        validationType: SharedConstants.validationStatus.quality
      });
    }

    this.setSpecification.emit({
      specification: params.event.detail.value,
      item: params.item,
      index: params.index
    });
  }

  //#region utility

  /**
   * to check whether both (typeofdata and specification) are filled in all rows
   */

  private isNoTypeOfDataValid(): boolean {
    return this.selectedQualityControl.filter(item => item.typeOfData === '').length > 0 ? false : true;
  }

  private isSpecificationsValid(): boolean {
    return this.selectedQualityControl.filter(item => item.specification === '').length > 0 ? false : true;
  }
  //#endregion
}
