import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { RegionService } from '@comparenetworks/imsmart-web';

import { CrmDataTableHeader } from 'src/app/shared/types/crm-datatable.type';
import { FormulationDetails } from 'src/app/shared/types/formulation-details.types';

@Component({
  selector: 'formulation-summary',
  templateUrl: './formulation-summary.component.html',
  styleUrls: ['./formulation-summary.component.scss']
})
export class FormulationSummaryComponent {
  @Input() formulationSummary: FormulationDetails;
  @Input() formulationTableHeaders: CrmDataTableHeader[];
  @Input() qualityControlTestHeaders: CrmDataTableHeader[];
  @Input() title: string;
  @Input() path: string;
  @Input() hasError: boolean;

  @Output() handleNavigation: EventEmitter<any> = new EventEmitter();

  constructor(private regionService: RegionService) {}

  handleNavigate(pageType: string) {
    this.handleNavigation.emit(pageType);
  }
}
