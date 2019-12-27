import { Component, ViewChildren, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { RegionService, PDFParams, EmailParams, PDFService } from '@comparenetworks/imsmart-web';

import { NavigationService } from 'src/app/shared/services/navigation.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SummaryManager } from './summary.manager';

import { WizardState } from 'src/app/shared/store/reducers/reducer';

import { CrmDataTableHeader } from 'src/app/shared/types/crm-datatable.type';
import { SharedConstants } from 'src/app/shared/constants/shared-constants';

@Component({
  selector: 'summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss']
})
export class SummaryPage {
  @ViewChildren('pdfBody', { read: ViewContainerRef })
  pdfBody: ViewContainerRef;
  pageType: string;
  private pageDetails = SharedConstants.pageDetails;
  formulationTableHeaders: CrmDataTableHeader[];
  qualityControlTestHeaders: CrmDataTableHeader[];
  preventShare: boolean;
  pdfAssetTitle: string;
  customerName: string;
  pdfParams: PDFParams;
  emailParams: EmailParams;
  companyLocation: string;
  isProductname: any;
  productName: any;

  showWarning: boolean;

  private summaryManager: SummaryManager;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private regionService: RegionService,
    private utilityService: UtilityService,
    private pdfService: PDFService,
    private store: Store<WizardState>,
    private alertService: AlertService,
    private navigationService: NavigationService
  ) {
    this.summaryManager = new SummaryManager(store, alertService, regionService, navigationService, pdfService);

    // Whenever routed to summary page check for error
    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.summaryManager.showPageError();
      this.showWarning = this.summaryManager.hasInvalidForms();
    });

    this.pageType = this.activatedRoute.snapshot.routeConfig.path;
    this.summaryManager.init(this.pageType);
    this.summaryManager.generalInformation$.subscribe(result => {
      this.customerName = result.companyName;
      this.pdfAssetTitle = `${this.customerName} - Product Description - ${new Date().toISOString().split('T')[0]}`;
      this.companyLocation = result.manufacturingLocation;
    });

    this.formulationTableHeaders = this.utilityService.getTableHeaderElements(SharedConstants.formulationTableHeaders);
    this.qualityControlTestHeaders = this.utilityService.getTableHeaderElements(SharedConstants.qualityControlTestHeaders).filter(header => header.key !== '');
  }

  handleNavigation(pageType: string) {
    this.summaryManager.handleNavigation(pageType);
  }

  handleSaveLater() {
    this.summaryManager.handleSaveLater();
  }
  handleValidation() {
    this.summaryManager.handleValidation();
  }

  handleMailPdf() {
    if (this.preventShare) {
      return;
    }
    this.preventShare = true;
    this.initEmailPdfParams();

    this.summaryManager.saveAndMailPdf(this.pdfParams, this.emailParams).subscribe(result => {});
    this.emailActionListener();
  }

  initEmailPdfParams() {
    this.pdfParams = {
      title: this.pdfAssetTitle,
      html: this.pdfBody['_results'][0].element.nativeElement.innerHTML,
      styleUrl: SharedConstants.summaryPdfStylePath,
      saveType: 2,
      fileName: this.pdfAssetTitle,
      pageHeader: '<html></html>',
      pageHeaderHeight: '20',
      pageFooter: '<html></html>',
      pageFooterHeight: '20'
    };

    this.emailParams = {
      subject: `${SharedConstants.emailSubject} –  ${this.customerName} – Product Description `,
      message: SharedConstants.emailMessage,
      to: '',
      cc: '',
      bcc: ''
    };
  }

  private emailActionListener() {
    window.addEventListener('didReceiveEmailState', (data: any) => {
      this.preventShare = false;
      if (data.detail.results.emailState >= 2) {
        this.router.navigate(['confirmation']);
      }
    });
  }
}
