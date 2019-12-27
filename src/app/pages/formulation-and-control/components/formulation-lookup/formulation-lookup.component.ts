import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import * as _ from 'lodash';

import { RegionService } from '@comparenetworks/imsmart-web';

import { CrmDataTableHeader } from 'src/app/shared/types/crm-datatable.type';
import { ChemicalFormulationDetails } from 'src/app/shared/types/chemical-formulation.type';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';
import { PowderConcentrationUnit, LiquidConcentrationUnit, ProductType } from 'src/app/shared/constants/shared-enum';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-formulation-lookup',
  templateUrl: './formulation-lookup.component.html',
  styleUrls: ['./formulation-lookup.component.scss']
})
export class FormulationLookupComponent {
  @Input() productType: string;
  @Input() searchText: string;
  @Input() headers: CrmDataTableHeader[];
  @Input() filteredFormulations: ChemicalFormulationDetails[];
  @Input() selectedFormulations: ChemicalFormulationDetails[];
  @Input() formulationManager: any;
  @Input() searchType: string;

  isLoading: boolean;
  lookupOffset: number;

  private selectedItems: ChemicalFormulationDetails[];

  constructor(private regionService: RegionService, private modalCtrl: ModalController, private alertService: AlertService) {
    this.selectedItems = [];
  }

  async handlePagination(event) {
    if (!this.isLoading) {
      this.isLoading = true;
      this.lookupOffset += SharedConstants.lookupLimit;
      await this.formulationManager.filterChemicalFormulations(this.searchText);
      this.isLoading = false;
    }
  }

  handleItemSelection(item: ChemicalFormulationDetails) {
    let isAlreadySelected = false;
    this.selectedFormulations.filter(formula => {
      if (formula.id === item.id) {
        isAlreadySelected = true;
      }
    });
    if (item.isSelected) {
      if (this.selectedFormulations.length + this.selectedItems.length >= SharedConstants.maxFormulations) {
        this.alertService.presentAlert(
          this.regionService.language['warning'],
          this.regionService.language['warningMaxFormulation'],
          [this.regionService.language['confirmation']],
          'alert-info'
        );
        item.isSelected = false;
      } else if (isAlreadySelected) {
        this.alertService.presentAlert(
          this.regionService.language['warning'],
          this.regionService.language['alreadExist'],
          [this.regionService.language['confirmation']],
          'alert-info'
        );
        item.isSelected = false;
      } else {
        // set default ConcentrationUnit
        item.concentrationUnit = this.productType === _.keys(ProductType)[0] ? LiquidConcentrationUnit.l : PowderConcentrationUnit.g;
        item.concentrationUnit = item.chemicalFormulation === SharedConstants.NaOH ? LiquidConcentrationUnit.M : LiquidConcentrationUnit.l;

        item.hasRequiredError = true;
        this.selectedItems.push(item);
      }
    } else {
      this.selectedItems = this.selectedItems.filter(itm => itm.id !== item.id);
    }
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  save() {
    this.modalCtrl.dismiss(this.selectedItems);
  }
}
