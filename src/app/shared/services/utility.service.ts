import { Injectable } from '@angular/core';
import { RegionService } from '@comparenetworks/imsmart-web';
import { CrmDataTableHeader } from '../types/crm-datatable.type';

@Injectable()
export class UtilityService {
  constructor(private regionService: RegionService) {}

  getTableHeaderElements(tableHeader: string[]): any {
    return tableHeader.map(key => {
      return <CrmDataTableHeader>{
        title: this.regionService.language[key],
        key: key
      };
    });
  }
}
