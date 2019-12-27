import { Component, Input, Output, EventEmitter } from '@angular/core';

import { RegionService } from '@comparenetworks/imsmart-web';

@Component({
  selector: 'header-section',
  templateUrl: 'header-section.component.html',
  styleUrls: ['./header-section.component.scss']
})
export class HeaderSectionComponent {
  @Input()
  pageType: string;

  @Input() hideBreadcrumb: boolean;

  @Output() showWarningsOnBreadcrumbNavigation: EventEmitter<any> = new EventEmitter();

  constructor(private regionService: RegionService) {}
}
