import { Component, Input, Output, EventEmitter } from '@angular/core';

import { RegionService } from '@comparenetworks/imsmart-web';

import { BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  @Input()
  pageType: string;

  @Output() showWarningsOnBreadcrumbNavigation: EventEmitter<any> = new EventEmitter();

  constructor(public breadcrumbService: BreadcrumbService, private regionService: RegionService) {}

  goToPosition(position): void {
    this.breadcrumbService.goToPosition(position);
  }

  getPageStatus(path: any, index: number): boolean {
    return index === this.breadcrumbService.index
      ? false
      : this.breadcrumbService.visitStatus[index] && this.breadcrumbService.visitStatus[index].pageType === path
      ? true
      : false;
  }

  showErrorStatus(path: string): boolean {
    const showErrors = this.breadcrumbService.getPageErrorStatus(path);
    if (showErrors) {
      this.showWarningsOnBreadcrumbNavigation.emit({ pageType: path });
    }

    return showErrors;
  }
}
