import { Component, OnInit, Input } from '@angular/core';
import { CrmDataTableHeader } from 'src/app/shared/types/crm-datatable.type';
import { RegionService } from '@comparenetworks/imsmart-web';

@Component({
  selector: 'certificate-pdf',
  templateUrl: './certificate-pdf.component.html',
  styleUrls: ['./certificate-pdf.component.scss']
})
export class CertificatePdfComponent implements OnInit {
  @Input() qualityTestResults: any;
  @Input() produtDetails: any;
  @Input() title: string;
  @Input() headers: CrmDataTableHeader;

  constructor(private regionService: RegionService) {}

  ngOnInit() {
    // For dev test make same copy of element
    this.qualityTestResults = new Array(27).fill(this.qualityTestResults[0]);
  }
}
