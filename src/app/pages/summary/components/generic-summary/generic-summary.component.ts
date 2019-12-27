import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

import { RegionService } from '@comparenetworks/imsmart-web';
import { SharedConstants } from 'src/app/shared/constants/shared-constants';
import * as _ from 'lodash';

@Component({
  selector: 'generic-summary',
  templateUrl: './generic-summary.component.html',
  styleUrls: ['./generic-summary.component.scss']
})
export class GenericSummaryComponent {
  @Input() genericSummary: any;
  @Input() title: string;
  @Input() path: string;
  @Input() fieldKeys: any;
  @Input() hasError: boolean;

  @Output() handleNavigation: EventEmitter<any> = new EventEmitter();
  objectKeys = Object.keys;

  private pageDetails = SharedConstants.pageDetails;

  constructor(private regionService: RegionService) {}

  handleNavigate(pageType: string) {
    this.handleNavigation.emit(pageType);
  }
}
