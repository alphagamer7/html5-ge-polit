import { Component, Input } from '@angular/core';

import { RegionService } from '@comparenetworks/imsmart-web';
import { SharedConstants } from 'src/app/shared/constants/shared-constants';

@Component({
  selector: 'package-content',
  templateUrl: './package-content.component.html',
  styleUrls: ['./package-content.component.scss']
})
export class PackageContentComponent {
  @Input() packageContent: any;
  @Input() packageTypeClass: string;
  @Input() packageFeildKeys: any;
  @Input() showManufacturingDate: boolean;

  @Input() showAppendix: boolean;
  objectKeys = Object.keys;

  formualtionFieldKeys = SharedConstants.formualtionFieldNames;

  constructor(private regionService: RegionService) {}
}
