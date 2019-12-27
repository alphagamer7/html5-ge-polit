import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

import { RegionService } from '@comparenetworks/imsmart-web';
import { Packaging } from 'src/app/shared/types/packaging.type';

@Component({
  selector: 'packaging-summary',
  templateUrl: './packaging-summary.component.html',
  styleUrls: ['./packaging-summary.component.scss']
})
export class PackagingSummaryComponent implements OnChanges {
  @Input() packaging: Packaging;
  @Input() title: string;
  @Input() path: string;
  @Input() fieldKeys: any;
  @Input() hasError: boolean;

  @Output() handleNavigation: EventEmitter<any> = new EventEmitter();

  objectKeys = Object.keys;
  private packagingInfo;

  constructor(private regionService: RegionService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.packaging && changes.packaging.currentValue) {
      const packagingTemp = JSON.parse(JSON.stringify(this.packaging));
      this.packagingInfo = packagingTemp.map(item => {
        delete item.packagingIndex;
      });
      this.packagingInfo = packagingTemp;
    }
  }

  handleNavigate(pageType: string) {
    this.handleNavigation.emit(pageType);
  }
}
