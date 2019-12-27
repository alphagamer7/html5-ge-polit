import { Component, OnInit, Input } from '@angular/core';

import * as _ from 'lodash';

import { RegionService } from '@comparenetworks/imsmart-web';

@Component({
  selector: 'manufacturing-info',
  templateUrl: './manufacturing-info.component.html',
  styleUrls: ['./manufacturing-info.component.scss']
})
export class ManufacturingInfoComponent {
  @Input()
  guideInfo: string;

  constructor(private regionService: RegionService) {}
}
