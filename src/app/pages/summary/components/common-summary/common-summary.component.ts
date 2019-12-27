import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

import { RegionService } from '@comparenetworks/imsmart-web';
import { SharedConstants } from 'src/app/shared/constants/shared-constants';
import * as _ from 'lodash';

@Component({
  selector: 'common-summary',
  templateUrl: './common-summary.component.html',
  styleUrls: ['./common-summary.component.scss']
})
export class CommonSummaryComponent implements OnChanges {
  @Input() showHeader: boolean;
  @Input() genericSummary: any;
  @Input() title: string;
  @Input() path: string;
  @Input() fieldKeys: any;
  @Input() hasError: boolean;

  @Output() handleNavigation: EventEmitter<any> = new EventEmitter();
  objectKeys = Object.keys;

  leftColumnKeys = {};
  rightColumnKeys = {};

  private pageDetails = SharedConstants.pageDetails;

  constructor(private regionService: RegionService) {}

  ngOnChanges(changes: SimpleChanges): void {
    _.keys(this.fieldKeys)
      .splice(0, _.keys(this.fieldKeys).length / 2)
      .map(key => {
        this.leftColumnKeys[key] = this.fieldKeys[key];
      });
    _.keys(this.fieldKeys)
      .splice(_.keys(this.fieldKeys).length / 2, _.keys(this.fieldKeys).length)
      .map(key => {
        this.rightColumnKeys[key] = this.fieldKeys[key];
      });
  }

  handleNavigate(pageType: string) {
    this.handleNavigation.emit(pageType);
  }
}
