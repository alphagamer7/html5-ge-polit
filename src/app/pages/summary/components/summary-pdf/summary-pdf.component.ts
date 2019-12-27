import { Component, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';

import * as _ from 'lodash';

import { RegionService } from '@comparenetworks/imsmart-web';

import { CrmDataTableHeader } from 'src/app/shared/types/crm-datatable.type';

import { GeocodeService } from 'src/app/shared/services/geocode.service';

import { SharedConstants } from 'src/app/shared/constants/shared-constants';

@Component({
  selector: 'summary-pdf',
  templateUrl: './summary-pdf.component.html',
  styleUrls: ['./summary-pdf.component.scss']
})
export class SummaryPdfComponent implements OnChanges, AfterViewInit {
  @Input() generalPageSummary: any;
  @Input() formulationPageSummary: any;
  @Input() packagingPageSummary: any;
  @Input() manufacturingPageSummary: any;
  @Input() documentationPageSummary: any;

  @Input() generalPageFieldKeys: any;
  @Input() packagingPageFieldKeys: any;
  @Input() manufacturingPageFieldKeys: any;
  @Input() documentationPageFieldKeys: any;

  @Input() generalPageTitle: any;
  @Input() formulationPageTitle: any;
  @Input() packagingPageTitle: any;
  @Input() manufacturingPageTitle: any;
  @Input() documentationPageTitle: any;
  @Input() companyLocation: any;

  @Input() formulationTableHeaders: CrmDataTableHeader[];
  @Input() qualityControlTestHeaders: CrmDataTableHeader[];

  leftPackagingColumnKeys = {};
  rightPackagingColumnKeys = {};

  leftManufacturingColumnKeys = {};
  rightManufacturingColumnKeys = {};

  showMap: boolean;

  objectKeys = Object.keys;

  constructor(private regionService: RegionService, private geocodeService: GeocodeService) {}

  generateMap() {
    const zoom = 10;

    // since company location is dynamic can't put the url to constant file and interpolate
    const staticMapUrl =
      'https://maps.googleapis.com/maps/api/staticmap?center=' +
      this.companyLocation +
      '&zoom=' +
      zoom +
      '&size=200x200&maptype=roadmap&markers=size:mid%7Ccolor:blue%7C' +
      this.companyLocation.replace(' ', '+') +
      '&key=' +
      SharedConstants.googleMapAipKey;

    // Display the Image of Google Map.

    document.getElementById('googleMap').setAttribute('src', staticMapUrl);
  }

  ngAfterViewInit(): void {
    if (this.companyLocation && this.companyLocation !== SharedConstants.locationDefault) {
      this.showMap = true;
      this.generateMap();
    } else {
      this.showMap = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.packagingPageFieldKeys && changes.packagingPageFieldKeys.currentValue) {
      _.keys(this.packagingPageFieldKeys)
        .splice(0, _.keys(this.packagingPageFieldKeys).length / 2)
        .map(key => {
          this.leftPackagingColumnKeys[key] = this.packagingPageFieldKeys[key];
        });
      _.keys(this.packagingPageFieldKeys)
        .splice(_.keys(this.packagingPageFieldKeys).length / 2, _.keys(this.packagingPageFieldKeys).length)
        .map(key => {
          this.rightPackagingColumnKeys[key] = this.packagingPageFieldKeys[key];
        });
    }

    if (changes.manufacturingPageFieldKeys && changes.manufacturingPageFieldKeys.currentValue) {
      _.keys(this.manufacturingPageFieldKeys)
        .splice(0, _.keys(this.manufacturingPageFieldKeys).length / 2)
        .map(key => {
          this.leftManufacturingColumnKeys[key] = this.manufacturingPageFieldKeys[key];
        });
      _.keys(this.manufacturingPageFieldKeys)
        .splice(_.keys(this.manufacturingPageFieldKeys).length / 2, _.keys(this.manufacturingPageFieldKeys).length)
        .map(key => {
          this.rightManufacturingColumnKeys[key] = this.manufacturingPageFieldKeys[key];
        });
    }
  }
}
